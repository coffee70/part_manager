import { test, expect } from '@playwright/test';
import { ATTACHMENT_DIR } from '../playwright.config';
import path from 'path';
import { routerFormColor, routersAdminPageNavigation, routersPrimaryNavigation } from './lib';

test('router attachments', async ({ page }) => {
    await page.goto('/')
    
    // create router
    await routersPrimaryNavigation(page).click();
    await routersAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Router' }).click();
    await page.getByRole('textbox').fill('Attachments Test');
    await page.getByLabel('Create Router').getByText('Attachments', { exact: true }).click();
    await routerFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // go to instances
    await page.getByRole('link', { name: 'Attachments Test' }).click();

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
}); 