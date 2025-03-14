import { test, expect } from '@playwright/test';
import { routerFormColor, routersAdminPageNavigation, routersPrimaryNavigation } from './lib';

test('test router notes', async ({ page }) => {
    await page.goto('/')
    
    // create router
    await routersPrimaryNavigation(page).click();
    await routersAdminPageNavigation(page).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible();
    await page.getByRole('button', { name: 'New Router' }).click();
    await page.getByRole('textbox').fill('Notes Router');
    await routerFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // go to instances
    await page.getByRole('link', { name: 'Notes Router' }).click();

    // create instance with notes
    await page.locator('.relative > .inline-flex').first().click();
    await page.getByLabel('Number', { exact: true }).fill('Notes Test');
    await page.getByLabel('Notes', { exact: true }).click();
    await page.getByLabel('Notes', { exact: true }).fill('Some router notes');
    await page.getByRole('button', { name: 'Save' }).click();

    // check notes in summary
    await expect(page.locator('#summary-notes')).toHaveValue('Some router notes');

    // edit notes in dialog
    await page.getByRole('button', { name: 'Edit' }).click();
    await page.getByLabel('Notes', { exact: true }).click();
    await page.getByLabel('Notes', { exact: true }).fill('Some router notes dialog edited');
    await page.getByRole('button', { name: 'Save' }).click();

    // check updated notes in summary
    await expect(page.locator('#summary-notes')).toHaveValue('Some router notes dialog edited');

    // update notes in summary
    await page.locator('#summary-notes').click();
    await page.locator('#summary-notes').fill('Some router notes summary edited');
    await page.locator('form').filter({ hasText: 'Some router notes summary edited' }).getByRole('button').click();

    // check notes in summary
    await expect(page.locator('#summary-notes')).toHaveValue('Some router notes summary edited');
    
    // reload page and check if notes in summary
    await page.goto('/')
    await routersPrimaryNavigation(page).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible();
    await page.getByRole('link', { name: 'Notes Router' }).click();
    await page.getByRole('cell', { name: 'Notes Test' }).click();
    await expect(page.locator('#summary-notes')).toHaveValue('Some router notes summary edited');
}); 