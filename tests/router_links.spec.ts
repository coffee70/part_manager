import { test, expect } from '@playwright/test';
import { routerFormColor, routersAdminPageNavigation, routersPrimaryNavigation } from './lib';

test('router links', async ({ page }) => {
    await page.goto('/')

    // create router
    await routersPrimaryNavigation(page).click();
    await routersAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Router' }).click();
    await page.getByRole('textbox').fill('Links Router');
    await page.getByLabel('Create Router').getByText('Links').click();
    await routerFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create target link router
    await page.getByRole('button', { name: 'New Router' }).click();
    await page.getByRole('textbox').fill('Target Link');
    await page.getByLabel('Create Router').getByText('Links').click();
    await page.getByRole('img').nth(1).click();
    await routerFormColor(page, 24).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create linkable instance
    await page.getByRole('link', { name: 'Target Link' }).click();
    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-100');
    await page.getByRole('button', { name: 'Save' }).click();

    // create instance
    await page.getByRole('link', { name: 'Links Router' }).click();
    await page.locator('[id="create-instance-Links\\ Router"]').click();
    await page.getByLabel('Number', { exact: true }).fill('Links Test');
    await page.getByRole('button', { name: 'Save' }).click();

    // create a link
    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^RouterThe router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-100' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-100' })).toBeVisible();

    // go to target link router and expect source instance to be linked
    await page.getByRole('link', { name: 'TL-100' }).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible(); // make sure we are on the routers page
    await expect(page.getByRole('textbox').nth(1)).toHaveValue('TL-100');
    await expect(page.getByRole('link', { name: 'Links Test' })).toBeVisible();

    // go back to source instance and expect link to be visible
    await page.getByRole('link', { name: 'Links Test' }).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible(); // make sure we are on the routers page
    await expect(page.getByRole('link', { name: 'TL-100' })).toBeVisible();

    // delete link
    await page.locator('#link-TL-100').hover();
    await page.locator('#delete-link-TL-100').click();

    // refresh page
    await page.goto('/')
    await routersPrimaryNavigation(page).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible(); // make sure we are on the routers page

    // create multiple linkable instances
    await page.getByRole('link', { name: 'Target Link' }).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible(); // make sure we are on the routers page

    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-200');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-300');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-400');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-500');
    await page.getByRole('button', { name: 'Save' }).click();

    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-600');
    await page.getByRole('button', { name: 'Save' }).click();

    // create source instance
    await page.getByRole('link', { name: 'Links Router' }).click();
    await page.locator('[id="create-instance-Links\\ Router"]').click();
    await page.getByLabel('Number', { exact: true }).fill('Multiple Links Test');
    await page.getByRole('button', { name: 'Save' }).click();

    // create links
    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^RouterThe router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-200' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-200' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^RouterThe router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-300' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-300' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^RouterThe router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-400' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-400' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^RouterThe router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-500' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-500' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^RouterThe router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the router you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-600' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-600' })).toBeVisible();

    // delete links
    await page.locator('#link-TL-200').hover();
    await page.locator('#delete-link-TL-200').click();
    await expect(page.getByRole('link', { name: 'TL-200' })).not.toBeVisible();
    await page.locator('#link-TL-300').hover();
    await page.locator('#delete-link-TL-300').click();
    await expect(page.getByRole('link', { name: 'TL-300' })).not.toBeVisible();
    await page.locator('#link-TL-400').hover();
    await page.locator('#delete-link-TL-400').click();
    await expect(page.getByRole('link', { name: 'TL-400' })).not.toBeVisible();
    await page.locator('#link-TL-500').hover();
    await page.locator('#delete-link-TL-500').click();
    await expect(page.getByRole('link', { name: 'TL-500' })).not.toBeVisible();
    await page.locator('#link-TL-600').hover();
    await page.locator('#delete-link-TL-600').click();
    await expect(page.getByRole('link', { name: 'TL-600' })).not.toBeVisible();
}); 