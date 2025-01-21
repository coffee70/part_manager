import { test, expect } from '@playwright/test';

test("create and update model", async ({ page }) => {
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
});