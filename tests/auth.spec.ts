import { test, expect } from "@playwright/test";

test.describe('auth', () => {
    test('login', async ({ page }) => {
        await page.goto('http://localhost:3000/login');
        await page.getByLabel('Username').click();
        await page.getByLabel('Username').fill('test');
        await page.getByLabel('Password').click();
        await page.getByLabel('Password').fill('Newpassword10!');
        await page.getByRole('button', { name: 'Continue' }).click();
        await expect(page.getByRole('heading')).toContainText('Welcome test');
    })

    test('logout', async ({ page }) => {
        await page.goto('http://localhost:3000/');
        await page.getByLabel('Username').click();
        await page.getByLabel('Username').fill('test');
        await page.getByLabel('Password').click();
        await page.getByLabel('Password').fill('Newpassword10!');
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.locator('button[name="more"]').click();
        await page.getByRole('button', { name: 'Logout' }).click();
        await expect(page.getByRole('heading')).toContainText('Log in');
    })
})