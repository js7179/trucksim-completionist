import { Page, test, expect } from '@playwright/test';
import { adminAuthClient } from '../supabase';
import { getEmailBody, getLatestEmail, getLinkFromEmailBody, purgeMailbox } from '../utils/email';

const USER_DETAILS = {
    email: "testsignup@gmail.com",
    password: "test12345",
    displayName: "TestSignup"
};

let page: Page;

test.beforeAll(async ({browser}) => {
    const context = await browser.newContext();
    page = await context.newPage();
});

test.afterAll(async () => {
    await page.close();

    await purgeMailbox(USER_DETAILS.email);

    const { data: { users }, error:listError } = await adminAuthClient.listUsers();
    if(listError) throw listError;
    const userToDelete = users.find((user) => user.email === USER_DETAILS.email);
    if(!userToDelete) throw new Error(`Could not find email associated with ${USER_DETAILS.email} to delete account`);

    const { error:deleteError } = await adminAuthClient.deleteUser(userToDelete.id);
    if(deleteError) throw deleteError;
});

test('Sign up flow', async () => {
    await test.step('Sign up', async () => {
        await page.goto('/signup');

        // Fill out form
        await page.getByLabel("Email").fill(USER_DETAILS.email);
        await page.getByLabel("Display Name").fill(USER_DETAILS.displayName);
        await page.getByLabel("Password", {exact: true}).fill(USER_DETAILS.password);
        await page.getByLabel("Confirm Password", {exact: true}).fill(USER_DETAILS.password);
        
        await page.getByRole('button', {name: 'Sign Up'}).click();

        const successDialog = page.locator('div[class*=formSuccess]');
        await expect(successDialog).toBeVisible();
    });

    await test.step('Confirm email', async () => {
        const emailID = await getLatestEmail(USER_DETAILS.email, 100);
        expect(emailID).not.toBeNull();

        const emailBody = await getEmailBody(USER_DETAILS.email, emailID!);
        expect(emailBody).not.toBeNull();

        const verificationLink = getLinkFromEmailBody(emailBody!);
        expect(verificationLink).not.toBeNull();

        await page.goto(verificationLink!);
    });

    await test.step('See logged in', async () => {
        await page.waitForURL('**/');

        const displayNameElement = page.locator('span[class*="displayName"]');
        await expect(displayNameElement).toHaveText(USER_DETAILS.displayName);
    });
});