import { Page, test, expect } from '@playwright/test';
import { adminAuthClient } from '../supabase';

const USER_DETAILS = {
    email: "test-login@gmail.com",
    password: "test123456790",
    displayName: "Test12345"
};

let USER_UUID: string = '';
let page: Page;

test.beforeAll(async ({browser}) => {
    const { data, error } = await adminAuthClient.createUser({
        email: USER_DETAILS.email,
        password: USER_DETAILS.password,
        email_confirm: true,
        user_metadata: { displayName: USER_DETAILS.displayName }
    });
    if(error) throw error;
    USER_UUID = data.user?.id as string;

    const context = await browser.newContext();
    page = await context.newPage();
});

test.afterAll(async () => {
    await page.close();
    
    const { error } = await adminAuthClient.deleteUser(USER_UUID);
    if(error) throw error;
});

test('Login and Signout flow', async () => {
    await test.step('Login', async () => {
        await page.goto('/login');

        await page.getByLabel("Email").fill(USER_DETAILS.email);
        await page.getByLabel("Password").fill(USER_DETAILS.password);

        await page.getByRole('button', {name: 'Login'}).click();

        await page.waitForURL('**/');
        
        const displayNameElement = page.locator('span[class*="displayName"]');
        await expect(displayNameElement).toHaveText(USER_DETAILS.displayName);
    });

    await test.step('Signout', async () => {
        await page.getByText("Sign Out").click();

        await page.waitForURL('**/');

        const loginButton = page.locator('a[href="/login"]');
        await expect(loginButton).toBeVisible();
    });
});