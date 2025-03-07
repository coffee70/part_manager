import { test, expect } from '@playwright/test';
import { routerFormColor, routersAdminPageNavigation, routersPrimaryNavigation } from './lib';

test('routers', async ({ page }) => {
  await page.goto('/');
  await routersPrimaryNavigation(page).click();
  await routersAdminPageNavigation(page).click();
  await page.getByRole('button', { name: 'New Router' }).click();
  await page.getByRole('textbox').fill('Routers Test');
  await page.getByLabel('Create Router').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Create Router').getByText('Links').click();
  await page.getByLabel('Create Router').getByText('Comments').click();
  await routerFormColor(page, 16).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // create a Routers Test instance
  await page.getByRole('link', { name: 'Routers Test', exact: true }).click();
  await page.locator('[id="create-instance-Routers\\ Test"]').click();
  await page.getByLabel('Number').fill('T-100');
  await page.getByRole('button', { name: 'Save' }).click();

  // check that instance is attachable, linkable, commentable
  await expect(page.getByText('Attachments', { exact: true })).toBeVisible();
  await expect(page.getByText('Links', { exact: true })).toBeVisible();
  await expect(page.getByText('Activity', { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Comments', exact: true })).toBeVisible();
  await expect(page.getByText('No comments yet')).toBeVisible();
  await expect(page.getByLabel('action_Attachments')).toBeVisible();
  await expect(page.getByLabel('action_Links')).toBeVisible();

  // take away attachable, linkable, commentable
  await routersAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Routers Test' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Edit Router').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Edit Router').getByText('Links', { exact: true }).click();
  await page.getByLabel('Edit Router').getByText('Comments', { exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check that instance is not attachable, linkable, commentable
  await page.getByRole('link', { name: 'Routers Test' }).click();
  await expect(page.getByText('Attachments', { exact: true })).not.toBeVisible();
  await expect(page.getByText('Links', { exact: true })).not.toBeVisible();
  await expect(page.getByText('Activity', { exact: true })).not.toBeVisible();
  await expect(page.getByRole('tab', { name: 'Comments', exact: true })).not.toBeVisible();
  await expect(page.getByText('No comments yet')).not.toBeVisible();
  await expect(page.getByLabel('action_Attachments')).not.toBeVisible();
  await expect(page.getByLabel('action_Links')).not.toBeVisible();


  // delete the instance
  await page.getByRole('row', { name: 'T-100 Today by Test Admin' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  // return the routers page
  await routersAdminPageNavigation(page).click();

  // add back attachable, linkable, commentable
  await page.getByRole('row', { name: 'Routers Test' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Edit Router').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Edit Router').getByText('Links').click();
  await page.getByLabel('Edit Router').getByText('Comments').click();
  await page.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByRole('table')).toContainText('Color');
  await expect(page.getByRole('table')).toContainText('Name');
  await expect(page.getByRole('table')).toContainText('Attachments');
  await expect(page.getByRole('table')).toContainText('Links');
  await expect(page.getByRole('table')).toContainText('Comments');

  const routersTestRow = page.getByRole('row', { name: 'Routers Test' });
  await expect(routersTestRow).toBeVisible();
  await expect(routersTestRow.getByRole('cell').nth(1)).toHaveText('Routers Test');
  await expect(page.getByTestId('attachable-Routers Test')).toBeVisible();
  await expect(page.getByTestId('linkable-Routers Test')).toBeVisible();
  await expect(page.getByTestId('commentable-Routers Test')).toBeVisible();

  await page.getByRole('row', { name: 'Routers Test' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByRole('textbox').fill('Routers Test Edited');
  await page.getByLabel('Edit Router').getByText('Attachments', { exact: true }).click();
  await page.getByLabel('Edit Router').getByText('Links').click();
  await page.getByLabel('Edit Router').getByText('Comments').click();
  await routerFormColor(page, 11).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('table')).toContainText('Color');
  await expect(page.getByRole('table')).toContainText('Name');
  await expect(page.getByRole('table')).toContainText('Attachments');
  await expect(page.getByRole('table')).toContainText('Links');
  await expect(page.getByRole('table')).toContainText('Comments');

  const routersTestEditedRow = page.getByRole('row', { name: 'Routers Test Edited' });
  await expect(routersTestEditedRow).toBeVisible();
  await expect(routersTestEditedRow.getByRole('cell').nth(1)).toHaveText('Routers Test Edited');
  await expect(page.getByTestId('attachable-Routers Test Edited')).not.toBeVisible();
  await expect(page.getByTestId('linkable-Routers Test Edited')).not.toBeVisible();
  await expect(page.getByTestId('commentable-Routers Test Edited')).not.toBeVisible();

  // create Routers Test instance
  await page.getByRole('link', { name: 'Routers Test Edited' }).click();
  await page.locator('[id="create-instance-Routers\\ Test\\ Edited"]').click();
  await page.getByLabel('Number').fill('T-100');
  await page.getByRole('button', { name: 'Save' }).click();

  // check more button is not visible
  await expect(page.locator('#more-button')).not.toBeVisible();

  // add comments to the router
  await routersAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Routers Test Edited' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Edit Router').getByText('Comments').click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check More button has "Add Comment" option
  await page.getByRole('link', { name: 'Routers Test Edited' }).click();
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
  await routersAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Routers Test Edited' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Edit Router').getByText('Comments').click();
  await page.getByLabel('Edit Router').getByText('Links').click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check More button has "Add Link" option
  await page.getByRole('link', { name: 'Routers Test Edited' }).click();
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
  await routersAdminPageNavigation(page).click();
  await page.getByRole('row', { name: 'Routers Test Edited' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Edit Router').getByText('Links').click();
  await page.getByLabel('Edit Router').getByText('Attachments', { exact: true }).click();
  await page.getByRole('button', { name: 'Save' }).click();

  // check More button has "Add Attachment" option
  await page.getByRole('link', { name: 'Routers Test Edited' }).click();
  await page.getByRole('cell', { name: 'T-100' }).click();
  await expect(page.locator('#more-button')).toBeVisible();
  await page.locator('#more-button-dropdown-trigger').click();
  await expect(page.getByRole('menuitem', { name: 'Add Attachment' })).toBeVisible();

  // check that "Add Link" and "Add Comment" options are not visible
  await expect(page.getByRole('menuitem', { name: 'Add Link' })).not.toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Add Comment' })).not.toBeVisible();
}); 