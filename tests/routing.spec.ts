import { test, expect } from '@playwright/test';
import { checkRoutingTableIcons } from './lib';

test.describe('routing', () => {
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('/');

        // create a router
        await page.getByRole('link', { name: 'Routers' }).click();
        await page.locator('#routers_routerss_secondary_navigation').click();
        await page.getByRole('button', { name: 'New Router' }).click();
        await page.getByRole('textbox').fill('Routing Test');
        await page.locator('.grid > div:nth-child(6)').click();
        await page.getByRole('button', { name: 'Save' }).click();

        // create instances (steps)
        await page.getByRole('link', { name: 'Routing Test' }).click();
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('Green Machine');
        await page.getByRole('button', { name: 'Save' }).click();

        // add route fields to the Green Machine step
        await page.getByRole('cell', { name: 'Green Machine' }).click();
        await page.getByLabel('action_Route Fields').click();
        await page.getByLabel('Section Name').fill('Basic');
        await page.getByRole('button', { name: 'Save' }).click();

        // add text field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByPlaceholder('Enter the field name').fill('Text Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Text field description');
        await page.getByRole('button', { name: 'Save' }).click();

        // add number field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Number$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Number Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Number field description');
        await page.getByRole('button', { name: 'Save' }).click();

        // add date field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Date$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Date Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Date field description');
        await page.getByRole('button', { name: 'Save' }).click();

        // add time field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Time$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Time Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Time field description');
        await page.getByRole('button', { name: 'Save' }).click();

        // add paragraph field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Paragraph$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Paragraph Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Paragraph field description');
        await page.getByRole('button', { name: 'Save' }).click();

        // add single restricted select field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Select$/ }).click();
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

        // add single creative select field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Select$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Single Creative Select Field');
        await page.getByPlaceholder('Enter the field name').press('Tab');
        await page.getByPlaceholder('Enter the field description').fill('Single creative select field description');
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Creative$/ }).click();
        await page.getByPlaceholder('Type an option and press').click();
        await page.getByPlaceholder('Type an option and press').fill('Option 1');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByPlaceholder('Type an option and press').fill('Option 2');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByPlaceholder('Type an option and press').fill('Option 3');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();

        // add multiple restricted select field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Select$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Multiple Restricted Select Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Multiple restricted select field description');
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Multiple$/ }).click();
        await page.getByPlaceholder('Type an option and press').click();
        await page.getByPlaceholder('Type an option and press').fill('Option 1');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByPlaceholder('Type an option and press').fill('Option 2');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByPlaceholder('Type an option and press').fill('Option 3');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();

        // add multiple creative select field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Select$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Multiple Creative Select Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Multiple creative select field description');
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Multiple$/ }).click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Creative$/ }).click();
        await page.getByPlaceholder('Type an option and press').click();
        await page.getByPlaceholder('Type an option and press').fill('Option 1');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByPlaceholder('Type an option and press').fill('Option 2');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByPlaceholder('Type an option and press').fill('Option 3');
        await page.getByPlaceholder('Type an option and press').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();

        // add single key-value field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Key Value$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Test Single KV');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Test single kv');
        await page.getByPlaceholder('Type a key and press Enter...').click();
        await page.getByPlaceholder('Type a key and press Enter...').fill('SIN_001');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('SIN_002');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('SIN_003');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();

        // add multiple key-value field
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-add-field-Basic').click();
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Key Value$/ }).click();
        await page.getByPlaceholder('Enter the field name').click();
        await page.getByPlaceholder('Enter the field name').fill('Multiple KV Field');
        await page.getByPlaceholder('Enter the field description').click();
        await page.getByPlaceholder('Enter the field description').fill('Multiple kv field');
        await page.getByLabel('New Field').locator('div').filter({ hasText: /^Multiple$/ }).click();
        await page.getByPlaceholder('Type a key and press Enter...').click();
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_001');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_002');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_003');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_004');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();

        // verify the route fields are displayed in the summary
        await expect(page.getByText('Text Field')).toBeVisible();
        await expect(page.getByText('Number Field')).toBeVisible();
        await expect(page.getByText('Date Field')).toBeVisible();
        await expect(page.getByText('Time Field')).toBeVisible();
        await expect(page.getByText('Paragraph Field')).toBeVisible();
        await expect(page.getByText('Single Restricted Select Field')).toBeVisible();
        await expect(page.getByText('Single Creative Select Field')).toBeVisible();
        await expect(page.getByText('Multiple Restricted Select Field')).toBeVisible();
        await expect(page.getByText('Multiple Creative Select Field')).toBeVisible();
        await expect(page.getByText('Test Single KV')).toBeVisible();
        await expect(page.getByText('Multiple KV Field')).toBeVisible();

        // test editing all fields to ensure forms are pre-filled
        // edit text field
        await page.getByTestId('route-fields-field-Text Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Text Field').click();
        await page.getByTestId('route-fields-edit-field-Text Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Text Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Text field description');
        await page.getByPlaceholder('Enter the field name').fill('Text Field Edited');
        await page.getByPlaceholder('Enter the field description').fill('Text field description edited');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Text Field Edited')).toBeVisible();

        // edit number field
        await page.getByTestId('route-fields-field-Number Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Number Field').click();
        await page.getByTestId('route-fields-edit-field-Number Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Number Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Number field description');
        await page.getByPlaceholder('Enter the field name').fill('Number Field Edited');
        await page.getByPlaceholder('Enter the field description').fill('Number field description edited');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Number Field Edited')).toBeVisible();

        // edit date field
        await page.getByTestId('route-fields-field-Date Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Date Field').click();
        await page.getByTestId('route-fields-edit-field-Date Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Date Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Date field description');
        await page.getByPlaceholder('Enter the field name').fill('Date Field Edited');
        await page.getByPlaceholder('Enter the field description').fill('Date field description edited');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Date Field Edited')).toBeVisible();

        // edit time field
        await page.getByTestId('route-fields-field-Time Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Time Field').click();
        await page.getByTestId('route-fields-edit-field-Time Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Time Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Time field description');
        await page.getByPlaceholder('Enter the field name').fill('Time Field Edited');
        await page.getByPlaceholder('Enter the field description').fill('Time field description edited');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Time Field Edited')).toBeVisible();

        // edit paragraph field
        await page.getByTestId('route-fields-field-Paragraph Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Paragraph Field').click();
        await page.getByTestId('route-fields-edit-field-Paragraph Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Paragraph Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Paragraph field description');
        await page.getByPlaceholder('Enter the field name').fill('Paragraph Field Edited');
        await page.getByPlaceholder('Enter the field description').fill('Paragraph field description edited');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Paragraph Field Edited')).toBeVisible();

        // edit single restricted select field
        await page.getByTestId('route-fields-field-Single Restricted Select Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Single Restricted Select Field').click();
        await page.getByTestId('route-fields-edit-field-Single Restricted Select Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Single Restricted Select Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Single restricted select field description');
        await page.getByPlaceholder('Enter the field name').fill('Single Restricted Select Field Edited');
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
        await expect(page.getByText('Single Restricted Select Field Edited')).toBeVisible();

        // edit single creative select field
        await page.getByTestId('route-fields-field-Single Creative Select Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Single Creative Select Field').click();
        await page.getByTestId('route-fields-edit-field-Single Creative Select Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Single Creative Select Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Single creative select field description');
        await page.getByPlaceholder('Enter the field name').fill('Single Creative Select Field Edited');
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
        await expect(page.getByText('Single Creative Select Field Edited')).toBeVisible();

        // edit multiple restricted select field
        await page.getByTestId('route-fields-field-Multiple Restricted Select Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Multiple Restricted Select Field').click();
        await page.getByTestId('route-fields-edit-field-Multiple Restricted Select Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Multiple Restricted Select Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Multiple restricted select field description');
        await page.getByPlaceholder('Enter the field name').fill('Multiple Restricted Select Field Edited');
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
        await expect(page.getByText('Multiple Restricted Select Field Edited')).toBeVisible();

        // edit multiple creative select field
        await page.getByTestId('route-fields-field-Multiple Creative Select Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Multiple Creative Select Field').click();
        await page.getByTestId('route-fields-edit-field-Multiple Creative Select Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Multiple Creative Select Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Multiple creative select field description');
        await page.getByPlaceholder('Enter the field name').fill('Multiple Creative Select Field Edited');
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
        await expect(page.getByText('Multiple Creative Select Field Edited')).toBeVisible();

        // edit single key-value field
        await page.getByTestId('route-fields-field-Test Single KV').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Test Single KV').click();
        await page.getByTestId('route-fields-edit-field-Test Single KV').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Test Single KV');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Test single kv');
        await page.getByPlaceholder('Enter the field name').fill('Test Single KV Edited');
        await page.getByPlaceholder('Enter the field description').fill('Test single kv edited');
        await page.getByPlaceholder('Type a key and press Enter...').click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.getByPlaceholder('Type a key and press Enter...').fill('SIN_004');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('SIN_005');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('SIN_006');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Test Single KV Edited')).toBeVisible();

        // edit multiple key-value field
        await page.getByTestId('route-fields-field-Multiple KV Field').hover();
        await page.getByTestId('route-fields-field-dropdown-trigger-Multiple KV Field').click();
        await page.getByTestId('route-fields-edit-field-Multiple KV Field').click();
        await expect(page.getByPlaceholder('Enter the field name')).toHaveValue('Multiple KV Field');
        await expect(page.getByPlaceholder('Enter the field description')).toHaveValue('Multiple kv field');
        await page.getByPlaceholder('Enter the field name').fill('Multiple KV Field Edited');
        await page.getByPlaceholder('Enter the field description').fill('Multiple kv field edited');
        await page.getByPlaceholder('Type a key and press Enter...').click();
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_005');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_006');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_007');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByPlaceholder('Type a key and press Enter...').fill('MUL_008');
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Multiple KV Field Edited')).toBeVisible();

        // test editing a section to ensure forms are pre-filled
        await page.getByTestId('route-fields-section-header-Basic').hover();
        await page.getByTestId('route-fields-section-header-dropdown-trigger-Basic').click();
        await page.getByTestId('route-fields-edit-section-Basic').click();
        await expect(page.getByLabel('Section Name')).toHaveValue('Basic');
        await page.getByLabel('Section Name').fill('Basic Edited');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('BASIC EDITED')).toBeVisible();

        // create a new instance
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('Isopress');
        await page.getByRole('button', { name: 'Save' }).click();

        // create a new instance
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('FPI');
        await page.getByRole('button', { name: 'Save' }).click();

        // create a new instance
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('Inspection');
        await page.getByRole('button', { name: 'Save' }).click();

        // create a model
        await page.getByRole('link', { name: 'Models' }).click();
        await page.locator('#models_models_secondary_navigation').click();
        await page.getByRole('button', { name: 'New Model' }).click();
        await page.getByRole('textbox').fill('Routing Test');
        await page.locator('.grid > div:nth-child(12)').click();
        await page.getByRole('button', { name: 'Save' }).click();
    })

    test('routing - step dropdown', async ({ page }) => {
        await page.goto('/');

        // create an instance of the model
        await page.getByRole('link', { name: 'Routing Test' }).click();
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('Routing Test Instance 1');
        await page.getByRole('button', { name: 'Save' }).click();

        // open the route builder list view
        await page.locator('#more-button-dropdown-trigger').click();
        await page.getByRole('menuitem', { name: 'Add Route' }).click();
        await page.getByText('From List View').click();

        // create an initial route
        await page.getByRole('button', { name: 'Select a router' }).click();
        await page.getByRole('menuitem', { name: 'Routing Test' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Inspection' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Isopress' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Green Machine' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Green Machine' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Inspection' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();

        // check delete a step
        await page.getByTestId('delete-step-button-2').click();

        // check drag and drop to reorder steps
        // ---- First drag: Move 3rd item to 1st position ----
        const thirdItemHandle = page.getByTestId('drag-handle-2');
        const firstItemDropZone = page.getByTestId('drag-handle-0');

        let thirdHandleBox = await thirdItemHandle.boundingBox();
        if (!thirdHandleBox) throw new Error("Bounding box for 3rd handle not found");

        await thirdItemHandle.hover();
        await page.mouse.down();
        // Small move to activate drag (critical for dnd-kit PointerSensor with activationConstraint)
        await page.mouse.move(thirdHandleBox.x + thirdHandleBox.width / 2 + 5, thirdHandleBox.y + thirdHandleBox.height / 2 + 5, { steps: 5 });
        await page.waitForTimeout(100); // Allow dnd-kit to process drag start

        // Move to the target drop zone (center of the 1st item)
        let firstItemDropZoneBox = await firstItemDropZone.boundingBox();
        if (!firstItemDropZoneBox) throw new Error("Bounding box for 1st drop zone not found");
        await page.mouse.move(firstItemDropZoneBox.x + firstItemDropZoneBox.width / 2, firstItemDropZoneBox.y + firstItemDropZoneBox.height / 2, { steps: 10 });
        await page.waitForTimeout(100); // Allow dnd-kit to process drag over

        await page.mouse.up();
        await page.waitForTimeout(300); // Allow for DOM updates and event processing

        // ---- Second drag: Move (current) 4th item to (current) 5th item's position ----
        // After the first drag, elements have reordered.
        // Original items: [I1, I2, I3, I4, I5]
        // After 3rd to 1st: [I3, I1, I2, I4, I5] (approx.)
        // So, current 4th is original I4. Current 5th is original I5. This targets the correct original items for the swap.
        const fourthItemHandle = page.getByTestId('drag-handle-3');
        const fifthItemDropZone = page.getByTestId('drag-handle-4');

        let fourthHandleBox = await fourthItemHandle.boundingBox();
        if (!fourthHandleBox) throw new Error("Bounding box for 4th handle not found");

        await fourthItemHandle.hover();
        await page.mouse.down();
        await page.mouse.move(fourthHandleBox.x + fourthHandleBox.width / 2 + 5, fourthHandleBox.y + fourthHandleBox.height / 2 + 5, { steps: 5 });
        await page.waitForTimeout(100);

        let fifthItemDropZoneBox = await fifthItemDropZone.boundingBox();
        if (!fifthItemDropZoneBox) throw new Error("Bounding box for 5th drop zone not found");
        await page.mouse.move(fifthItemDropZoneBox.x + fifthItemDropZoneBox.width / 2, fifthItemDropZoneBox.y + fifthItemDropZoneBox.height / 2, { steps: 10 });
        await page.waitForTimeout(100);

        await page.mouse.up();
        await page.waitForTimeout(300); // Allow for DOM updates and event processing

        // save the route
        await page.getByRole('button', { name: 'Save' }).click();

        // check the route is not started
        await expect(page.getByRole('cell', { name: 'NOT STARTED' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Not Started');

        // move the route forwards to green machine
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Start Route' }).click();
        await expect(page.getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // complete green machine step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // move the route forwards to inspection
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Fail inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Redo inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Complete inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Go back to green machine step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'GREEN MACHINE' }).click();
        await expect(page.getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // Complete green machine step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // Go to inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Complete inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // move the route forwards to isopress
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
        await expect(page.getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // Complete isopress step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // move the route forwards to fpi
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await expect(page.getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // Complete fpi step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // move the route forwards to inspection
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Fail inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // move the route backwards to fpi
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await expect(page.getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // Fail fpi step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // move the route backwards to isopress
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
        await expect(page.getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // pause the route
        await page.getByTestId('step-button-trigger').click();
        await expect(page.getByRole('menu')).toContainText('Pause Route');
        await page.getByRole('menuitem', { name: 'Pause Route' }).click();
        await page.getByTestId('step-button-trigger').click();
        await expect(page.getByRole('menu')).toContainText('Resume Route');
        await expect(page.getByRole('menu')).not.toContainText('Pause Route');
        await expect(page.getByRole('menuitem', { name: 'Complete Step' })).toBeDisabled()
        await expect(page.getByRole('menuitem', { name: 'Fail Step' })).toBeDisabled()

        // resume the route
        await page.getByRole('menuitem', { name: 'Resume Route' }).click();
        await page.getByTestId('step-button-trigger').click();
        await expect(page.getByRole('menu')).toContainText('Pause Route');
        await expect(page.getByRole('menu')).not.toContainText('Resume Route');

        // Fail isopress step
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // go to the next step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await expect(page.getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // stop the route
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Stop Route' }).click();
        await page.getByRole('button', { name: 'Stop Route' }).click();
        await expect(page.getByRole('cell', { name: 'NOT STARTED' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Not Started');

        // complete the route
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Start Route' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'GREEN MACHINE' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'DONE' }).click();

        // check the route is complete
        await expect(page.getByRole('cell', { name: 'DONE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Done');
    });

    test('routing - routing table page', async ({ page }) => {
        await page.goto('/');

        // create an instance of the model
        await page.getByRole('link', { name: 'Routing Test' }).click();
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('Routing Test Instance 2');
        await page.getByRole('button', { name: 'Save' }).click();

        // open the route builder list view
        await page.locator('#more-button-dropdown-trigger').click();
        await page.getByRole('menuitem', { name: 'Add Route' }).click();
        await page.getByText('From List View').click();

        // create an initial route
        await page.getByRole('button', { name: 'Select a router' }).click();
        await page.getByRole('menuitem', { name: 'Routing Test' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Add Step' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Inspection' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Isopress' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Green Machine' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Green Machine' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).first().click();
        await page.getByRole('menuitem', { name: 'Inspection' }).click();
        await page.getByRole('button', { name: 'Select an instance' }).click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();

        // check delete a step
        await page.getByTestId('delete-step-button-2').click();

        // check drag and drop to reorder steps
        // ---- First drag: Move 3rd item to 1st position ----
        const thirdItemHandle = page.getByTestId('drag-handle-2');
        const firstItemDropZone = page.getByTestId('drag-handle-0');

        let thirdHandleBox = await thirdItemHandle.boundingBox();
        if (!thirdHandleBox) throw new Error("Bounding box for 3rd handle not found");

        await thirdItemHandle.hover();
        await page.mouse.down();
        // Small move to activate drag (critical for dnd-kit PointerSensor with activationConstraint)
        await page.mouse.move(thirdHandleBox.x + thirdHandleBox.width / 2 + 5, thirdHandleBox.y + thirdHandleBox.height / 2 + 5, { steps: 5 });
        await page.waitForTimeout(100); // Allow dnd-kit to process drag start

        // Move to the target drop zone (center of the 1st item)
        let firstItemDropZoneBox = await firstItemDropZone.boundingBox();
        if (!firstItemDropZoneBox) throw new Error("Bounding box for 1st drop zone not found");
        await page.mouse.move(firstItemDropZoneBox.x + firstItemDropZoneBox.width / 2, firstItemDropZoneBox.y + firstItemDropZoneBox.height / 2, { steps: 10 });
        await page.waitForTimeout(100); // Allow dnd-kit to process drag over

        await page.mouse.up();
        await page.waitForTimeout(300); // Allow for DOM updates and event processing

        // ---- Second drag: Move (current) 4th item to (current) 5th item's position ----
        // After the first drag, elements have reordered.
        // Original items: [I1, I2, I3, I4, I5]
        // After 3rd to 1st: [I3, I1, I2, I4, I5] (approx.)
        // So, current 4th is original I4. Current 5th is original I5. This targets the correct original items for the swap.
        const fourthItemHandle = page.getByTestId('drag-handle-3');
        const fifthItemDropZone = page.getByTestId('drag-handle-4');

        let fourthHandleBox = await fourthItemHandle.boundingBox();
        if (!fourthHandleBox) throw new Error("Bounding box for 4th handle not found");

        await fourthItemHandle.hover();
        await page.mouse.down();
        await page.mouse.move(fourthHandleBox.x + fourthHandleBox.width / 2 + 5, fourthHandleBox.y + fourthHandleBox.height / 2 + 5, { steps: 5 });
        await page.waitForTimeout(100);

        let fifthItemDropZoneBox = await fifthItemDropZone.boundingBox();
        if (!fifthItemDropZoneBox) throw new Error("Bounding box for 5th drop zone not found");
        await page.mouse.move(fifthItemDropZoneBox.x + fifthItemDropZoneBox.width / 2, fifthItemDropZoneBox.y + fifthItemDropZoneBox.height / 2, { steps: 10 });
        await page.waitForTimeout(100);

        await page.mouse.up();
        await page.waitForTimeout(300); // Allow for DOM updates and event processing

        // save the route
        await page.getByRole('button', { name: 'Save' }).click();

        // navigate to the routing table
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'View Route' }).click();

        // check the table header has not started
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['in-progress-pulse']);

        // check the table footer has done
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);

        // check the route steps in the table are in the correct order
        let tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['not-started-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['not-started-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['not-started-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // start the route
        await page.getByLabel('Start Route').click();

        // confirm the routing page is at green machine
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['in-progress-pulse']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['not-started-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['not-started-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // complete the green machine step
        await page.getByLabel('Complete Step').click();

        // confirm the routing page is successfully idle at green machine
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-idle-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['not-started-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['not-started-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // move to the next step: inspection
        await page.getByLabel('Start Next Step').click();

        // confirm the routing page is at inspection
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['in-progress-pulse']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['not-started-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // complete the inspection step
        await page.getByLabel('Complete Step').click();

        // confirm the routing page is successfully idle at inspection
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-idle-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['not-started-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // move to the next step: isopress
        await page.getByLabel('Start Next Step').click();

        // confirm the routing page is at isopress
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['in-progress-pulse']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // complete the isopress step
        await page.getByLabel('Complete Step').click();

        // confirm the routing page is successfully idle at isopress
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-idle-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // move to the next step: fpi
        await page.getByLabel('Start Next Step').click();

        // confirm the routing page is at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['in-progress-pulse']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // pause the route
        await page.getByLabel('Pause Route').click();

        // confirm the routing page is paused at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['paused-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // confirm the paused warning banner is visible
        await expect(page.getByTestId('paused-warning-banner')).toBeVisible();

        // resume the route
        await page.getByLabel('Resume Route').click();

        // confirm the paused warning banner is not visible
        await expect(page.getByTestId('paused-warning-banner')).not.toBeVisible();

        // complete the fpi step
        await page.getByLabel('Complete Step').click();

        // confirm the routing page is successfully idle at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['completed-idle-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // move to the next step: inspection
        await page.getByLabel('Start Next Step').click();

        // confirm the routing page is at inspection
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['completed-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['in-progress-pulse']);

        // fail the inspection step
        await page.getByLabel('Fail Step').click();

        // confirm the routing page is failed idle at inspection
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['completed-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['failed-idle-icon']);

        // move to the previous step: fpi
        await page.getByLabel('Start Previous Step').click();

        // confirm the routing page is in progress at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['in-progress-pulse']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['failed-icon']);

        // fail the fpi step
        await page.getByLabel('Fail Step').click();

        // confirm the routing page is failed idle at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['failed-idle-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['failed-icon']);

        // redo the fpi step
        await page.getByLabel('Redo Step').click();

        // confirm the routing page is in progress at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['in-progress-pulse']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['failed-icon']);

        // complete the fpi step
        await page.getByLabel('Complete Step').click();

        // confirm the routing page is successfully idle at fpi
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['completed-idle-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['failed-icon']);

        // move to the next step: inspection
        await page.getByLabel('Start Next Step').click();

        // confirm the routing page is at inspection
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['completed-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['in-progress-pulse']);

        // stop the route
        await page.getByLabel('Stop Route').click();
        await page.getByRole('button', { name: 'Stop Route' }).click();

        // confirm the routing page is at not started
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['in-progress-pulse']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['not-started-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['not-started-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['not-started-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['not-started-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['not-started-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['not-started-icon']);

        // complete the route
        await page.getByLabel('Start Route').click();
        // complete the green machine step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        // complete the inspection step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        // complete the isopress step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        // complete the fpi step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        // complete the inspection step
        await page.getByLabel('Complete Step').click();
        // complete the route
        await page.getByLabel('Complete Route').click();

        // confirm the routing page is at done
        await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
        await checkRoutingTableIcons(page.getByTestId('route-table-header-row'), ['completed-icon']);
        await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
        await checkRoutingTableIcons(page.getByTestId('route-table-footer-row'), ['completed-icon']);
        tableRows = await page.getByTestId('route-table-row').all();
        expect(tableRows[0]).toContainText('GREEN MACHINE');
        await checkRoutingTableIcons(tableRows[0], ['completed-icon']);
        expect(tableRows[1]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[1], ['completed-icon']);
        expect(tableRows[2]).toContainText('ISOPRESS');
        await checkRoutingTableIcons(tableRows[2], ['completed-icon']);
        expect(tableRows[3]).toContainText('FPI');
        await checkRoutingTableIcons(tableRows[3], ['completed-icon']);
        expect(tableRows[4]).toContainText('INSPECTION');
        await checkRoutingTableIcons(tableRows[4], ['completed-icon']);
    });

    test('routing - routing summary page', async ({ page }) => {
        // navigate to routing page to access route fields
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'View Route' }).click();

        // fill out the route field values for this instance at the Green Machine step
        // verify the route fields are visible for editing
        await expect(page.getByText('Text Field Edited')).toBeVisible();
        await expect(page.getByText('Number Field Edited')).toBeVisible();
        await expect(page.getByText('Date Field Edited')).toBeVisible();
        await expect(page.getByText('Time Field Edited')).toBeVisible();
        await expect(page.getByText('Paragraph Field Edited')).toBeVisible();
        await expect(page.getByText('Single Restricted Select Field Edited')).toBeVisible();
        await expect(page.getByText('Single Creative Select Field Edited')).toBeVisible();
        await expect(page.getByText('Multiple Restricted Select Field Edited')).toBeVisible();
        await expect(page.getByText('Multiple Creative Select Field Edited')).toBeVisible();
        await expect(page.getByText('Test Single KV Edited')).toBeVisible();
        await expect(page.getByText('Multiple KV Field Edited')).toBeVisible();

        // fill in and check the text field
        await page.getByLabel('Text Field Edited:').click();
        await page.getByLabel('Text Field Edited:').fill('Edited route text');
        await page.getByLabel('Text Field Edited:').press('Enter');
        await expect(page.getByLabel('Text Field Edited:')).toHaveValue('Edited route text');

        // fill in and check the number field
        await page.getByLabel('Number Field Edited:').click();
        await page.getByLabel('Number Field Edited:').fill('35');
        await page.getByLabel('Number Field Edited:').press('Enter');
        await expect(page.getByLabel('Number Field Edited:')).toHaveValue('35');

        // fill in and check the date field
        await page.getByLabel('Date Field Edited:').click();
        await page.getByLabel('Date Field Edited:').fill('2023-06-20');
        await page.getByLabel('Date Field Edited:').press('Enter');
        await expect(page.getByLabel('Date Field Edited:')).toHaveValue('2023-06-20');

        // fill in and check the time field
        await page.getByLabel('Time Field Edited:').click();
        await page.getByLabel('Time Field Edited:').fill('16:45');
        await page.getByLabel('Time Field Edited:').press('Enter');
        await expect(page.getByLabel('Time Field Edited:')).toHaveValue('16:45');

        // fill in and check the paragraph field
        await page.getByLabel('Paragraph Field Edited:').click();
        await page.getByLabel('Paragraph Field Edited:').fill('Edited route paragraph');
        await page.getByLabel('Save field Paragraph Field').click();
        await expect(page.getByLabel('Paragraph Field Edited:')).toHaveValue('Edited route paragraph');

        // fill in and check the single restricted select field
        await page.getByLabel('Single Restricted Select Field Edited:').click();
        await page.getByLabel('Single Restricted Select Field Edited:').fill('Opt');
        await page.getByRole('option', { name: 'Option 5' }).click();
        await page.getByLabel('Save field Single Restricted').click();
        await expect(page.getByLabel('Single Restricted Select Field Edited:')).toHaveValue('Option 5');

        // fill in and check the single creative select field
        await page.getByLabel('Single Creative Select Field Edited:').click();
        await page.getByLabel('Single Creative Select Field Edited:').fill('Custom Single Option');
        await page.getByLabel('Save field Single Creative').click();
        await expect(page.getByLabel('Single Creative Select Field Edited:')).toHaveValue('Custom Single Option');

        // fill in and check the multiple restricted select field
        await page.getByLabel('Multiple Restricted Select Field Edited:').click();
        await page.getByRole('option', { name: 'Option 10' }).click();
        await page.getByLabel('Multiple Restricted Select Field Edited:').click();
        await page.getByRole('option', { name: 'Option 11' }).click();
        await page.getByLabel('Save field Multiple').click();
        await expect(page.getByLabel('Basic Edited')).toContainText('Option 10Option 11');

        // fill in and check the multiple creative select field
        await page.getByLabel('Multiple Creative Select Field Edited:').click();
        await page.getByRole('option', { name: 'Option 13' }).click();
        await page.getByLabel('Multiple Creative Select Field Edited:').click();
        await page.getByLabel('Multiple Creative Select Field Edited:').fill('Custom Option 2');
        await page.getByLabel('Multiple Creative Select Field Edited:').press('Enter');
        await page.getByLabel('Save field Multiple Creative').click();
        await expect(page.getByLabel('Basic Edited')).toContainText('Option 13Custom Option 2');

        // fill in and check the single kv field
        await page.getByTestId('kv-field-Test Single KV Edited').getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel('SIN_004').click();
        await page.getByTestId('kv-line-value-input-SIN_004-0').click();
        await page.getByTestId('kv-line-value-input-SIN_004-0').fill('200');
        await expect(page.getByTestId('kv-line-key-select-trigger-SIN_004-0')).toContainText('SIN_004');
        await expect(page.getByTestId('kv-line-value-input-SIN_004-0')).toHaveValue('200');
        await page.getByTestId('delete-kv-line-button-SIN_004-0').click();
        await expect(page.getByTestId('kv-field-Test Single KV Edited').getByTestId('kv-line-key-select-trigger--0')).toContainText('Select a key');
        await expect(page.getByTestId('kv-field-Test Single KV Edited').getByTestId('kv-line-value-placeholder--0')).toContainText('Select a key to enter value');
        await page.getByTestId('kv-field-Test Single KV Edited').getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel('SIN_005').click();
        await page.getByTestId('kv-line-value-input-SIN_005-0').click();
        await page.getByTestId('kv-line-value-input-SIN_005-0').fill('300');
        await page.getByLabel('Save field Test Single KV').click();

        // fill in and check the multiple kv field
        await page.getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel('MUL_005').click();
        await page.getByTestId('kv-line-value-input-MUL_005-0').click();
        await page.getByTestId('kv-line-value-input-MUL_005-0').fill('500');
        await page.getByLabel('Add new key-value pair').click();
        await page.getByTestId('kv-line-key-select-trigger--1').click();
        await page.getByLabel('MUL_007').click();
        await page.getByTestId('kv-line-value-input-MUL_007-1').click();
        await page.getByTestId('kv-line-value-input-MUL_007-1').fill('900');
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_005-0')).toContainText('MUL_005');
        await expect(page.getByTestId('kv-line-value-input-MUL_005-0')).toHaveValue('500');
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_007-1')).toContainText('MUL_007');
        await expect(page.getByTestId('kv-line-value-input-MUL_007-1')).toHaveValue('900');
        await expect(page.getByLabel('Add new key-value pair')).toBeVisible();
        await page.getByTestId('delete-kv-line-button-MUL_005-0').click();
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_007-0')).toContainText('MUL_007');
        await expect(page.getByTestId('kv-line-value-input-MUL_007-0')).toHaveValue('900');
        await page.getByTestId('delete-kv-line-button-MUL_007-0').click();
        await expect(page.getByTestId('kv-line-key-select-trigger--0')).toContainText('Select a key');
        await expect(page.getByTestId('kv-line-value-placeholder--0')).toContainText('Select a key to enter value');
        await page.getByLabel('Add new key-value pair').click();
        await page.getByLabel('Add new key-value pair').click();
        await page.getByLabel('Add new key-value pair').click();
        await page.getByTestId('delete-kv-line-button--3').click();
        await page.getByTestId('delete-kv-line-button--2').click();
        await page.getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel('MUL_006').click();
        await page.getByTestId('kv-line-value-input-MUL_006-0').click();
        await page.getByTestId('kv-line-value-input-MUL_006-0').fill('1000');
        await page.getByTestId('kv-line-key-select-trigger--1').click();
        await page.getByLabel('MUL_008').click();
        await page.getByTestId('kv-line-value-input-MUL_008-1').click();
        await page.getByTestId('kv-line-value-input-MUL_008-1').fill('2000');
        await page.getByLabel('Save field Multiple KV').click();

        // verify all edited values persist after another reload
        await page.reload();
        await expect(page.getByLabel('Text Field Edited:')).toHaveValue('Edited route text');
        await expect(page.getByLabel('Number Field Edited:')).toHaveValue('35');
        await expect(page.getByLabel('Date Field Edited:')).toHaveValue('2023-06-20');
        await expect(page.getByLabel('Time Field Edited:')).toHaveValue('16:45');
        await expect(page.getByLabel('Paragraph Field Edited:')).toHaveValue('Edited route paragraph');
        await expect(page.getByLabel('Single Restricted Select Field Edited:')).toHaveValue('Option 5');
        await expect(page.getByLabel('Single Creative Select Field Edited:')).toHaveValue('Custom Single Option');
        await expect(page.getByLabel('Basic Edited')).toContainText('Option 10Option 11');
        await expect(page.getByLabel('Basic Edited')).toContainText('Option 13Custom Option 2');
        await expect(page.getByTestId('kv-line-key-select-trigger-SIN_005-0')).toContainText('SIN_005');
        await expect(page.getByTestId('kv-line-value-input-SIN_005-0')).toHaveValue('300');
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_006-0')).toContainText('MUL_006');
        await expect(page.getByTestId('kv-line-value-input-MUL_006-0')).toHaveValue('1000');
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_008-1')).toContainText('MUL_008');
        await expect(page.getByTestId('kv-line-value-input-MUL_008-1')).toHaveValue('2000');

        // verify all route field values are still there after progressing through other steps
        await expect(page.getByLabel('Text Field Edited:')).toHaveValue('Edited route text');
        await expect(page.getByLabel('Number Field Edited:')).toHaveValue('35');
        await expect(page.getByLabel('Date Field Edited:')).toHaveValue('2023-06-20');
        await expect(page.getByLabel('Time Field Edited:')).toHaveValue('16:45');
        await expect(page.getByLabel('Paragraph Field Edited:')).toHaveValue('Edited route paragraph');
        await expect(page.getByLabel('Single Restricted Select Field Edited:')).toHaveValue('Option 5');
        await expect(page.getByLabel('Single Creative Select Field Edited:')).toHaveValue('Custom Single Option');
        await expect(page.getByLabel('Basic Edited')).toContainText('Option 10Option 11');
        await expect(page.getByLabel('Basic Edited')).toContainText('Option 13Custom Option 2');
        await expect(page.getByTestId('kv-line-key-select-trigger-SIN_005-0')).toContainText('SIN_005');
        await expect(page.getByTestId('kv-line-value-input-SIN_005-0')).toHaveValue('300');
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_006-0')).toContainText('MUL_006');
        await expect(page.getByTestId('kv-line-value-input-MUL_006-0')).toHaveValue('1000');
        await expect(page.getByTestId('kv-line-key-select-trigger-MUL_008-1')).toContainText('MUL_008');
        await expect(page.getByTestId('kv-line-value-input-MUL_008-1')).toHaveValue('2000');
    });
});