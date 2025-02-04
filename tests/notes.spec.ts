import { test, expect } from '@playwright/test';

test('test notes', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Something' }).click();

    // create instance with notes
    await page.locator('.relative > .inline-flex').first().click();
    await page.getByLabel('Number', { exact: true }).fill('Notes Test');
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').fill('Some notes');
    await page.getByRole('button', { name: 'Save' }).click();

    // check notes in summary
    await expect(page.locator('#summary-notes')).toHaveValue('Some notes');

    // edit notes in dialog
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').fill('Some notes dialog edited');
    await page.getByRole('button', { name: 'Save' }).click();

    // check updated notes in summary
    await expect(page.locator('#summary-notes')).toHaveValue('Some notes dialog edited');

    // update notes in summary
    await page.locator('#summary-notes').click();
    await page.locator('#summary-notes').fill('Some notes summary edited');
    await page.locator('form').filter({ hasText: 'Some notes summary edited' }).getByRole('button').click();

    // check notes in summary
    await expect(page.locator('#summary-notes')).toHaveValue('Some notes summary edited');
    
    // reload page and check if notes in summary
    await page.goto('/')
    await page.getByRole('link', { name: 'Something' }).click();
    await page.getByRole('cell', { name: 'Notes Test' }).click();
    await expect(page.locator('#summary-notes')).toHaveValue('Some notes summary edited');
});