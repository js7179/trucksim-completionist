import { Page, test, expect, Browser } from '@playwright/test';
import { adminAuthClient } from './supabase';
import { performLogin } from './utils/perform-login';
import cleanupSupabaseUser from './utils/supabase-cleanup';
import { getAchievementRegion, getObjectivesForAchievement } from './utils/page-operations';

const USER_DETAILS = {
    email: "remote-achievement@test.com",
    password: "RemoteAchievementTest",
    displayName: "RemoteAchievementTest"
};

let USER_UUID: string;
let pwBrowser: Browser;
let page: Page;

test.beforeAll(async ({browser}) => {
    // Cleanup any previous users associated with this email
    cleanupSupabaseUser(USER_DETAILS.email);

    // Create the user
    const { data, error: createError } = await adminAuthClient.createUser({
        email: USER_DETAILS.email,
        password: USER_DETAILS.password,
        email_confirm: true,
        user_metadata: { displayName: USER_DETAILS.displayName }
    });
    if(createError) throw createError;
    USER_UUID = data.user?.id as string;

    pwBrowser = browser;
    const browserContext = await browser.newContext();
    page = await browserContext.newPage();

    // Perform login
    await performLogin(page, USER_DETAILS.email, USER_DETAILS.password, USER_DETAILS.displayName);
});

test.afterAll(async () => {
    await page.close();

    cleanupSupabaseUser(USER_DETAILS.email);
});

