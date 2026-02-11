import { test, expect, type Page } from '@playwright/test';
import { getEmailBody, getLatestEmail, getLinkFromEmailBody, purgeMailbox } from '../utils/email';
import cleanupSupabaseUser from '../utils/supabase-cleanup';

const USER_DETAILS = {
    email: "testsignup@gmail.com",
    password: "test12345",
    displayName: "TestSignup"
};

let page: Page;

test.beforeAll(async ({browser}) => {
    cleanupSupabaseUser(USER_DETAILS.email);
    
    const context = await browser.newContext();
    page = await context.newPage();
});

test.afterAll(async () => {
    await page.close();

    await purgeMailbox(USER_DETAILS.email);

    cleanupSupabaseUser(USER_DETAILS.email);
});

test('Sign up flow', async () => {
    await test.step('Sign up', async () => {
        await page.goto('/signup');

        // Fill out form
        await page.getByLabel("Email").fill(USER_DETAILS.email);
        await page.getByLabel("Display Name").fill(USER_DETAILS.displayName);
        await page.getByLabel(/(?<!Confirm.*)Password/).fill(USER_DETAILS.password);
        await page.getByLabel("Confirm Password").fill(USER_DETAILS.password);
        
        await page.getByRole('button', {name: 'Sign Up'}).click();

        const successDialog = page.locator('*[data-authdialog-success]');
        await expect(successDialog).toBeVisible();
    });

    await test.step('Confirm email', async () => {
        const emailID = await getLatestEmail(USER_DETAILS.email, 100);
        expect(emailID).not.toBeNull();

        const emailBody = await getEmailBody(emailID!);
        expect(emailBody).not.toBeNull();

        const verificationLink = getLinkFromEmailBody(emailBody!);
        expect(verificationLink).not.toBeNull();

        await page.goto(verificationLink!);
    });

    await test.step('See logged in', async () => {
        await page.waitForURL('**/');

        const displayNameElement = page.getByText(USER_DETAILS.displayName);
        await expect(displayNameElement).toBeVisible();
    });
});