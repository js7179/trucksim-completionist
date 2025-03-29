import { Page, test, expect, BrowserContext, Browser } from '@playwright/test';

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
        const achievementID = "map_discover_60";
        const achievement = page.locator(`section[data-ach-id="${achievementID}"]`);
        const achCompletedCheckbox = achievement.locator(`div[data-ach-checkbox] > input`);

        // Make sure achievement is visible and not marked off
        await expect(achievement).toBeVisible();
        await expect(achCompletedCheckbox).not.toBeChecked();

        // Grab the achievement icon and verify its state of incomplete
        const achievementIcon = achievement.locator(`img[data-achicon]`);
        const beforeSrc = await achievementIcon.getAttribute('src');

        // Click on the checkbox
        await achievement.locator(`div[data-ach-checkbox] > label`).click({clickCount: 1});

        // Check that the state has changed to mark the objective complete
        await expect(achCompletedCheckbox).toBeChecked();
        const afterSrc = await achievementIcon.getAttribute('src');
        expect(beforeSrc).not.toEqual(afterSrc);
    });

    await test.step('Counter objective', async () => {
        const achievementID = "5_jobs_in_a_row";
        const achievement = page.locator(`section[data-ach-id="${achievementID}"]`);
        const achCompletedCheckbox = achievement.locator(`div[data-ach-checkbox] > input`);

        await expect(achCompletedCheckbox).not.toBeChecked();

        // Expand achievement
        await achievement.locator('div[data-achexpandinfo] > label').click({ clickCount: 1 });
        const objectiveContainer = achievement.locator(`div[data-obj-container]`);

        // Ensure display for counter renders
        const display = objectiveContainer.getByText('Perfect Skilled Deliveries');
        await expect(display).toBeVisible();

        // Expect 0 / 5 for a fresh start
        const startProgressText = objectiveContainer.getByText('0 / 5');
        await expect(startProgressText).toBeVisible();

        const incrementButton = objectiveContainer.getByText('+');
        const decrementButton = objectiveContainer.getByText('-');

        // Increment to goal, checking that bar has updated
        for(let i = 1; i <= 5; i++) {
            await incrementButton.click({ clickCount: 1 });

            const barText = objectiveContainer.getByText(`${i} / 5`);
            await expect(barText).toBeVisible();
            if(i !== 5) {
                await expect(achCompletedCheckbox).not.toBeChecked();
            }
        }
        await expect(achCompletedCheckbox).toBeChecked();

        // Perform decrement and check that bar has updated
        await decrementButton.click({ clickCount: 1 });
        const decrementedProgressText = objectiveContainer.getByText('4 / 5');
        await expect(decrementedProgressText).toBeVisible();
        await expect(achCompletedCheckbox).not.toBeChecked();
    });

    await test.step('List objective', async () => {
        const achievementID = 'sc_container_ports';
        const achievement = page.locator(`section[data-ach-id="${achievementID}"]`);
        const achCompleteElement = achievement.locator(`div[data-ach-checkbox] > input`);

        await expect(achCompleteElement).not.toBeChecked();

        // Expand achievement
        await achievement.locator('div[data-achexpandinfo] > label').click({ clickCount: 1 });
        const objectiveContainer = achievement.locator(`div[data-obj-container]`);
        const esbjergCheckbox = objectiveContainer.getByLabel('Esbjerg', { exact: false });
        const osloCheckbox = objectiveContainer.getByLabel('Oslo', { exact: false });

        // Check off Esbjerg
        await objectiveContainer.getByText('Esbjerg', { exact: false }).click({ clickCount: 1 });
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).not.toBeChecked();

        // Check off Oslo
        await objectiveContainer.getByText('Oslo', { exact: false }).click({ clickCount: 1 });
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).toBeChecked();
    
        // Now that Esbjerg and Oslo is checked off, is the achievement marked completed?
        await expect(achCompleteElement).toBeChecked();

        // Check that the achievement goes back to incomplete when we uncheck Oslo
        await objectiveContainer.getByText('Oslo', { exact: false }).click({ clickCount: 1 });
        await expect(esbjergCheckbox).toBeChecked();
        await expect(osloCheckbox).not.toBeChecked();
        await expect(achCompleteElement).not.toBeChecked();
    });

    await test.step('Sequential objective', async () => {
        const achievementID = 'bw_ore_caravans';
        const achievement = page.locator(`section[data-ach-id="${achievementID}"]`);
        const achCompleteElement = achievement.locator(`div[data-ach-checkbox] > input`);
        await expect(achCompleteElement).not.toBeChecked();

        // Expand achievement
        await achievement.locator('div[data-achexpandinfo] > label').click({ clickCount: 1 });
        const objectiveContainer = achievement.locator(`div[data-obj-container]`);
        const campervanCheckbox = objectiveContainer.getByLabel('Campervans', { exact: false });
        const electronicsCheckbox = objectiveContainer.getByLabel('Electronics', { exact: false });

        // Click on campervans to complete achievement right away
        await expect(electronicsCheckbox).not.toBeChecked();
        await expect(campervanCheckbox).not.toBeChecked();
        await objectiveContainer.getByText('Campervans', { exact: false }).click({ clickCount: 1 });

        await expect(electronicsCheckbox).toBeChecked();
        await expect(campervanCheckbox).toBeChecked();
        await expect(achCompleteElement).toBeChecked();

        // Click on campervans, see that campervan + achievement is no longer marked off
        await objectiveContainer.getByText('Campervans', { exact: false }).click({ clickCount: 1 });

        await expect(electronicsCheckbox).toBeChecked();
        await expect(campervanCheckbox).not.toBeChecked();
        await expect(achCompleteElement).not.toBeChecked();
    });

    await test.step('Partial objective', async () => {
        const achievementID = 'gr_hotels';
        const achievement = page.locator(`section[data-ach-id="${achievementID}"]`);
        const achCompleteElement = achievement.locator(`div[data-ach-checkbox] > input`);
        await expect(achCompleteElement).not.toBeChecked();

        // Expand achievement
        await achievement.locator('div[data-achexpandinfo] > label').click({ clickCount: 1 });
        const objectiveContainer = achievement.locator(`div[data-obj-container]`);

        // Check off each option, making sure the text and checkboxes update as expected
        const CITY_OPTIONS = ['Argostoli', 'Chania', 'Rhodes', 'Chios'];
        for(let i = 0; i < CITY_OPTIONS.length; i++) {
            const subobjCheckbox = objectiveContainer.getByLabel(CITY_OPTIONS[i], { exact: false });
            await expect(subobjCheckbox).not.toBeChecked();
            await objectiveContainer.getByText(CITY_OPTIONS[i], { exact: false }).click({ clickCount: 1 });
            await expect(subobjCheckbox).toBeChecked();

            const currentProgress = i + 1;
            await expect(page.getByText(`${currentProgress}/4`)).toBeVisible();
            if((i + 1) !== CITY_OPTIONS.length) {
                await expect(achCompleteElement).not.toBeChecked();
            }
        }
        await expect(achCompleteElement).toBeChecked();

        // Now we uncheck the first subobjective (Argostoli) to make sure achievement reverts to incomplete
        const firstSubobjCheckbox = objectiveContainer.getByLabel(CITY_OPTIONS[0], { exact: false });
        await expect(firstSubobjCheckbox).toBeChecked();

        await objectiveContainer.getByText(CITY_OPTIONS[0], { exact: false }).click({ clickCount: 1 });
        await expect(firstSubobjCheckbox).not.toBeChecked();

        await expect(page.getByText('3/4')).toBeVisible();
        await expect(achCompleteElement).not.toBeChecked();
    });

    await test.step("Persists within the same context, but not within different contexts", async () => {
        const achievementID = 'map_discover_100';
        const oldAchLocator = page.locator(`section[data-ach-id="${achievementID}"]`);
        const oldAchCompletedCheckbox = oldAchLocator.locator(`div[data-ach-checkbox] > input`);

        // Mark the achievement complete and wait for it to be checked off
        await oldAchLocator.locator(`div[data-ach-checkbox] > label`).click({clickCount: 1});

        // Check that the state has changed to mark the objective off
        await expect(oldAchCompletedCheckbox).toBeChecked();
        
        // Load up a new page within the context and go to the local page
        const sameContextPage = await browserContext.newPage();
        await sameContextPage.goto(`/ets2`);

        // Make sure what we marked off is saved
        const newAchLocatorSame = sameContextPage.locator(`section[data-ach-id="${achievementID}"]`);
        const newAchCompletedCheckboxSame = newAchLocatorSame.locator(`div[data-ach-checkbox] > input`);
        await expect(newAchCompletedCheckboxSame).toBeChecked();

        // Clean up
        await sameContextPage.close();

        // Load up a new page within a new context and go to the local page
        const newContext = await pwBrowser.newContext();
        const diffContextPage = await newContext.newPage();
        await diffContextPage.goto(`/ets2`);

        // Ensure that what we marked off isn't saved in this new context
        const newAchLocatorDifferent = diffContextPage.locator(`section[data-ach-id="${achievementID}"]`);
        const newAchCompletedCheckboxDifferent = newAchLocatorDifferent.locator(`div[data-ach-checkbox] > input`);
        await expect(newAchCompletedCheckboxDifferent).not.toBeChecked();
        
        // Cleanup
        await diffContextPage.close();
        await newContext.close();
    });
});