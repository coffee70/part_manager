import { test as setup, expect } from '@playwright/test';

setup('routing setup', async ({ page }) => {
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