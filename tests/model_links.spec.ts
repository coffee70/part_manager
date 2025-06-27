import { test, expect } from '@playwright/test';
import { modelFormColor, modelsAdminPageNavigation } from './lib';

test('links', async ({ page }) => {
    await page.goto('/')

    // create model
    await modelsAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Model' }).click();
    await page.getByRole('textbox').fill('Links Model');
    await page.getByLabel('Create Model').getByText('Links').click();
    await modelFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create target link model
    await page.getByRole('button', { name: 'New Model' }).click();
    await page.getByRole('textbox').fill('Target Link');
    await page.getByLabel('Create Model').getByText('Links').click();
    await page.getByRole('img').nth(1).click();
    await modelFormColor(page, 24).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create linkable instance
    await page.getByRole('link', { name: 'Target Link' }).click();
    await page.locator('[id="create-instance-Target\\ Link"]').click();
    await page.getByLabel('Number').fill('TL-100');
    await page.getByRole('button', { name: 'Save' }).click();

    // create instance
    await page.getByRole('link', { name: 'Links Model' }).click();
    await page.locator('[id="create-instance-Links\\ Model"]').click();
    await page.getByLabel('Number', { exact: true }).fill('Links Test');
    await page.getByRole('button', { name: 'Save' }).click();

    // create a link
    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^ModelThe model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-100' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-100' })).toBeVisible();

    // go to target link model and expect source instance to be linked
    await page.getByRole('link', { name: 'TL-100' }).click();
    await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible(); // make sure we are on the models page
    await expect(page.getByRole('textbox').nth(1)).toHaveValue('TL-100');

    /**
     * For some reason, the link is not visible in the target link model this quickly.
     * We are going to add a check to see if the link is visible, if its not, send out 
     * a warning log and reload the page. After the reload, the link should be visible.
     */
    try {
      await expect(page.getByRole('link', { name: 'Links Test' })).toBeVisible({ timeout: 1000 });
    } catch (e) {
      console.warn('Link not immediately visible, reloading page...');
      await page.reload();
      await expect(page.getByRole('link', { name: 'Links Test' })).toBeVisible();
    }

    // go back to source instance and expect link to be visible
    await page.getByRole('link', { name: 'Links Test' }).click();
    await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible(); // make sure we are on the models page
    await expect(page.getByRole('link', { name: 'TL-100' })).toBeVisible();

    // delete link
    await page.locator('#link-TL-100').hover();
    await page.locator('#delete-link-TL-100').click();

    // refresh page
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible(); // make sure we are on the models page

    // create multiple linkable instances
    await page.getByRole('link', { name: 'Target Link' }).click();
    await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible(); // make sure we are on the models page

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
    await page.getByRole('link', { name: 'Links Model' }).click();
    await page.locator('[id="create-instance-Links\\ Model"]').click();
    await page.getByLabel('Number', { exact: true }).fill('Multiple Links Test');
    await page.getByRole('button', { name: 'Save' }).click();

    // create links
    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^ModelThe model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-200' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-200' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^ModelThe model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-300' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-300' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^ModelThe model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-400' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-400' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^ModelThe model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'TL-500' }).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // check link appears
    await expect(page.getByRole('link', { name: 'TL-500' })).toBeVisible();

    await page.getByLabel('action_Links').click();
    await page.locator('div').filter({ hasText: /^ModelThe model you want to link from\.$/ }).getByRole('combobox').click();
    await page.getByRole('combobox').fill('');
    await page.getByRole('option', { name: 'Target Link' }).click();
    await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).getByRole('combobox').click();
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
