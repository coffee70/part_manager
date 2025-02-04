import { test, expect } from '@playwright/test';
import { ATTACHMENT_DIR } from '../playwright.config';
import path from 'path';

test('test attachments', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Something' }).click();

    // create instance
    await page.locator('.relative > .inline-flex').first().click();
    await page.getByLabel('Number', { exact: true }).fill('Attachments Test');
    await page.getByRole('button', { name: 'Save' }).click();

    // upload single page attachment
    await page.getByLabel('action_Attachments').click();
    await page.locator('#upload-attachment-input').setInputFiles(path.join(ATTACHMENT_DIR, 'A19464.pdf'));

    // check the attachment viewer
    await page.getByLabel('attachment_preview_A19464.pdf').getByRole('link').click();
    await expect(page.getByRole('heading')).toContainText('A19464.pdf');
    await expect(page.getByRole('link')).toBeVisible();

    // since it is one page, the buttons are disabled
    await page.getByRole('button').first().hover();
    await expect(page.getByRole('button').first()).toBeDisabled();
    await expect(page.getByRole('button').nth(1)).toBeDisabled();

    // download the attachment
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button').nth(2).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('A19464.pdf');

    // close the attachment viewer
    await page.getByRole('button', { name: 'Close' }).click();

    // check the attachment preview
    await page.getByLabel('attachment_preview_A19464.pdf').getByRole('link').hover();
    await expect(page.getByRole('main')).toContainText('A19464.pdf');

    // upload multiple page attachment
    await page.getByLabel('action_Attachments').click();
    await page.locator('#upload-attachment-input').setInputFiles(path.join(ATTACHMENT_DIR, 'A19468.pdf'));

    // check the attachment viewer
    await page.getByLabel('attachment_preview_A19468.pdf').getByRole('link').click();
    await expect(page.getByRole('heading')).toContainText('A19468.pdf');

    // navigate through the pages
    await expect(page.getByLabel('attachment_viewer_A19468.pdf').locator('span')).toContainText('1 / 3');
    await expect(page.getByRole('button').first()).toBeDisabled();
    await page.getByRole('button').nth(1).click();
    await expect(page.getByLabel('attachment_viewer_A19468.pdf').locator('span')).toContainText('2 / 3');
    await page.getByRole('button').nth(1).click();
    await expect(page.getByLabel('attachment_viewer_A19468.pdf').locator('span')).toContainText('3 / 3');
    await expect(page.getByRole('button').nth(1)).toBeDisabled();
    await page.getByRole('button').first().click();
    await expect(page.getByLabel('attachment_viewer_A19468.pdf').locator('span')).toContainText('2 / 3');
    await page.getByRole('button').first().click();
    await expect(page.getByLabel('attachment_viewer_A19468.pdf').locator('span')).toContainText('1 / 3');
    await expect(page.getByRole('button').first()).toBeDisabled();

    // download the attachment
    const download2Promise = page.waitForEvent('download');
    await page.getByRole('button').nth(2).click();
    const download2 = await download2Promise;
    expect(download2.suggestedFilename()).toBe('A19468.pdf');

    // close the attachment viewer
    await page.getByRole('button', { name: 'Close' }).click();

    // check the attachment preview
    await page.getByLabel('attachment_preview_A19468.pdf').getByRole('link').hover();
    await expect(page.getByRole('main')).toContainText('A19468.pdf');

    // delete both attachments
    await page.getByLabel('attachment_preview_A19464.pdf').getByRole('link').hover();
    await page.getByLabel('delete_attachment_A19464.pdf').click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByLabel('attachment_preview_A19468.pdf').getByRole('link').hover();
    await page.getByLabel('delete_attachment_A19468.pdf').click();
    await page.getByRole('button', { name: 'Delete' }).click();

    // check they were deleted
    await expect(page.getByLabel('attachment_preview_A19464.pdf').getByRole('link')).not.toBeVisible();
    await expect(page.getByLabel('attachment_preview_A19468.pdf').getByRole('link')).not.toBeVisible();
});