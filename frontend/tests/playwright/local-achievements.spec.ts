import { Page, test, expect, BrowserContext, Browser } from '@playwright/test';
import { getAchievementRegion, getObjectivesForAchievement } from './utils/page-operations';

let pwBrowser: Browser;
let browserContext: BrowserContext;
let page: Page;

test.beforeAll(async ({browser}) => {
    pwBrowser = browser;
    browserContext = await browser.newContext();
    page = await browserContext.newPage();
});

test.afterAll(async () => {
    await page.close();
});

test('Local achievement interactivity', async () => {
    await test.step('Navigate to user page and wait for it to load', async () => {
        await page.goto(`/ets2`);

        // TODO: Test that we are not logged in
        await expect(page.locator('nav').getByText('Login')).toBeVisible();
    });

    await test.step('Marking off an achievement', async () => {
        const { region, completeCheckbox, achIcon } = getAchievementRegion(page, 'I Am a GPS');

        // Make sure achievement is visible and not marked off
        await expect(region).toBeVisible();
        await expect(completeCheckbox).not.toBeChecked();

        // Grab the achievement icon and verify its state of incomplete
        const beforeSrc = await achIcon.getAttribute('src');

        // Click on the checkbox
        await completeCheckbox.click({clickCount: 1});

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
            await incrementButton.click({ clickCount: 1 });

            const barText = objectiveContainer.getByText(`${i} / 5`);
            await expect(barText).toBeVisible();
            if(i !== 5) {
                await expect(completeCheckbox).not.toBeChecked();
            }
        }
        await expect(completeCheckbox).toBeChecked();

        // Perform decrement and check that bar has updated
        await decrementButton.click({ clickCount: 1 });
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
        await esbjergCheckbox.click({ clickCount: 1 });
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).not.toBeChecked();

        // Check off Oslo
        await osloCheckbox.click({ clickCount: 1 });
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).toBeChecked();
    
        // Now that Esbjerg and Oslo is checked off, is the achievement marked completed?
        await expect(completeCheckbox).toBeChecked();

        // Check that the achievement goes back to incomplete when we uncheck Oslo
        await osloCheckbox.click({ clickCount: 1 });
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
        await campervanCheckbox.click({ clickCount: 1 });

        await expect(electronicsCheckbox).toBeChecked();
        await expect(campervanCheckbox).toBeChecked();
        await expect(completeCheckbox).toBeChecked();

        // Click on campervans, see that campervan + achievement is no longer marked off
        await campervanCheckbox.click({ clickCount: 1 });

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
            
            await subobjCheckbox.click({ clickCount: 1 });
            await expect(subobjCheckbox).toBeChecked();

            const currentProgress = i + 1;
            await expect(objectiveContainer.getByText(`${currentProgress} / 4`)).toBeVisible();
            if((i + 1) !== CITY_OPTIONS.length) {
                await expect(completeCheckbox).not.toBeChecked();
            }
        }
        await expect(completeCheckbox).toBeChecked();

        // Now we uncheck the first subobjective (Argostoli) to make sure achievement reverts to incomplete
        const firstSubobjCheckbox = objectiveContainer.getByLabel(CITY_OPTIONS[0], { exact: false });
        await expect(firstSubobjCheckbox).toBeChecked();

        await objectiveContainer.getByText(CITY_OPTIONS[0], { exact: false }).click({ clickCount: 1 });
        await expect(firstSubobjCheckbox).not.toBeChecked();

        await expect(page.getByText('3 / 4')).toBeVisible();
        await expect(completeCheckbox).not.toBeChecked();
    });

    await test.step("Persists within the same context, but not within different contexts", async () => {
        // Set up a new context - assuming we should get a new slate
        // This is what we will call our "base" context (prefixed a*), we perform the mutation here
        // and check if it carried over to a new page within the same context (prefixed b*)
        // and that it wasn't carried over to a page in a new context (prefixed c*)
        const aContext = await pwBrowser.newContext();
        const aPage = await aContext.newPage();
        await aPage.goto(`/ets2`);

        const achievementName = 'Pathfinder';
        const { completeCheckbox: aCompleteCheckbox } = getAchievementRegion(aPage, achievementName);

        // Mark the achievement complete and wait for it to be checked off
        await aCompleteCheckbox.click({clickCount: 1});

        // Check that the state has changed to mark the objective off
        await expect(aCompleteCheckbox).toBeChecked();
        
        // Load up a new page within the context and go to the local page
        const bPage = await aContext.newPage();
        await bPage.goto(`/ets2`);

        // Make sure what we marked off is saved
        const { completeCheckbox: bCompleteCheckbox } = getAchievementRegion(bPage, achievementName);
        await expect(bCompleteCheckbox).toBeChecked();

        // Clean up
        await bPage.close();

        // Load up a new page within a new context and go to the local page
        const cContext = await pwBrowser.newContext();
        const cPage = await cContext.newPage();
        await cPage.goto(`/ets2`);

        // Ensure that what we marked off isn't saved in this new context
        const { completeCheckbox: cCompleteCheckbox } = getAchievementRegion(cPage, achievementName);
        await expect(cCompleteCheckbox).not.toBeChecked();
        
        // Cleanup
        await cPage.close();
        await cContext.close();
        await aPage.close();
        await aContext.close();
    });
});