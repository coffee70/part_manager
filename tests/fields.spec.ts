import { test, expect } from '@playwright/test';

test("test fields", async ({ page }) => {
  // create a Something instance
  await page.goto('/');
  await page.getByRole('link', { name: 'Something' }).click();
  await page.getByRole('button').nth(1).click();
  // fill in the number
  await page.getByLabel('Number', { exact: true }).fill('S-100');
  // fill in the priority
  await page.getByLabel('Priority').click();
  await page.getByLabel('Priority').fill('');
  await page.getByRole('option', { name: 'Low', exact: true }).click();
  // fill in the notes
  await page.getByLabel('Notes').click();
  await page.getByLabel('Notes').fill('Some notes on something');
  // fill in the text field
  await page.getByLabel('Text Field Edited').click();
  await page.getByLabel('Text Field Edited').fill('Some text');
  // fill in the number field
  await page.getByLabel("Number Field Edited").click();
  await page.getByLabel("Number Field Edited").fill('10');
  // fill in the date field
  await page.getByLabel("Date Field Edited").fill('2022-10-12');
  // fill in the time field
  await page.getByLabel("Time Field Edited").click();
  await page.getByLabel("Time Field Edited").fill('10:10');
  // fill in the paragraph field
  await page.getByLabel("Paragraph Field Edited").click();
  await page.getByLabel("Paragraph Field Edited").fill('Some paragraph');
  // fill in the single restricted select field
  await page.getByLabel("Single Restricted Select Field Edited").click();
  await page.getByRole('option', { name: 'Option 4' }).click();
  // fill in the single creative select field
  await page.getByLabel("Single Creative Select Field Edited").click();
  await page.getByRole('option', { name: 'Option 8' }).click();
  // fill in the multiple restricted select field
  await page.getByLabel("Multiple Restricted Select Field Edited").click();
  await page.getByRole('option', { name: 'Option 10' }).click();
  await page.getByLabel("Multiple Restricted Select Field Edited").click();
  await page.getByRole('option', { name: 'Option 11' }).click();
  // fill in the multiple creative select field
  await page.getByLabel("Multiple Creative Select Field Edited").click();
  await page.getByRole('option', { name: 'Option 13' }).click();
  await page.getByLabel("Multiple Creative Select Field Edited").fill('Option 16');
  await page.getByLabel("Multiple Creative Select Field Edited").press('Enter');
  // save the instance
  await page.getByRole('button', { name: 'Save' }).click();

  // check the details section matches what was in the form
  await expect(page.getByLabel('Basic').locator('input[type="text"]')).toHaveValue('Some text');
  await expect(page.getByRole('spinbutton')).toHaveValue('10');
  await expect(page.locator('input[type="date"]')).toHaveValue('2022-10-12');
  await expect(page.locator('input[type="time"]')).toHaveValue('10:10');
  await expect(page.getByText('Some paragraph')).toHaveValue('Some paragraph');
  await expect(page.getByRole('combobox').first()).toHaveValue('Option 4');
  await expect(page.getByRole('combobox').nth(1)).toHaveValue('Option 8');
  await expect(page.getByLabel('Basic')).toContainText('Option 10Option 11');
  await expect(page.getByLabel('Basic')).toContainText('Option 13Option 16');

  // open the edit form
  await page.getByRole('button', { name: 'Edit' }).click();

  // ensure the fields are filled in correctly
  await expect(page.getByLabel('Number', { exact: true })).toHaveValue('S-100');
  await expect(page.getByLabel('Priority')).toHaveValue('Low');
  await expect(page.getByLabel('Notes')).toHaveValue('Some notes on something');
  await expect(page.getByLabel('Text Field Edited', { exact: true })).toHaveValue('Some text');
  await expect(page.getByLabel('Number Field Edited', { exact: true })).toHaveValue('10');
  await expect(page.getByLabel('Date Field Edited', { exact: true })).toHaveValue('2022-10-12');
  await expect(page.getByLabel('Time Field Edited', { exact: true })).toHaveValue('10:10');
  await expect(page.getByLabel('Paragraph Field Edited', { exact: true })).toHaveValue('Some paragraph');
  await expect(page.getByLabel('Single Restricted Select Field Edited', { exact: true })).toHaveValue('Option 4');
  await expect(page.getByLabel('Single Creative Select Field Edited', { exact: true })).toHaveValue('Option 8');
  await expect(page.getByLabel('Edit Instance: Something').getByLabel('Basic')).toContainText('Option 10Option 11');
  await expect(page.getByLabel('Edit Instance: Something').getByLabel('Basic')).toContainText('Option 13Option 16');

  // edit the number field
  await page.getByLabel('Number', { exact: true }).click();
  await page.getByLabel('Number', { exact: true }).fill('S-200');
  // edit the priority field
  await page.getByLabel('Priority').click();
  await page.getByRole('combobox').fill('H');
  await page.getByRole('option', { name: 'Highest' }).click();
  await page.getByText('Priority', { exact: true }).click();
  // edit the notes field
  await page.getByLabel('Notes').click();
  await page.getByLabel('Notes').fill('Some notes on something edited');
  // edit the text field
  await page.getByLabel('Text Field Edited', { exact: true }).click();
  await page.getByLabel('Text Field Edited', { exact: true }).fill('Some text edited');
  // edit the number field
  await page.getByLabel('Number Field Edited', { exact: true }).click();
  await page.getByLabel('Number Field Edited', { exact: true }).fill('20');
  // edit the date field
  await page.getByLabel('Date Field Edited', { exact: true }).fill('1111-11-11');
  // edit the time field
  await page.getByLabel('Time Field Edited', { exact: true }).click();
  await page.getByLabel('Time Field Edited', { exact: true }).fill('23:11');
  // edit the paragraph field
  await page.getByLabel('Paragraph Field Edited', { exact: true }).click();
  await page.getByLabel('Paragraph Field Edited', { exact: true }).fill('Some paragraph edited');
  // edit the single restricted select field
  await page.getByLabel('Single Restricted Select Field Edited', { exact: true }).click();
  await page.getByLabel('Single Restricted Select Field Edited', { exact: true }).fill('Opti');
  await page.getByRole('option', { name: 'Option 5' }).click();
  // edit the single creative select field
  await page.getByLabel('Single Creative Select Field Edited', { exact: true }).click();
  await page.getByLabel('Single Creative Select Field Edited', { exact: true }).fill('Optio');
  await page.getByRole('option', { name: 'Option 9' }).click();
  // edit the multiple restricted select field
  await page.getByLabel('Multiple Restricted Select Field Edited', { exact: true }).click();
  await page.keyboard.press('Backspace');
  await page.getByRole('option', { name: 'Option 12' }).click();
  // edit the multiple creative select field
  await page.getByLabel('Multiple Creative Select Field Edited', { exact: true }).click();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.getByRole('option', { name: 'Option 14' }).click();
  await page.getByLabel('Multiple Creative Select Field Edited', { exact: true }).fill('Option 17');
  await page.getByLabel('Multiple Creative Select Field Edited', { exact: true }).press('Enter');
  // save the instance
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByLabel('Edit Instance: Something').waitFor({ state: 'detached' })

  // verify fields changed in details section
  await expect(page.getByLabel('Text Field Edited:')).toHaveValue('Some text edited');
  await expect(page.getByLabel('Number Field Edited:')).toHaveValue('20');
  await expect(page.getByLabel('Date Field Edited:')).toHaveValue('1111-11-11');
  await expect(page.getByLabel('Time Field Edited:')).toHaveValue('23:11');
  await expect(page.getByLabel('Paragraph Field Edited:')).toHaveValue('Some paragraph edited');
  await expect(page.getByLabel('Single Restricted Select Field Edited:')).toHaveValue('Option 5');
  await expect(page.getByLabel('Single Creative Select Field Edited:')).toHaveValue('Option 9');
  await expect(page.getByLabel('Basic')).toContainText('Option 10Option 12');
  await expect(page.getByLabel('Basic')).toContainText('Option 14Option 17');

  // edit fields in the details section
  await page.getByLabel('Text Field Edited:').click();
  await page.getByLabel('Text Field Edited:').fill('something');
  await page.getByLabel('Text Field Edited:').press('Enter');
  await expect(page.getByLabel('Text Field Edited:')).toHaveValue('something');
  await page.getByLabel('Number Field Edited:').click();
  await page.getByLabel('Number Field Edited:').fill('30');
  await page.getByLabel('Number Field Edited:').press('Enter');
  await expect(page.getByLabel('Number Field Edited:')).toHaveValue('30');
  await page.getByLabel('Date Field Edited:').click();
  await page.getByLabel('Date Field Edited:').fill('1212-12-12');
  await page.getByLabel('Date Field Edited:').press('Enter');
  await expect(page.getByLabel('Date Field Edited:')).toHaveValue('1212-12-12');
  await page.getByLabel('Time Field Edited:').click();
  await page.getByLabel('Time Field Edited:').fill('00:12');
  await page.getByLabel('Time Field Edited:').press('Enter');
  await expect(page.getByLabel('Time Field Edited:')).toHaveValue('00:12');
  await page.getByLabel('Paragraph Field Edited:').click();
  await page.getByLabel('Paragraph Field Edited:').fill('edited');
  await page.getByLabel('Save field Paragraph Field').click();
  await expect(page.getByLabel('Paragraph Field Edited:')).toHaveValue('edited');
  await page.getByLabel('Single Restricted Select Field Edited:').click();
  await page.getByLabel('Single Restricted Select Field Edited:').fill('Optio');
  await page.getByRole('option', { name: 'Option 6' }).click();
  await page.getByLabel('Save field Single Restricted').click();
  await page.getByLabel('Single Creative Select Field Edited:').click();
  await page.getByLabel('Single Creative Select Field Edited:').fill('Option 100');
  await page.getByLabel('Save field Single Creative').click();
  await page.getByLabel('Multiple Restricted Select Field Edited:').click();
  await page.keyboard.press('Backspace');
  await page.getByRole('option', { name: 'Option 11' }).click();
  await page.getByLabel('Multiple Restricted Select Field Edited:').click();
  await page.getByRole('option', { name: 'Option 10' }).click();
  await page.getByLabel('Multiple Restricted Select Field Edited:').click();
  await page.getByRole('option', { name: 'Option 10' }).click();
  await page.getByLabel('Save field Multiple').click();
  await page.getByLabel('Multiple Creative Select Field Edited:').click();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.getByLabel('Multiple Creative Select Field Edited:').fill('Option 16');
  await page.getByLabel('Multiple Creative Select Field Edited:').press('Enter');
  await page.getByLabel('Multiple Creative Select Field Edited:').fill('Option 22');
  await page.getByLabel('Multiple Creative Select Field Edited:').press('Enter');
  await page.getByLabel('Multiple Creative Select Field Edited:').fill('Option 33');
  await page.getByLabel('Multiple Creative Select Field Edited:').press('Enter');
  await page.getByLabel('Save field Multiple Creative').click();

  // confirm after reload the field changes persist
  await page.goto('/');
  await page.getByRole('link', { name: 'Something' }).click();
  await page.getByRole('cell', { name: 'S-200' }).click();
  await expect(page.getByLabel('Text Field Edited:')).toHaveValue('something');
  await expect(page.getByLabel('Number Field Edited:')).toHaveValue('30');
  await expect(page.getByLabel('Date Field Edited:')).toHaveValue('1212-12-12');
  await expect(page.getByLabel('Time Field Edited:')).toHaveValue('00:12');
  await expect(page.getByLabel('Paragraph Field Edited:')).toHaveValue('edited');
  await expect(page.getByLabel('Single Restricted Select Field Edited:')).toHaveValue('Option 6');
  await expect(page.getByLabel('Single Creative Select Field Edited:')).toHaveValue('Option 100');
  await expect(page.getByLabel('Basic')).toContainText('Option 11Option 10');
  await expect(page.getByLabel('Basic')).toContainText('Option 16Option 22Option 33');
})
