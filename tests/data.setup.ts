import { test as setup, expect } from '@playwright/test';

setup("create fields", async ({ page }) => {
    // create fields
    await page.goto('/');
    await page.getByRole('button', { name: 'Fields' }).click();
    await page.getByRole('link', { name: 'Customer Orders' }).nth(1).click();
    await page.getByRole('button', { name: 'New Section' }).click();
    await page.getByPlaceholder('Section Name').fill('Basic');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.getByPlaceholder('Enter the field name').fill('Plain Text');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Some text field');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Number$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Number Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Some number field');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Date$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Some Date');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Some date field');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Time$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Some Time');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Some time field');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Paragraph$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Some Paragraph');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Some paragraph field');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Section' }).click();
    await page.getByRole('textbox', { name: 'Section Name' }).fill('Selects');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).nth(1).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('SR Select');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('SR Select description');
    await page.getByPlaceholder('Type an option and press enter').click();
    await page.getByPlaceholder('Type an option and press enter').fill('Option 1');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 2');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 3');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).nth(1).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('SC Select');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('SC Select description');
    await page.locator('div').filter({ hasText: /^Creative$/ }).getByRole('img').click();
    await page.getByPlaceholder('Type an option and press enter').click();
    await page.getByPlaceholder('Type an option and press enter').fill('Option 1');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 2');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 3');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).nth(1).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('MR Select');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('MR Select description');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).getByRole('img').click();
    await page.getByPlaceholder('Type an option and press enter').click();
    await page.getByPlaceholder('Type an option and press enter').fill('Option 1');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 2');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 3');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).nth(1).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).getByRole('img').click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('MC Select');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('MC Select description');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).getByRole('img').click();
    await page.locator('div').filter({ hasText: /^Creative$/ }).getByRole('img').click();
    await page.getByPlaceholder('Type an option and press enter').click();
    await page.getByPlaceholder('Type an option and press enter').fill('Option 1');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 2');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByPlaceholder('Type an option and press enter').fill('Option 3');
    await page.getByPlaceholder('Type an option and press enter').press('Enter');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
            - textbox "Section Name"
            - button "New Field":
              - img
            - button:
              - img
            - table:
              - rowgroup:
                - row "Name Type Default Values Options":
                  - cell "Name"
                  - cell "Type"
                  - cell "Default Values"
                  - cell "Options"
                  - cell
              - rowgroup:
                - row "Plain Text text":
                  - cell "Plain Text"
                  - cell "text"
                  - cell
                  - cell
                  - cell:
                    - button:
                      - img
                - row "Number Field number":
                  - cell "Number Field"
                  - cell "number"
                  - cell
                  - cell
                  - cell:
                    - button:
                      - img
                - row "Some Date date":
                  - cell "Some Date"
                  - cell "date"
                  - cell
                  - cell
                  - cell:
                    - button:
                      - img
                - row "Some Time time":
                  - cell "Some Time"
                  - cell "time"
                  - cell
                  - cell
                  - cell:
                    - button:
                      - img
                - row "Some Paragraph paragraph":
                  - cell "Some Paragraph"
                  - cell "paragraph"
                  - cell
                  - cell
                  - cell:
                    - button:
                      - img
            - textbox "Section Name"
            - button "New Field":
              - img
            - button:
              - img
            - table:
              - rowgroup:
                - row "Name Type Default Values Options":
                  - cell "Name"
                  - cell "Type"
                  - cell "Default Values"
                  - cell "Options"
                  - cell
              - rowgroup:
                - row "SR Select select Option 1 Option 2 Option 3":
                  - cell "SR Select"
                  - cell "select"
                  - cell
                  - cell "Option 1 Option 2 Option 3"
                  - cell:
                    - button:
                      - img
                - row "SC Select select Option 1 Option 2 Option 3":
                  - cell "SC Select"
                  - cell "select"
                  - cell
                  - cell "Option 1 Option 2 Option 3"
                  - cell:
                    - button:
                      - img
                - row "MR Select select Option 1 Option 2 Option 3":
                  - cell "MR Select"
                  - cell "select"
                  - cell
                  - cell "Option 1 Option 2 Option 3"
                  - cell:
                    - button:
                      - img
                - row "MC Select select Option 1 Option 2 Option 3":
                  - cell "MC Select"
                  - cell "select"
                  - cell
                  - cell "Option 1 Option 2 Option 3"
                  - cell:
                    - button:
                      - img
            `);
})