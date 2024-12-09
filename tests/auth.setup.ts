import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';

setup('create admin user', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Name', { exact: true }).click();
    await page.getByLabel('Name', { exact: true }).fill('Test Admin');
    await page.getByLabel('Username').click();
    await page.getByLabel('Username').fill('test');
    await page.getByLabel('Title').click();
    await page.getByLabel('Title').fill('Tester');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('Newpassword10!');
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page.getByRole('heading')).toContainText('Welcome test');

    // Save storage state
    await page.context().storageState({ path: STORAGE_STATE });
})
