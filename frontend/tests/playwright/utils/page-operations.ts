import { Locator, Page } from "@playwright/test";

export function getAchievementRegion(page: Page, achievementName: string) {
    const region = page.getByRole('region', { name: achievementName });
    return {
        region: region,
        completeCheckbox: region.getByRole('checkbox', { name: `${achievementName} achievement` }),
        expandButton: region.getByRole('button', { name: `Expand ${achievementName}` }),
        achIcon: region.locator('img[role="presentation"]'),
    };
}

export const getObjectivesForAchievement = (achievementRegion: Locator) => achievementRegion.locator('div[data-obj-container]');