import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';

setup('create admin user', async ({ page }) => {
    await page.goto('/');
    // click create account button without filling in any fields
    await page.getByRole('button', { name: 'Create Account' }).click();

    // check for error messages
    await expect(page.locator('form')).toContainText('Name is required.');
    await expect(page.locator('form')).toContainText('Username must be greater than 3 characters.');
    await expect(page.locator('form')).toContainText('Username can only consist of lowercase letters, 0-9, -, and _.');
    await expect(page.locator('form')).toContainText('Password must be greater than 6 characters.');
    await expect(page.locator('form')).toContainText('ErrorSome fields need your attention!');

    // reload to clear errors
    await page.goto('/');

    // fill in name
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').fill('Test Admin');

    // check username requirements
    await page.locator('div').filter({ hasText: /^Username$/ }).nth(1).hover();
    await expect(page.getByRole('tooltip')).toContainText('Usernames must be between 3 and 31 characters.');
    await expect(page.getByRole('tooltip')).toContainText('Usernames must only contain lowercase letters, numbers, hyphens, and underscores.');
    
    // fill in username
    await page.getByRole('textbox').nth(1).click();
    await page.getByRole('textbox').nth(1).fill('test');

    // fill in title
    await page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox').fill('Tester');

    // check password requirements
    await page.locator('div').filter({ hasText: /^Password$/ }).nth(1).hover();
    await expect(page.getByRole('tooltip')).toContainText('Passwords must be between 6 and 255 characters.');

    // fill in password
    await page.locator('input[type="password"]').click();
    await page.locator('input[type="password"]').fill('Newpassword10!');

    // click create account
    await page.getByRole('button', { name: 'Create Account' }).click();

    // check for welcome message
    await expect(page.getByRole('heading')).toContainText('Models');

    // Save storage state
    await page.context().storageState({ path: STORAGE_STATE });
})
