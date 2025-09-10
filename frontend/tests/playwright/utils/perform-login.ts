import { Page, expect } from "@playwright/test";

export async function performLogin(page: Page, email: string, password: string, displayName: string) {
    await page.goto('/login');
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole('button', {name: 'Login'}).click();
    await page.waitForURL('**/');

    const displayNameElement = page.getByText(displayName);
    await expect(displayNameElement).toBeVisible();
}