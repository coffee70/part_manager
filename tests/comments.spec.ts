import { test, expect } from '@playwright/test';

test("comments", async ({ page }) => {
    await page.goto('/')

    // create model
    await page.getByRole('link', { name: 'Models', exact: true }).click();
    await page.getByRole('button', { name: 'New Model' }).click();
    await page.getByRole('textbox').fill('Comments Test');
    await page.getByLabel('Create Model').getByText('Comments').click();
    await page.locator('div:nth-child(16)').click();
    await page.getByRole('button', { name: 'Save' }).click();

    await page.getByRole('link', { name: 'Comments Test' }).click();

    // create instance
    await page.locator('.relative > .inline-flex').first().click();
    await page.getByLabel('Number', { exact: true }).fill('Comments Test');
    await page.getByRole('button', { name: 'Save' }).click();

    // add a comment
    await page.getByPlaceholder('Add a comment...').click();
    await page.getByPlaceholder('Add a comment...').fill('Adding a comment as test.');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByLabel('Comments')).toContainText('Test Admin commented today');
    await expect(page.getByLabel('Comments')).toContainText('Adding a comment as test.');

    // update a comment
    await page.getByLabel('Comments').getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Edit Comment').getByText('Adding a comment as test.').click();
    await page.getByLabel('Edit Comment').getByText('Adding a comment as test.').fill('Adding a comment as test. Updating a comment as test.');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByLabel('Comments')).toContainText('Adding a comment as test. Updating a comment as test.');

    // delete a comment
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByLabel('Comments')).toContainText('No comments yet');
});