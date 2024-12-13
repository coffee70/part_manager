import { test, expect } from "@playwright/test";

test('customer order', async ({ page }) => {
  // create order
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByRole('button').nth(2).click();
  await page.locator('div').filter({ hasText: /^NumberThe customer order number$/ }).getByRole('textbox').fill('O-100');
  await page.locator('div').filter({ hasText: /^CustomerThe customer for this order$/ }).getByRole('combobox').click();
  await page.getByRole('combobox').fill('Wayne Industries');
  await page.locator('div').filter({ hasText: /^NotesAny notes about this order$/ }).locator('textarea').click();
  await page.locator('div').filter({ hasText: /^NotesAny notes about this order$/ }).getByRole('textbox').fill('Some notes on the order.');
  await page.getByLabel('Basic').locator('input[type="text"]').click();
  await page.getByLabel('Basic').locator('input[type="text"]').fill('Some text');
  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('10');
  await page.locator('input[type="date"]').fill('2000-12-12');
  await page.locator('input[type="time"]').click();
  await page.locator('input[type="time"]').fill('00:01');
  await page.getByLabel('Basic').locator('textarea').click();
  await page.getByLabel('Basic').locator('textarea').fill('Something to fill in the paragraph');
  await page.getByRole('tab', { name: 'Selects' }).click();
  await page.getByLabel('Selects').getByRole('combobox').first().click();
  await page.getByRole('combobox').fill('Option 4');
  await page.getByText('BasicSelectsSR SelectNo').click();
  await page.getByLabel('Selects').getByRole('combobox').first().click();
  await page.getByRole('option', { name: 'Option 3' }).click();
  await page.getByLabel('Selects').locator('input').nth(1).click();
  await page.getByRole('option', { name: 'Option 1' }).click();
  await page.getByRole('combobox').fill('Option 4');
  await page.getByLabel('Selects').locator('input').nth(2).click();
  await page.getByRole('option', { name: 'Option 3' }).click();
  await page.getByRole('option', { name: 'Option 1' }).click();
  await page.getByLabel('New Customer Order').click();
  await page.getByLabel('Selects').getByRole('combobox').nth(3).click();
  await page.getByRole('option', { name: 'Option 1' }).click();
  await page.getByRole('combobox').fill('Option 4');
  await page.getByRole('combobox').press('Enter');
  await page.getByLabel('New Customer Order').click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('row')).toContainText('O-100Wayne Industries');
  await expect(page.getByRole('row')).toContainText('Today by Test Admin');

  // change priority
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.locator('div').filter({ hasText: /^EditMedium$/ }).getByRole('button').nth(1).click();
  await page.getByRole('menuitem', { name: 'Lowest' }).click();
  await expect(page.getByRole('main')).toContainText('Lowest');

  // update text field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByLabel('Basic').locator('input[type="text"]').click();
  await expect(page.getByLabel('Basic').locator('input[type="text"]')).toBeFocused();
  await page.getByLabel('Save field Plain Text').click();
  await page.getByLabel('Edit field Plain Text').click();
  await expect(page.getByLabel('Basic').locator('input[type="text"]')).toBeFocused();
  await page.getByLabel('Basic').locator('input[type="text"]').fill('Some edited text');
  await page.getByLabel('Save field Plain Text').click();

  // check the updated text
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await expect(page.getByLabel('Basic').locator('input[type="text"]')).toHaveValue('Some edited text');

  // update number field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('spinbutton').click();
  await expect(page.getByRole('spinbutton')).toBeFocused();
  await page.getByLabel('Save field Number Field').click();
  await page.getByLabel('Edit field Number Field').click();
  await expect(page.getByRole('spinbutton')).toBeFocused();
  await page.getByRole('spinbutton').fill('20');
  await page.getByLabel('Save field Number Field').click();

  // check the updated number
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await expect(page.getByRole('spinbutton')).toHaveValue('20');

  // update date field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.locator('input[type="date"]').click();
  await expect(page.locator('input[type="date"]')).toBeFocused();
  await page.getByLabel('Save field Some Date').click();
  await page.getByLabel('Edit field Some Date').click();
  await expect(page.locator('input[type="date"]')).toBeFocused();
  await page.locator('input[type="date"]').fill('2011-11-11');
  await page.getByLabel('Save field Some Date').click();

  // check the updated date
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await expect(page.locator('input[type="date"]')).toHaveValue('2011-11-11');

  // update time field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.locator('input[type="time"]').click();
  await expect(page.locator('input[type="time"]')).toBeFocused();
  await page.getByLabel('Save field Some Time').click();
  await page.getByLabel('Edit field Some Time').click();
  await expect(page.locator('input[type="time"]')).toBeFocused();
  await page.locator('input[type="time"]').fill('23:11');
  await page.getByLabel('Save field Some Time').click();

  // check the updated time
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await expect(page.locator('input[type="time"]')).toHaveValue('23:11');

  // update paragraph field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByText('Something to fill in the paragraph').click();
  await expect(page.getByText('Something to fill in the paragraph')).toBeFocused();
  await page.getByLabel('Save field Some Paragraph').click();
  await page.getByLabel('Edit field Some Paragraph').click();
  await expect(page.getByText('Something to fill in the paragraph')).toBeFocused();
  await page.getByText('Something to fill in the paragraph').fill('Here are some notes on my life. Here are some edited notes on my life.');
  await page.getByLabel('Save field Some Paragraph').click();

  // check the updated paragraph
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await expect(page.getByText('Here are some notes on my')).toHaveValue('Here are some notes on my life. Here are some edited notes on my life.');

  // update single restricted select field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await page.getByRole('combobox').first().click();
  await expect(page.getByRole('combobox').first()).toBeFocused();
  await page.getByLabel('Save field SR Select').click();
  await page.getByLabel('Edit field SR Select').click();
  await expect(page.getByRole('combobox').first()).toBeFocused();
  await page.getByRole('combobox').first().fill('Option 4');
  await page.getByLabel('Save field SR Select').click();
  await expect(page.getByRole('combobox').first()).toHaveValue('Option 3');
  await page.getByLabel('Selects').locator('form').first().hover();
  await page.getByLabel('Edit field SR Select').click();
  await page.getByRole('combobox').first().fill('Op');
  await page.getByRole('option', { name: 'Option 2' }).click();
  await page.getByLabel('Save field SR Select').click();

  // check the updated single restricted select
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await expect(page.getByRole('combobox').first()).toHaveValue('Option 2');

  // update single creative select field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await page.getByLabel('Selects').locator('form').nth(1).hover();
  await page.getByLabel('Edit field SC Select').click();
  await expect(page.getByRole('combobox').nth(1)).toBeFocused();
  await page.getByRole('combobox').nth(1).fill('Op');
  await page.getByRole('option', { name: 'Option 1' }).click();
  await page.getByLabel('Save field SC Select').click();

  // check the updated single creative select
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await expect(page.getByRole('combobox').nth(1)).toHaveValue('Option 1');

  // update multi restricted select field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await page.locator('form').filter({ hasText: 'Option 3Option 1' }).hover();
  await page.getByLabel('Edit field MR Select').click();
  await page.keyboard.press('Backspace');
  await page.locator('form').filter({ hasText: 'Option 3' }).getByRole('combobox').fill('Op');
  await page.getByRole('option', { name: 'Option 2' }).click();
  await page.getByLabel('Save field MR Select').click();

  // check the updated multi restricted select
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await expect(page.getByLabel('Selects')).toContainText('Option 3Option 2');

  // update multi creative select field
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await page.locator('form').filter({ hasText: 'Option 1Option 4' }).hover();
  await page.getByLabel('Edit field MC Select').click();
  await page.keyboard.press('Backspace');
  await page.locator('form').filter({ hasText: 'Option 1' }).getByRole('combobox').fill('Option 5');
  await page.locator('form').filter({ hasText: 'Option 1' }).getByRole('combobox').press('Enter');
  await page.locator('div').filter({ hasText: /^Option 5$/ }).locator('button').click();
  await page.locator('form').filter({ hasText: 'Option 1' }).getByRole('combobox').fill('Option 6');
  await page.locator('form').filter({ hasText: 'Option 1' }).getByRole('combobox').press('Enter');
  await page.getByLabel('Save field MC Select').click();

  // check the updated multi creative select
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByRole('tab', { name: 'Selects' }).click();
  await expect(page.getByLabel('Selects')).toContainText('Option 1Option 6');

  // edit notes
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await page.getByText('Some notes on the order.').click();
  await expect(page.getByText('Some notes on the order.')).toBeFocused();
  await page.locator('form').filter({ hasText: 'Some notes on the order.' }).getByRole('button').click();
  await page.locator('form').filter({ hasText: 'Some notes on the order.' }).getByRole('button').click();
  await page.getByText('Some notes on the order.').fill('Some notes on the order. Some edited notes on the order.');
  await page.locator('form').filter({ hasText: 'Some notes on the order. Some' }).getByRole('button').click();

  // check the updated notes
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
  await expect(page.getByText('Some notes on the order. Some')).toHaveValue('Some notes on the order. Some edited notes on the order.');

  // add a comment
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByText('O-100').click();
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

  // upload a pdf
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByLabel('action_Attachments').click()
  ]);
  await fileChooser.setFiles('./playwright/A19464.pdf');
  await expect(page.getByLabel('attachment_preview_A19464.pdf')).toBeVisible();

  // view the pdf
  await page.getByLabel('attachment_preview_A19464.pdf').click();
  await expect(page.getByLabel('attachment_viewer_A19464.pdf')).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByLabel('attachment_viewer_A19464.pdf')).not.toBeVisible();

  // delete the pdf
  await page.getByLabel('attachment_preview_A19464.pdf').hover();
  await page.getByLabel('delete_attachment_A19464.pdf').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('canvas')).not.toBeVisible();

  // create link
  await page.getByRole('link', { name: 'Shop Orders' }).click();
  await page.getByRole('button').nth(2).click();
  await page.getByLabel('New Shop Order').locator('input[type="text"]').fill('Shop Order Test');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByLabel('action_Links').click();
  await page.getByRole('combobox').fill('Sho');
  await page.getByRole('option', { name: 'Shop Orders' }).click();
  await page.locator('div').filter({ hasText: /^NumberThe number of the model you want to link from\.$/ }).locator('input').click();
  await page.getByRole('textbox').fill('Shop Order Test');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('link', { name: 'Shop Order Test' })).toBeVisible();
  await page.getByRole('link', { name: 'Shop Order Test' }).click();
  await expect(page.getByRole('link', { name: 'O-100'})).toBeVisible();
  await page.getByRole('link', { name: 'O-100' }).click();

  // delete customer order
  await page.goto('/');
  await page.getByRole('link', { name: 'Customer Orders' }).click();
  await page.getByRole('row', { name: 'O-100 Wayne Industries Today' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
})