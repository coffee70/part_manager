import { test, expect } from '@playwright/test';

test("model setup", async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Models' }).click();
    await page.getByRole('button', { name: 'New Model' }).click();
    await page.getByRole('textbox').fill('Test');
    await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
    await page.getByLabel('Create Model').getByText('Links').click();
    await page.getByLabel('Create Model').getByText('Comments').click();
    await page.locator('div:nth-child(16)').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('table')).toMatchAriaSnapshot(`
        - table:
          - rowgroup:
            - row "Color Name Attachments Links Comments":
              - cell "Color"
              - cell "Name"
              - cell "Attachments"
              - cell "Links"
              - cell "Comments"
              - cell
          - rowgroup:
            - row "Test":
              - cell
              - cell "Test"
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
    await page.getByRole('row', { name: 'Test' }).getByRole('button').click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page.getByRole('textbox').fill('Something');
    await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
    await page.getByLabel('Create Model').getByText('Links').click();
    await page.getByLabel('Create Model').getByText('Comments').click();
    await page.locator('div:nth-child(11)').click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('table')).toMatchAriaSnapshot(`
        - table:
          - rowgroup:
            - row "Color Name Attachments Links Comments":
              - cell "Color"
              - cell "Name"
              - cell "Attachments"
              - cell "Links"
              - cell "Comments"
              - cell
          - rowgroup:
            - row "Something":
              - cell
              - cell "Something"
              - cell
              - cell
              - cell
              - cell:
                - button:
                  - img
        `);

    // create fields
    await page.goto('/');
    await page.getByRole('link', { name: 'Fields' }).click();
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
})