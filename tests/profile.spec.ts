import { test, expect } from '@playwright/test'

test('edit profile name and title', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[name="more"]').first().click();
    await page.getByRole('menuitem', { name: 'Edit Profile' }).click();

    // dialog is open
    await expect(page.getByRole('heading')).toContainText('Edit Profile');
    await expect(page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox')).toHaveValue('Test Admin');
    await expect(page.getByRole('textbox').nth(1)).toHaveValue('test');
    await expect(page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox')).toHaveValue('Tester');
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').fill('Test Admin Edited');
    await page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox').fill('Tester Edited');
    await page.getByRole('button', { name: 'Save' }).click();

    // dialog is closed
    // confirm the the updated values are on the pop up
    await page.locator('button[name="more"]').first().click();
    await expect(page.getByLabel('', { exact: true })).toContainText('Test Admin Edited');
    await expect(page.getByLabel('', { exact: true })).toContainText('Tester Edited');
    await page.getByRole('menuitem', { name: 'Edit Profile' }).click();

    // dialog is open
    // confirm is prefilled with new values
    await expect(page.getByRole('heading')).toContainText('Edit Profile');
    await expect(page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox')).toHaveValue('Test Admin Edited');
    await expect(page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox')).toHaveValue('Tester Edited');

    // change the values back to the original values
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByRole('textbox').fill('Test Admin');
    await page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox').click();
    await page.locator('div').filter({ hasText: /^Title$/ }).getByRole('textbox').fill('Tester');
    await page.getByRole('button', { name: 'Save' }).click();
})