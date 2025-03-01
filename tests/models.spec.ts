import { test, expect } from '@playwright/test';
import { modelFormColor, modelsAdminPageNavigation } from './lib';

test('models', async ({ page }) => {
  await page.goto('/');
  await modelsAdminPageNavigation(page).click();
  await page.getByRole('button', { name: 'New Model' }).click();
  await page.getByRole('textbox').fill('Models Test');
  await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Create Model').getByText('Links').click();
  await page.getByLabel('Create Model').getByText('Comments').click();
  await page.getByLabel('Create Model').getByText('Priority', { exact: true }).click();
  await modelFormColor(page, 16).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // create a Models Test instance
  await page.getByRole('link', { name: 'Models Test', exact: true }).click();
  await page.locator('[id="create-instance-Models\\ Test"]').click();
  await page.getByLabel('Number').fill('T-100');
  await page.getByRole('button', { name: 'Save' }).click();

  // check that instance is attachable, linkable, commentable, has priority
  await expect(page.getByText('Attachments', { exact: true })).toBeVisible();
  await expect(page.getByText('Links', { exact: true })).toBeVisible();
  await expect(page.getByText('Activity', { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Comments', exact: true })).toBeVisible();
  await expect(page.getByText('No comments yet')).toBeVisible();
  await expect(page.getByLabel('action_Attachments')).toBeVisible();
  await expect(page.getByLabel('action_Links')).toBeVisible();
  await expect(page.locator('#priority-button')).toBeVisible();
  await expect(page.locator('#priority-button')).toHaveText('Medium');

  // check priority indicator on table container
  await expect(page.locator('#priority-table-indicator')).toBeVisible();

  // take away attachable, linkable, commentable
  await modelsAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Models Test' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Create Model').getByText('Links', { exact: true }).click();
  await page.getByLabel('Create Model').getByText('Comments', { exact: true }).click();
  await page.getByLabel('Create Model').getByText('Priority', { exact: true }).click()
  await page.getByRole('button', { name: 'Save' }).click();

  // check that instance is not attachable, linkable, commentable
  await page.getByRole('link', { name: 'Models Test' }).click();
  await expect(page.getByText('Attachments', { exact: true })).not.toBeVisible();
  await expect(page.getByText('Links', { exact: true })).not.toBeVisible();
  await expect(page.getByText('Activity', { exact: true })).not.toBeVisible();
  await expect(page.getByRole('tab', { name: 'Comments', exact: true })).not.toBeVisible();
  await expect(page.getByText('No comments yet')).not.toBeVisible();
  await expect(page.getByLabel('action_Attachments')).not.toBeVisible();
  await expect(page.getByLabel('action_Links')).not.toBeVisible();
  await expect(page.locator('#priority-button')).not.toBeVisible();

  // check priority indicator on table container
  await expect(page.locator('#priority-table-indicator')).not.toBeVisible();

  // delete the instance
  await page.getByRole('row', { name: 'T-100 Today by Test Admin' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  // return the models page
  await modelsAdminPageNavigation(page).click();

  // add back attachable, linkable, commentable
  await page.getByRole('row', { name: 'Models Test' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Create Model').getByText('Links').click();
  await page.getByLabel('Create Model').getByText('Comments').click();
  await page.getByLabel('Create Model').getByText('Priority', { exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('table')).toMatchAriaSnapshot(`
        - table:
          - rowgroup:
            - row "Color Name Attachments Links Comments Priority":
              - cell "Color"
              - cell "Name"
              - cell "Attachments"
              - cell "Links"
              - cell "Comments"
              - cell "Priority"
              - cell
          - rowgroup:
            - row "Models Test":
              - cell
              - cell "Models Test"
              - cell:
                - img
              - cell:
                - img
              - cell:
                - img
              - cell:
                - img
              - cell:
                - button:
                  - img
        `);
  await page.getByRole('row', { name: 'Models Test' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByRole('textbox').fill('Models Test Edited');
  await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Create Model').getByText('Links').click();
  await page.getByLabel('Create Model').getByText('Comments').click();
  await page.getByLabel('Create Model').getByText('Priority', { exact: true }).click();
  await modelFormColor(page, 11).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('table')).toMatchAriaSnapshot(`
        - table:
          - rowgroup:
            - row "Color Name Attachments Links Comments Priority":
              - cell "Color"
              - cell "Name"
              - cell "Attachments"
              - cell "Links"
              - cell "Comments"
              - cell "Priority"
              - cell
          - rowgroup:
            - row "Models Test Edited":
              - cell
              - cell "Models Test Edited"
              - cell
              - cell
              - cell
              - cell
              - cell:
                - button:
                  - img
        `);

  // create Models Test instance
  await page.getByRole('link', { name: 'Models Test Edited' }).click();
  await page.locator('[id="create-instance-Models\\ Test\\ Edited"]').click();
  await page.getByLabel('Number').fill('T-100');
  await page.getByRole('button', { name: 'Save' }).click();

  // check more button is not visible
  await expect(page.locator('#more-button')).not.toBeVisible();

  // add comments to the model
  await modelsAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Models Test Edited' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Create Model').getByText('Comments').click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check More button has "Add Comment" option
  await page.getByRole('link', { name: 'Models Test Edited' }).click();
  await page.getByRole('cell', { name: 'T-100' }).click();
  await expect(page.locator('#more-button')).toBeVisible();
  await page.locator('#more-button-dropdown-trigger').click();
  await expect(page.getByRole('menuitem', { name: 'Add Comment' })).toBeVisible();

  // check that "Add Attachment" and "Add Link" options are not visible
  await expect(page.getByRole('menuitem', { name: 'Add Attachment' })).not.toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Add Link' })).not.toBeVisible();

  // close the dropdown
  await page.keyboard.press('Escape');

  // remove comments and add links
  await modelsAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Models Test Edited' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Create Model').getByText('Comments').click();
  await page.getByLabel('Create Model').getByText('Links').click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check More button has "Add Link" option
  await page.getByRole('link', { name: 'Models Test Edited' }).click();
  await page.getByRole('cell', { name: 'T-100' }).click();
  await expect(page.locator('#more-button')).toBeVisible();
  await page.locator('#more-button-dropdown-trigger').click();
  await expect(page.getByRole('menuitem', { name: 'Add Link' })).toBeVisible();

  // check that "Add Attachment" and "Add Comment" options are not visible
  await expect(page.getByRole('menuitem', { name: 'Add Attachment' })).not.toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Add Comment' })).not.toBeVisible();

  // close the dropdown
  await page.keyboard.press('Escape');

  // remove links and add attachments
  await modelsAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Models Test Edited' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Create Model').getByText('Links').click();
  await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check More button has "Add Attachment" option
  await page.getByRole('link', { name: 'Models Test Edited' }).click();
  await page.getByRole('cell', { name: 'T-100' }).click();
  await expect(page.locator('#more-button')).toBeVisible();
  await page.locator('#more-button-dropdown-trigger').click();
  await expect(page.getByRole('menuitem', { name: 'Add Attachment' })).toBeVisible();

  // check that "Add Link" and "Add Comment" options are not visible
  await expect(page.getByRole('menuitem', { name: 'Add Link' })).not.toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Add Comment' })).not.toBeVisible();

  // close the dropdown
  await page.keyboard.press('Escape');
});