test('Remote achievement interactivity', async () => {
    await test.step('Navigate to user page and wait for it to load', async () => {
        await page.goto(`/${USER_UUID}/ets2`);

        await page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'GET'
            && resp.status() === 200);

        // Test that we are logged in
        const displayNameElement = page.locator('span[class*="displayName"]');
        await expect(displayNameElement).toHaveText(USER_DETAILS.displayName);
        await expect(page.locator('p#loading-indicator')).toBeHidden();
    });

    await test.step('Marking off an achievement', async () => {
        const { region, completeCheckbox, achIcon } = getAchievementRegion(page, 'I Am a GPS');

        // Make sure achievement is visible and not marked off
        await expect(region).toBeVisible();
        await expect(completeCheckbox).not.toBeChecked();

        // Grab the achievement icon and verify its state of incomplete
        const beforeSrc = await achIcon.getAttribute('src');

        // Click on the checkbox and wait for the request to be fullfilled
        const achMarkoffResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await completeCheckbox.click({clickCount: 1});
        await achMarkoffResponse;

        // Check that the state has changed to mark the objective complete
        await expect(completeCheckbox).toBeChecked();
        const afterSrc = await achIcon.getAttribute('src');
        expect(beforeSrc).not.toEqual(afterSrc);
    });

    await test.step('Counter objective', async () => {
        const { region, completeCheckbox, expandButton } = getAchievementRegion(page, 'Careerist');

        await expect(completeCheckbox).not.toBeChecked();

        // Expand achievement
        await expandButton.click({ clickCount: 1 });
        const objectiveContainer = getObjectivesForAchievement(region);

        // Ensure display for counter renders
        const display = objectiveContainer.getByText('Perfect Skilled Deliveries');
        await expect(display).toBeVisible();

        // Expect 0 / 5 for a fresh start
        const startProgressText = objectiveContainer.getByText('0 / 5');
        await expect(startProgressText).toBeVisible();

        const incrementButton = objectiveContainer.getByRole('button', { name: 'Increment' });
        const decrementButton = objectiveContainer.getByRole('button', { name: 'Decrement' });

        // Increment to goal, checking that bar has updated
        for(let i = 1; i <= 5; i++) {
            const buttonClickResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
                && resp.request().method() === 'POST'
                && resp.status() === 200);
            await incrementButton.click({ clickCount: 1 });
            await buttonClickResponse;

            const barText = objectiveContainer.getByText(`${i} / 5`);
            await expect(barText).toBeVisible();
            if(i !== 5) {
                await expect(completeCheckbox).not.toBeChecked();
            }
        }
        await expect(completeCheckbox).toBeChecked();

        // Perform decrement and check that bar has updated
        const decrementButtonResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'                    
            && resp.status() === 200);
        await decrementButton.click({ clickCount: 1 });
        await decrementButtonResponse;

        const decrementedProgressText = objectiveContainer.getByText('4 / 5');
        await expect(decrementedProgressText).toBeVisible();
        await expect(completeCheckbox).not.toBeChecked();
    });

    await test.step('List objective', async () => {
        const { region, completeCheckbox, expandButton } = getAchievementRegion(page, 'Whatever Floats Your Boat');

        await expect(completeCheckbox).not.toBeChecked();

        // Expand achievement
        await expandButton.click({ clickCount: 1 });
        const objectiveContainer = getObjectivesForAchievement(region);

        const esbjergCheckbox = objectiveContainer.getByLabel('Esbjerg', { exact: false });
        const osloCheckbox = objectiveContainer.getByLabel('Oslo', { exact: false });

        // Check off Esbjerg
        const esbjergMarkoffResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await esbjergCheckbox.click({ clickCount: 1 });
        await esbjergMarkoffResponse;
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).not.toBeChecked();

        // Check off Oslo
        const osloMarkoffResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);    
        await osloCheckbox.click({ clickCount: 1 });
        await osloMarkoffResponse;
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).toBeChecked();
    
        // Now that Esbjerg and Oslo is checked off, is the achievement marked completed?
        await expect(completeCheckbox).toBeChecked();

        // Check that the achievement goes back to incomplete when we uncheck Oslo
        const osloUnmarkResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await osloCheckbox.click({ clickCount: 1 });
        await osloUnmarkResponse;
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).not.toBeChecked();
        await expect(completeCheckbox).not.toBeChecked();
    });

    await test.step('Sequential objective', async () => {
        const { region, completeCheckbox, expandButton } = getAchievementRegion(page, 'Going Camping');

        await expect(completeCheckbox).not.toBeChecked();

        // Expand achievement
        await expandButton.click({ clickCount: 1 });
        const objectiveContainer = getObjectivesForAchievement(region);
        const campervanCheckbox = objectiveContainer.getByLabel('Campervans', { exact: false });
        const electronicsCheckbox = objectiveContainer.getByLabel('Electronics', { exact: false });

        // Click on campervans to complete achievement right away
        await expect(electronicsCheckbox).not.toBeChecked();
        await expect(campervanCheckbox).not.toBeChecked();

        const campervanMarkoffResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await campervanCheckbox.click({ clickCount: 1 });
        await campervanMarkoffResponse;

        await expect(electronicsCheckbox).toBeChecked();
        await expect(campervanCheckbox).toBeChecked();
        await expect(completeCheckbox).toBeChecked();

        // Click on campervans, see that campervan + achievement is no longer marked off
        const campervanUnmarkResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await campervanCheckbox.click({ clickCount: 1 });
        await campervanUnmarkResponse;

        await expect(electronicsCheckbox).toBeChecked();
        await expect(campervanCheckbox).not.toBeChecked();
        await expect(completeCheckbox).not.toBeChecked();
    });

    await test.step('Partial objective', async () => {
        const { region, completeCheckbox, expandButton } = getAchievementRegion(page, 'All Inclusive');

        await expect(completeCheckbox).not.toBeChecked();

        // Expand achievement
        await expandButton.click({ clickCount: 1 });
        const objectiveContainer = getObjectivesForAchievement(region);

        const preProgressText = objectiveContainer.getByText('0 / 4');
        await expect(preProgressText).toBeVisible();

        // Check off each option, making sure the text and checkboxes update as expected
        const CITY_OPTIONS = ['Argostoli', 'Chania', 'Rhodes', 'Chios'];
        for(let i = 0; i < CITY_OPTIONS.length; i++) {
            const subobjCheckbox = objectiveContainer.getByLabel(CITY_OPTIONS[i], { exact: false });
            await expect(subobjCheckbox).not.toBeChecked();

            const markoffResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
                && resp.request().method() === 'POST'
                && resp.status() === 200);
            await subobjCheckbox.click({ clickCount: 1 });
            await markoffResponse;

            await expect(subobjCheckbox).toBeChecked();

            const currentProgress = i + 1;
            await expect(page.getByText(`${currentProgress} / 4`)).toBeVisible();
            if((i + 1) !== CITY_OPTIONS.length) {
                await expect(completeCheckbox).not.toBeChecked();
            }
        }
        await expect(completeCheckbox).toBeChecked();

        // Now we uncheck the first subobjective (Argostoli) to make sure achievement reverts to incomplete
        const firstSubobjCheckbox = objectiveContainer.getByLabel(CITY_OPTIONS[0], { exact: false });
        await expect(firstSubobjCheckbox).toBeChecked();
        
        const firstSubobjUnmarkResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await objectiveContainer.getByText(CITY_OPTIONS[0], { exact: false }).click({ clickCount: 1 });
        await firstSubobjUnmarkResponse;

        await expect(firstSubobjCheckbox).not.toBeChecked();
        await expect(page.getByText('3 / 4')).toBeVisible();
        await expect(completeCheckbox).not.toBeChecked();
    });

    await test.step("Persists across different contexts after logging in", async () => {
        // a* refers to our base context - we are signed in as the user
        // b* refers to a new context - we will sign in as the same user and 
        //    ensure the mutations carried over to the new context
        const achievementName = 'Pathfinder';
        const { completeCheckbox: aCompleteCheckbox } = getAchievementRegion(page, achievementName);
        
        // Mark the achievement complete and wait for it to be checked off
        const markOffAchievementResponse = page.waitForResponse(resp => resp.url().includes(`/${USER_UUID}/ets2`) 
            && resp.request().method() === 'POST'
            && resp.status() === 200);
        await aCompleteCheckbox.click({clickCount: 1});
        await markOffAchievementResponse;

        // Check that the state has changed to mark the objective off
        await expect(aCompleteCheckbox).toBeChecked();
        
        // Load up a new context
        const bContext = await pwBrowser.newContext();
        const bPage = await bContext.newPage();

        // Login and go to the remote page
        await performLogin(bPage, USER_DETAILS.email, USER_DETAILS.password, USER_DETAILS.displayName);
        await bPage.goto(`/${USER_UUID}/ets2`);
        await expect(bPage.locator('p#loading-indicator')).toBeHidden();

        // Make sure what we marked off is saved
        const { completeCheckbox: bCompleteCheckbox } = getAchievementRegion(bPage, achievementName);
        await expect(bCompleteCheckbox).toBeChecked();

        // Clean up
        await bPage.close();
        await bContext.close();
    });
});