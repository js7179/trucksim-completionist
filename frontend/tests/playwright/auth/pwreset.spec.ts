import { Page, test, expect } from '@playwright/test';
import { adminAuthClient } from '../supabase';
import { getEmailBody, getLatestEmail, getLinkFromEmailBody, purgeMailbox } from '../utils/email';
import cleanupSupabaseUser from '../utils/supabase-cleanup';

const USER_DETAILS = {
    email: "testpwreset@gmail.com",
    oldpassword: "test123456790",
    newpassword: "test1234567890",
    displayName: "Test12345"
};

let page: Page;

test.beforeAll(async ({browser}) => {
    cleanupSupabaseUser(USER_DETAILS.email);
    
    const { error } = await adminAuthClient.createUser({
        email: USER_DETAILS.email,
        password: USER_DETAILS.oldpassword,
        email_confirm: true,
        user_metadata: { displayName: USER_DETAILS.displayName }
    });
    if(error) throw error;

    const context = await browser.newContext();
    page = await context.newPage();
});

test.afterAll(async () => {
    await page.close();

    await purgeMailbox(USER_DETAILS.email);

    cleanupSupabaseUser(USER_DETAILS.email);
});

test('Password reset flow', async () => {
    await test.step('Send password reset email', async () => {
        await page.goto('/sendpwreset');

        await page.getByLabel("Email").fill(USER_DETAILS.email);

        await page.getByRole('button', {name: 'Send Password Reset Email'}).click();

        const successDialog = page.locator('*[data-authdialog-success]');
        await expect(successDialog).toBeVisible();
    });

    await test.step('Receive password reset email', async () => {
        const emailID = await getLatestEmail(USER_DETAILS.email, 100);
        expect(emailID).not.toBeNull();

        const emailBody = await getEmailBody(emailID!);
        expect(emailBody).not.toBeNull();

        const pwResetLink = getLinkFromEmailBody(emailBody!);
        expect(pwResetLink).not.toBeNull();

        await page.goto(pwResetLink!);
    });

    await test.step('Perform password reset', async () => {
        await page.waitForURL('/resetpw**');

        const header = page.locator('h1');
        await expect(header).toHaveText(`Reset Password for ${USER_DETAILS.email}`);

        await page.getByLabel(/(?<!Confirm.*)New.*Password/).fill(USER_DETAILS.newpassword);
        await page.getByLabel("Confirm New Password").fill(USER_DETAILS.newpassword);

        await page.getByRole('button', {name: 'Change Password'}).click();

        const successDialog = page.locator('*[data-authdialog-success]');
        await expect(successDialog).toBeVisible();

        await page.waitForURL('/', { timeout: 7500 });

        const displayNameElement = page.locator('span[class*="displayName"]');
        await expect(displayNameElement).toHaveText(USER_DETAILS.displayName);
    });
});