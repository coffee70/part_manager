import { test, expect } from '@playwright/test';

test("test fields", async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Models', exact: true }).click();
  await page.getByRole('button', { name: 'New Model' }).click();
  await page.getByRole('textbox').fill('Fields Test');
  await page.getByLabel('Create Model').getByText('Priority', { exact: true }).click();
  await page.locator('div:nth-child(16)').click();
  await page.getByRole('button', { name: 'Save' }).click();

  // create fields
  await page.goto('/');
  await page.getByRole('link', { name: 'Fields', exact: true }).click();
  await page.locator('#model-select').click();
  await page.getByRole('menuitem', { name: 'Fields Test' }).click();
  await page.getByRole('button', { name: 'New Section' }).click();
  await page.getByLabel('Section Name').fill('Basic');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.getByPlaceholder('Enter the field name').fill('Text Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Text field description');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Number$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Number Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Number field description');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Date$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Date Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Date field description');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Time$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Time Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Time field description');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Paragraph$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Paragraph Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Paragraph field description');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Single Restricted Select Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Single restricted select field description');
  await page.getByPlaceholder('Type an option and press').click();
  await page.getByPlaceholder('Type an option and press').fill('Option 1');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 2');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 3');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Single Creative Select Field');
  await page.getByPlaceholder('Enter the field name').press('Tab');
  await page.getByPlaceholder('Enter the field description').fill('Single creative select field description');
  await page.locator('div').filter({ hasText: /^Creative$/ }).click();
  await page.getByPlaceholder('Type an option and press').click();
  await page.getByPlaceholder('Type an option and press').fill('Option 1');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 2');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 3');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Multiple Restricted Select Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Multiple restricted select field description');
  await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
  await page.getByPlaceholder('Type an option and press').click();
  await page.getByPlaceholder('Type an option and press').fill('Option 1');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 2');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 3');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'New Field' }).click();
  await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Multiple Creative Select Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Multiple creative select field description');
  await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
  await page.locator('div').filter({ hasText: /^Creative$/ }).click();
  await page.getByPlaceholder('Type an option and press').click();
  await page.getByPlaceholder('Type an option and press').fill('Option 1');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 2');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 3');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#section-name')).toHaveValue('Basic');
  await expect(page.getByRole('table')).toMatchAriaSnapshot(`
    - table:
      - rowgroup:
        - row "Type Name Description Default Values Options":
          - cell "Type"
          - cell "Name"
          - cell "Description"
          - cell "Default Values"
          - cell "Options"
          - cell
      - rowgroup:
        - row "Text Field Text field description":
          - cell:
            - img
          - cell "Text Field"
          - cell "Text field description"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Number Field Number field description":
          - cell:
            - img
          - cell "Number Field"
          - cell "Number field description"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Date Field Date field description":
          - cell:
            - img
          - cell "Date Field"
          - cell "Date field description"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Time Field Time field description":
          - cell:
            - img
          - cell "Time Field"
          - cell "Time field description"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Paragraph Field Paragraph field description":
          - cell:
            - img
          - cell "Paragraph Field"
          - cell "Paragraph field description"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Single Restricted Select Field Single restricted select field description Option 1 Option 2 Option 3":
          - cell:
            - img
          - cell "Single Restricted Select Field"
          - cell "Single restricted select field description"
          - cell
          - cell "Option 1 Option 2 Option 3"
          - cell:
            - button:
              - img
        - row "Single Creative Select Field Single creative select field description Option 1 Option 2 Option 3":
          - cell:
            - img
          - cell "Single Creative Select Field"
          - cell "Single creative select field description"
          - cell
          - cell "Option 1 Option 2 Option 3"
          - cell:
            - button:
              - img
        - row "Multiple Restricted Select Field Multiple restricted select field description Option 1 Option 2 Option 3":
          - cell:
            - img
          - cell "Multiple Restricted Select Field"
          - cell "Multiple restricted select field description"
          - cell
          - cell "Option 1 Option 2 Option 3"
          - cell:
            - button:
              - img
        - row "Multiple Creative Select Field Multiple creative select field description Option 1 Option 2 Option 3":
          - cell:
            - img
          - cell "Multiple Creative Select Field"
          - cell "Multiple creative select field description"
          - cell
          - cell "Option 1 Option 2 Option 3"
          - cell:
            - button:
              - img
    `);

  // create a new section
  await page.getByRole('button', { name: 'New Section' }).click();
  await page.getByLabel('Section Name').fill('Another');
  await page.getByRole('button', { name: 'Save' }).click();

  // create a new field in the new section
  await page.getByRole('button', { name: 'New Field' }).nth(1).click();
  await page.getByPlaceholder('Enter the field name').fill('Some Text Field');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Some text field description');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('textbox').nth(1)).toHaveValue('Another');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - table:
        - rowgroup:
          - row "Type Name Description Default Values Options":
            - cell "Type"
            - cell "Name"
            - cell "Description"
            - cell "Default Values"
            - cell "Options"
            - cell
        - rowgroup:
          - row "Some Text Field Some text field description":
            - cell:
              - img
            - cell "Some Text Field"
            - cell "Some text field description"
            - cell
            - cell
            - cell:
              - button:
                - img
      `);

  // delete the new field
  await page.getByRole('row', { name: 'Some Text Field Some text' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - table:
        - rowgroup:
          - row "Type Name Description Default Values Options":
            - cell "Type"
            - cell "Name"
            - cell "Description"
            - cell "Default Values"
            - cell "Options"
            - cell
        - rowgroup
      `);
  await page.locator('div:nth-child(3) > div > button:nth-child(2)').click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('main')).not.toHaveText('Another');

  // update fields
  await page.getByRole('row', { name: 'Text Field Text field' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Text Field');
  await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Text field description');
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Text Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Text field description edited');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('tbody')).toContainText('Text Field Edited');
  await expect(page.locator('tbody')).toContainText('Text field description edited');
  await page.getByRole('row', { name: 'Number Field Number field' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Number Field');
  await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Number field description');
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Number Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Number field description edited');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('tbody')).toContainText('Number field description edited');
  await expect(page.locator('tbody')).toContainText('Number Field Edited');
  await page.getByRole('row', { name: 'Date Field Date field' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Date Field');
  await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Date field description');
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Date Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Date field description edited');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('tbody')).toContainText('Date Field Edited');
  await expect(page.locator('tbody')).toContainText('Date field description edited');
  await page.getByRole('row', { name: 'Time Field Time field' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Time Field');
  await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Time field description');
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Time Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Time field description edited');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('tbody')).toContainText('Time field description edited');
  await expect(page.locator('tbody')).toContainText('Time Field Edited');
  await page.getByRole('row', { name: 'Paragraph Field Paragraph' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Paragraph Field');
  await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Paragraph field description');
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Paragraph Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Paragraph field description edited');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('tbody')).toContainText('Paragraph field description edited');
  await expect(page.locator('tbody')).toContainText('Paragraph Field Edited');
  await page.getByRole('row', { name: 'Single Restricted Select' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Single Restricted Select Field');
  await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Single restricted select field description');
  await expect(page.getByLabel('New Field').locator('form')).toContainText('Option 1Option 2Option 3');
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Single Restricted Select Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Single restricted select field description edited');
  await page.getByPlaceholder('Type an option and press').click();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.getByPlaceholder('Type an option and press').fill('Option 4');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 5');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 6');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('row', { name: 'Single Creative Select Field' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Single Creative Select Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Single creative select field description edited');
  await page.getByPlaceholder('Type an option and press').click();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.getByPlaceholder('Type an option and press').fill('Option 7');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 8');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 9');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('row', { name: 'Multiple Restricted Select' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Multiple Restricted Select Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Multiple restricted select field description edited');
  await page.getByPlaceholder('Type an option and press').click();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.getByPlaceholder('Type an option and press').fill('Option 10');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 11');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 12');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('row', { name: 'Multiple Creative Select' }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByPlaceholder('Enter the field name').click();
  await page.getByPlaceholder('Enter the field name').fill('Multiple Creative Select Field Edited');
  await page.getByPlaceholder('Enter the field description').click();
  await page.getByPlaceholder('Enter the field description').fill('Multiple creative select field description edited');
  await page.getByPlaceholder('Type an option and press').click();
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('Backspace');
  await page.getByPlaceholder('Type an option and press').fill('Option 13');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 14');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByPlaceholder('Type an option and press').fill('Option 15');
  await page.getByPlaceholder('Type an option and press').press('Enter');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('table')).toMatchAriaSnapshot(`
    - table:
      - rowgroup:
        - row "Type Name Description Default Values Options":
          - cell "Type"
          - cell "Name"
          - cell "Description"
          - cell "Default Values"
          - cell "Options"
          - cell
      - rowgroup:
        - row "Text Field Edited Text field description edited":
          - cell:
            - img
          - cell "Text Field Edited"
          - cell "Text field description edited"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Number Field Edited Number field description edited":
          - cell:
            - img
          - cell "Number Field Edited"
          - cell "Number field description edited"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Date Field Edited Date field description edited":
          - cell:
            - img
          - cell "Date Field Edited"
          - cell "Date field description edited"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Time Field Edited Time field description edited":
          - cell:
            - img
          - cell "Time Field Edited"
          - cell "Time field description edited"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Paragraph Field Edited Paragraph field description edited":
          - cell:
            - img
          - cell "Paragraph Field Edited"
          - cell "Paragraph field description edited"
          - cell
          - cell
          - cell:
            - button:
              - img
        - row "Single Restricted Select Field Edited Single restricted select field description edited Option 4 Option 5 Option 6":
          - cell:
            - img
          - cell "Single Restricted Select Field Edited"
          - cell "Single restricted select field description edited"
          - cell
          - cell "Option 4 Option 5 Option 6"
          - cell:
            - button:
              - img
        - row "Single Creative Select Field Edited Single creative select field description edited Option 7 Option 8 Option 9":
          - cell:
            - img
          - cell "Single Creative Select Field Edited"
          - cell "Single creative select field description edited"
          - cell
          - cell "Option 7 Option 8 Option 9"
          - cell:
            - button:
              - img
        - row /Multiple Restricted Select Field Edited Multiple restricted select field description edited Option \\d+ Option \\d+ Option \\d+/:
          - cell:
            - img
          - cell "Multiple Restricted Select Field Edited"
          - cell "Multiple restricted select field description edited"
          - cell
          - cell /Option \\d+ Option \\d+ Option \\d+/
          - cell:
            - button:
              - img
        - row /Multiple Creative Select Field Edited Multiple creative select field description edited Option \\d+ Option \\d+ Option \\d+/:
          - cell:
            - img
          - cell "Multiple Creative Select Field Edited"
          - cell "Multiple creative select field description edited"
          - cell
          - cell /Option \\d+ Option \\d+ Option \\d+/
          - cell:
            - button:
              - img
    `);

  // create a Fields Test instance
  await page.goto('/');
  await page.getByRole('link', { name: 'Fields Test' }).click();
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
  await expect(page.getByLabel('Edit Instance: Fields Test').getByLabel('Basic')).toContainText('Option 10Option 11');
  await expect(page.getByLabel('Edit Instance: Fields Test').getByLabel('Basic')).toContainText('Option 13Option 16');

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
  await page.getByLabel('Edit Instance: Fields Test').waitFor({ state: 'detached' })

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
  await page.getByRole('link', { name: 'Fields Test' }).click();
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
