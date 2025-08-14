import { test, expect } from '@playwright/test';
import { modelFormColor, modelsAdminPageNavigation, routerFormColor, routersAdminPageNavigation, routersPrimaryNavigation } from './lib';

const restrictedOptions = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
];

const creativeOptions = [
    'Option 100',
    'Option 200',
    'Option 300',
    'Option 400',
    'Option 500',
];

const singleKVKeys = [
    'SIN_004',
    'SIN_005',
    'SIN_006',
];

const multipleKVKeys = [
    'MUL_001',
    'MUL_002',
    'MUL_003',
    'MUL_004',
    'MUL_005',
    'MUL_006',
    'MUL_007',
    'MUL_008',
    'MUL_009',
    'MUL_010',
];

const instances = [
    {
        number: 'S-100',
        priority: 'Low',
        notes: 'Some notes on something',
        textField: 'Some text',
        numberField: '10',
        dateField: '2022-10-12',
        timeField: '10:10',
        paragraphField: 'Some paragraph',
        singleRestrictedSelectField: restrictedOptions[0],
        singleCreativeSelectField: creativeOptions[0],
        multipleRestrictedSelectField: [restrictedOptions[1], restrictedOptions[2]],
        multipleCreativeSelectField: {
            restrictedOptions: [restrictedOptions[2]],
            creativeOptions: [creativeOptions[1]]
        },
        testSingleKV: {
            key: singleKVKeys[0],
            value: '200'
        },
        multipleKV: [
            {
                key: multipleKVKeys[0],
                value: '500'
            },
            {
                key: multipleKVKeys[1],
                value: '900'
            }
        ]
    },
    {
        number: 'S-101',
        priority: 'Medium',
        notes: 'Some notes on something else',
        textField: 'Some other text',
        numberField: '11',
        dateField: '2022-10-13',
        timeField: '11:11',
        paragraphField: 'Some other paragraph',
        singleRestrictedSelectField: restrictedOptions[1],
        singleCreativeSelectField: creativeOptions[1],
        multipleRestrictedSelectField: [restrictedOptions[2], restrictedOptions[3]],
        multipleCreativeSelectField: {
            restrictedOptions: [restrictedOptions[3]],
            creativeOptions: [creativeOptions[2]]
        },
        testSingleKV: {
            key: singleKVKeys[1],
            value: '300'
        },
        multipleKV: [
            {
                key: multipleKVKeys[2],
                value: '600'
            },
            {
                key: multipleKVKeys[3],
                value: '1000'
            }
        ]
    },
    {
        number: 'S-102',
        priority: 'High',
        notes: 'Some notes on something else',
        textField: 'Some other text',
        numberField: '12',
        dateField: '2022-10-14',
        timeField: '12:12',
        paragraphField: 'Some other paragraph',
        singleRestrictedSelectField: restrictedOptions[2],
        singleCreativeSelectField: creativeOptions[2],
        multipleRestrictedSelectField: [restrictedOptions[3], restrictedOptions[4]],
        multipleCreativeSelectField: {
            restrictedOptions: [restrictedOptions[4]],
            creativeOptions: [creativeOptions[3]]
        },
        testSingleKV: {
            key: singleKVKeys[2],
            value: '400'
        },
        multipleKV: [
            {
                key: multipleKVKeys[4],
                value: '1200'
            },
            {
                key: multipleKVKeys[5],
                value: '1400'
            }
        ]
    }
];

test("test model table configuration", async ({ page }) => {
    await page.goto('/');
    await modelsAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Model' }).click();
    await page.getByRole('textbox').fill('Table Configuration Test');
    await page.getByLabel('Create Model').getByText('Attachments', { exact: true }).click();
    await page.getByLabel('Create Model').getByText('Links').click();
    await page.getByLabel('Create Model').getByText('Comments').click();
    await page.getByLabel('Create Model').getByText('Priority', { exact: true }).click();
    await modelFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create fields
    await page.getByRole('link', { name: 'Fields', exact: true }).click();
    await page.locator('#model-select').click();
    await page.getByRole('menuitem', { name: 'Table Configuration Test' }).click();
    await expect(page.getByRole('heading', { name: 'Table Configuration Test' })).toBeVisible();
    await page.getByRole('button', { name: 'New Section' }).click();
    await page.getByLabel('Section Name').fill('Basic');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.getByPlaceholder('Enter the field name').fill('Text Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Text field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Number$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Number Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Number field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Date$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Date Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Date field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Time$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Time Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Time field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Paragraph$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Paragraph Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Paragraph field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Single Restricted Select Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Single restricted select field description');
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Single Creative Select Field');
    await page.getByPlaceholder('Enter the field name').press('Tab');
    await page.getByPlaceholder('Enter the field description').fill('Single creative select field description');
    await page.locator('div').filter({ hasText: /^Creative$/ }).click();
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Multiple Restricted Select Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Multiple restricted select field description');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Multiple Creative Select Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Multiple creative select field description');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
    await page.locator('div').filter({ hasText: /^Creative$/ }).click();
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Key Value$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Test Single KV');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Test single kv');
    await page.getByPlaceholder('Type a key and press Enter...').click();
    for (const key of singleKVKeys) {
        await page.getByPlaceholder('Type a key and press Enter...').fill(key);
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Key Value$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Multiple KV Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Multiple kv field');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
    await page.getByPlaceholder('Type a key and press Enter...').click();
    for (const key of multipleKVKeys) {
        await page.getByPlaceholder('Type a key and press Enter...').fill(key);
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();

    // create multiple instances of Table Configuration Test with different values
    await page.getByRole('link', { name: 'Table Configuration Test' }).click();
    await expect(page.getByRole('heading', { name: 'Fields' })).not.toBeVisible();
    for (const instance of instances) {
        await page.getByRole('button').nth(1).click();
        await page.getByLabel('Number', { exact: true }).fill(instance.number);
        await page.getByLabel('Priority').click();
        await page.getByLabel('Priority').fill('');
        await page.getByRole('option', { name: instance.priority, exact: true }).click();
        await page.getByLabel('Notes').click();
        await page.getByLabel('Notes').fill(instance.notes);
        await page.getByLabel('Text Field', { exact: true }).click();
        await page.getByLabel('Text Field', { exact: true }).fill('Some text');
        await page.getByLabel("Number Field", { exact: true }).click();
        await page.getByLabel("Number Field", { exact: true }).fill(instance.numberField);
        await page.getByLabel("Date Field", { exact: true }).fill(instance.dateField);
        await page.getByLabel("Time Field", { exact: true }).click();
        await page.getByLabel("Time Field", { exact: true }).fill(instance.timeField);
        await page.getByLabel("Paragraph Field", { exact: true }).click();
        await page.getByLabel("Paragraph Field", { exact: true }).fill(instance.paragraphField);
        await page.getByLabel("Single Restricted Select Field", { exact: true }).click();
        await page.getByRole('option', { name: instance.singleRestrictedSelectField, exact: true }).click();
        await page.getByLabel("Single Creative Select Field", { exact: true }).fill(instance.singleCreativeSelectField);
        await page.getByLabel("Single Creative Select Field", { exact: true }).press('Enter');
        for (const option of instance.multipleRestrictedSelectField) {
            await page.getByLabel("Multiple Restricted Select Field", { exact: true }).click();
            await page.getByRole('option', { name: option, exact: true }).click();
        }
        for (const option of instance.multipleCreativeSelectField.restrictedOptions) {
            await page.getByLabel("Multiple Creative Select Field", { exact: true }).click();
            await page.getByRole('option', { name: option, exact: true }).click();
        }
        for (const option of instance.multipleCreativeSelectField.creativeOptions) {
            await page.getByLabel("Multiple Creative Select Field", { exact: true }).fill(option);
            await page.getByLabel("Multiple Creative Select Field", { exact: true }).press('Enter');
        }
        await page.getByTestId('kv-field-Test Single KV').getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel(instance.testSingleKV.key).click();
        await page.getByTestId(`kv-line-value-input-${instance.testSingleKV.key}-0`).click();
        await page.getByTestId(`kv-line-value-input-${instance.testSingleKV.key}-0`).fill(instance.testSingleKV.value);
        await page.getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel(instance.multipleKV[0].key).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[0].key}-0`).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[0].key}-0`).fill(instance.multipleKV[0].value);
        await page.getByRole('button', { name: 'Add new key-value pair' }).click();
        await page.getByTestId('kv-line-key-select-trigger--1').click();
        await page.getByLabel(instance.multipleKV[1].key).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[1].key}-1`).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[1].key}-1`).fill(instance.multipleKV[1].value);
        await page.getByRole('button', { name: 'Save' }).click();
    }

    // create a model for links
    await modelsAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Model' }).click();
    await page.getByRole('textbox').fill('Table Configuration Links');
    await page.getByLabel('Create Model').getByText('Links').click();
    await modelFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create two instances of Table Configuration Links
    await page.getByRole('link', { name: 'Table Configuration Links' }).click();
    await page.getByRole('button').nth(1).click();
    await page.getByLabel('Number', { exact: true }).fill('L-100');
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').fill('Notes');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('summary-number-input')).toHaveValue('L-100');
    await page.getByRole('button').nth(1).click();
    await page.getByLabel('Number', { exact: true }).fill('L-101');
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').fill('Notes');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('summary-number-input')).toHaveValue('L-101');


    // check initial table configuration
    await page.getByRole('link', { name: 'Table Configuration Test' }).click();
    await expect(page.getByTestId('summary-number-input')).toHaveValue('S-100');
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - table:
          - rowgroup:
            - row "Number Step Updated By":
              - cell:
                - button
              - cell "Number":
                - img
                - button
              - cell "Step":
                - img
                - button
              - cell "Updated By":
                - img
                - button
              - cell
          - rowgroup:
            - row /S-100 Today by Test Admin/:
              - cell
              - cell /S-100/
              - cell
              - cell "Today by Test Admin"
              - cell:
                - button
            - row /S-101 Today by Test Admin/:
              - cell
              - cell /S-101/
              - cell
              - cell "Today by Test Admin"
              - cell:
                - button
            - row /S-102 Today by Test Admin/:
              - cell
              - cell /S-102/
              - cell
              - cell "Today by Test Admin"
              - cell:
                - button
        `);

    // test drag and drop
    await page.getByTestId('table-configuration-trigger').click();
    await page.getByRole('button', { name: 'Time Field Time field' }).click();
    await page.getByTestId('table-configuration-sortable-column-item-remove-button').nth(1).click();
    await page.getByRole('button', { name: 'Multiple Restricted Select' }).click();

    // test horizontal drag and drop - move 4th item to 2nd position
    const fourthItemHandle = page.getByTestId('table-configuration-sortable-column-item-drag-handle').nth(3);
    const secondItemDropZone = page.getByTestId('table-configuration-sortable-column-item-drag-handle').nth(1);

    let fourthHandleBox = await fourthItemHandle.boundingBox();
    if (!fourthHandleBox) throw new Error("Bounding box for 4th handle not found");

    await fourthItemHandle.hover();
    await page.mouse.down();
    // Small move to activate drag (critical for dnd-kit PointerSensor with activationConstraint)
    await page.mouse.move(fourthHandleBox.x + fourthHandleBox.width / 2 + 5, fourthHandleBox.y + fourthHandleBox.height / 2, { steps: 5 });
    await page.waitForTimeout(100); // Allow dnd-kit to process drag start

    // Move to the target drop zone (center of the 2nd item) - horizontal movement
    let secondItemDropZoneBox = await secondItemDropZone.boundingBox();
    if (!secondItemDropZoneBox) throw new Error("Bounding box for 2nd drop zone not found");
    await page.mouse.move(secondItemDropZoneBox.x + secondItemDropZoneBox.width / 2, secondItemDropZoneBox.y + secondItemDropZoneBox.height / 2, { steps: 10 });
    await page.waitForTimeout(100); // Allow dnd-kit to process drag over

    await page.mouse.up();
    await page.waitForTimeout(300); // Allow for DOM updates and event processing

    // test horizontal drag and drop - move 1st item to 3rd position  
    const firstItemHandle = page.getByTestId('table-configuration-sortable-column-item-drag-handle').nth(0);
    const thirdItemDropZone = page.getByTestId('table-configuration-sortable-column-item-drag-handle').nth(2);

    let firstHandleBox = await firstItemHandle.boundingBox();
    if (!firstHandleBox) throw new Error("Bounding box for 1st handle not found");

    await firstItemHandle.hover();
    await page.mouse.down();
    await page.mouse.move(firstHandleBox.x + firstHandleBox.width / 2 + 5, firstHandleBox.y + firstHandleBox.height / 2, { steps: 5 });
    await page.waitForTimeout(100);

    let thirdItemDropZoneBox = await thirdItemDropZone.boundingBox();
    if (!thirdItemDropZoneBox) throw new Error("Bounding box for 3rd drop zone not found");
    await page.mouse.move(thirdItemDropZoneBox.x + thirdItemDropZoneBox.width / 2, thirdItemDropZoneBox.y + thirdItemDropZoneBox.height / 2, { steps: 10 });
    await page.waitForTimeout(100);

    await page.mouse.up();
    await page.waitForTimeout(300);

    await page.getByRole('button', { name: 'Save Configuration' }).click();

    // check the updated table configuration
    await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - table:
          - rowgroup:
            - row "Multiple Restricted Select Field Updated By Number Time Field":
              - cell:
                - button
              - cell "Multiple Restricted Select Field":
                - img
                - button
              - cell "Updated By":
                - img
                - button
              - cell "Number":
                - img
                - button
              - cell "Time Field":
                - img
                - button
              - cell
          - rowgroup:
            - row /Option 2 Option 3 Today by Test Admin S-100 10:10 AM/:
              - cell
              - cell "Option 2 Option 3"
              - cell "Today by Test Admin"
              - cell /S-100/
              - cell /10:10 AM/
              - cell:
                - button
            - row /Option 3 Option 4 Today by Test Admin S-101 11:11 AM/:
              - cell
              - cell "Option 3 Option 4"
              - cell "Today by Test Admin"
              - cell /S-101/
              - cell /11:11 AM/
              - cell:
                - button
            - row /Option 4 Option 5 Today by Test Admin S-102 12:12 PM/:
              - cell
              - cell "Option 4 Option 5"
              - cell "Today by Test Admin"
              - cell /S-102/
              - cell /12:12 PM/
              - cell:
                - button
        `);

    // test number system column filter
    await page.getByTestId('number-filter-trigger').click();
    // Fill the input and wait for the filter to apply (URL to update and table to filter)
    const input = page.getByPlaceholder('Filter by instance number...');
    await input.fill('S-100');
    // Wait for the table to update: only the filtered row should be present
    await page.waitForURL(url => url.searchParams.get('number') === 'S-100');
    await expect(page.getByTestId('summary-number-input')).toHaveValue('S-100');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('row', { name: /Option 2 Option 3 Today by Test Admin S-100 10:10 AM/ })).toBeVisible();
    // Ensure the other rows are not present
    await expect(page.getByRole('row', { name: /Option 3 Option 4 Today by Test Admin S-101 11:11 AM/ })).not.toBeVisible();
    await expect(page.getByRole('row', { name: /Option 4 Option 5 Today by Test Admin S-102 12:12 PM/ })).not.toBeVisible();
    // Now clear the filter
    await page.getByTestId('number-filter-trigger').click();
    // Wait for the clear button to be visible and click it
    await expect(page.getByRole('button')).toBeVisible();
    await page.getByRole('button').click();
    // wait for url to not contain number
    await page.waitForURL(url => !url.searchParams.get('number'));
    await page.keyboard.press('Escape');
    // Wait for the table to return to its unfiltered state (all rows visible)
    await expect(page.getByRole('row', { name: /Option 3 Option 4 Today by Test Admin S-101 11:11 AM/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Option 4 Option 5 Today by Test Admin S-102 12:12 PM/ })).toBeVisible();

    // filter updated by
    await page.getByTestId('updated-at-filter-trigger').click();
    // Select a date range that does not include today, to avoid test flakiness.
    // We'll pick two days in the past, e.g., 3 and 5 days ago.
    const today = new Date();
    const day3 = new Date(today);
    day3.setDate(today.getDate() - 3);
    const day5 = new Date(today);
    day5.setDate(today.getDate() - 5);
    // Format as day of month (assuming the gridcell names are day numbers)
    const day3Num = day3.getDate().toString();
    const day5Num = day5.getDate().toString();
    await page.getByRole('gridcell', { name: day5Num, exact: true }).click();
    // wait for url to contain updatedAt - from day 5
    await page.waitForURL(url => {
        const updatedAtRaw = url.searchParams.get('updatedAt');
        if (!updatedAtRaw) return false;
        try {
            const { from } = JSON.parse(updatedAtRaw);
            const fromYMD = new Date(from).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const day5YMD = day5.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            return fromYMD === day5YMD;
        } catch (e) {
            return false;
        }
    });
    await page.getByRole('gridcell', { name: day3Num, exact: true }).click();
    // wait for url to contain updatedAt - from today - 3 days ago to today - 5 days ago
    await page.waitForURL(url => {
        const updatedAtRaw = url.searchParams.get('updatedAt');
        if (!updatedAtRaw) return false;
        try {
            const { from, to } = JSON.parse(updatedAtRaw);
            const fromYMD = new Date(from).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const toYMD = new Date(to).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const day3YMD = day3.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const day5YMD = day5.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
            return fromYMD === day5YMD && toYMD === day3YMD;
        } catch (e) {
            return false;
        }
    });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('row', { name: /Option 2 Option 3 Today by Test Admin S-100 10:10 AM/ })).not.toBeVisible();
    await expect(page.getByRole('row', { name: /Option 3 Option 4 Today by Test Admin S-101 11:11 AM/ })).not.toBeVisible();
    await expect(page.getByRole('row', { name: /Option 4 Option 5 Today by Test Admin S-102 12:12 PM/ })).not.toBeVisible();
    await page.getByTestId('updated-at-filter-trigger').click();
    await page.getByRole('gridcell', { name: day5Num, exact: true }).click();
    // wait for url to not contain updatedAt
    await page.waitForURL(url => {
        const updatedAtRaw = url.searchParams.get('updatedAt');
        return !updatedAtRaw;
    });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('row', { name: /Option 2 Option 3 Today by Test Admin S-100 10:10 AM/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Option 3 Option 4 Today by Test Admin S-101 11:11 AM/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Option 4 Option 5 Today by Test Admin S-102 12:12 PM/ })).toBeVisible();

    // add text field to the table configuration
    await page.getByTestId('table-configuration-trigger').click();
    await page.getByTestId('table-configuration-sortable-column-item-remove-button').first().click();
    await page.getByTestId('table-configuration-sortable-column-item-remove-button').nth(2).click();
    await page.getByRole('button', { name: 'Text Field Text field' }).click();
    await page.getByRole('button', { name: 'Save Configuration' }).click();

    // filter by text field
});

test("test router table configuration", async ({ page }) => {
    await page.goto('/');
    await routersPrimaryNavigation(page).click();
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible();
    await routersAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Router' }).click();
    await page.getByRole('textbox').fill('Table Configuration Test');
    await page.getByLabel('Create Router').getByText('Attachments', { exact: true }).click();
    await page.getByLabel('Create Router').getByText('Links').click();
    await page.getByLabel('Create Router').getByText('Comments').click();
    await routerFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create fields
    await page.getByRole('link', { name: 'Fields', exact: true }).click();
    await page.locator('#router-select').click();
    await page.getByRole('menuitem', { name: 'Table Configuration Test' }).click();
    await expect(page.getByRole('heading', { name: 'Table Configuration Test' })).toBeVisible();
    await page.getByRole('button', { name: 'New Section' }).click();
    await page.getByLabel('Section Name').fill('Basic');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.getByPlaceholder('Enter the field name').fill('Text Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Text field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Number$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Number Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Number field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Date$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Date Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Date field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Time$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Time Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Time field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Paragraph$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Paragraph Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Paragraph field description');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Single Restricted Select Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Single restricted select field description');
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Single Creative Select Field');
    await page.getByPlaceholder('Enter the field name').press('Tab');
    await page.getByPlaceholder('Enter the field description').fill('Single creative select field description');
    await page.locator('div').filter({ hasText: /^Creative$/ }).click();
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Multiple Restricted Select Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Multiple restricted select field description');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Select$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Multiple Creative Select Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Multiple creative select field description');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
    await page.locator('div').filter({ hasText: /^Creative$/ }).click();
    await page.getByPlaceholder('Type an option and press').click();
    for (const option of restrictedOptions) {
        await page.getByPlaceholder('Type an option and press').fill(option);
        await page.getByPlaceholder('Type an option and press').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Key Value$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Test Single KV');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Test single kv');
    await page.getByPlaceholder('Type a key and press Enter...').click();
    for (const key of singleKVKeys) {
        await page.getByPlaceholder('Type a key and press Enter...').fill(key);
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'New Field' }).click();
    await page.locator('div').filter({ hasText: /^Key Value$/ }).click();
    await page.getByPlaceholder('Enter the field name').click();
    await page.getByPlaceholder('Enter the field name').fill('Multiple KV Field');
    await page.getByPlaceholder('Enter the field description').click();
    await page.getByPlaceholder('Enter the field description').fill('Multiple kv field');
    await page.locator('div').filter({ hasText: /^Multiple$/ }).click();
    await page.getByPlaceholder('Type a key and press Enter...').click();
    for (const key of multipleKVKeys) {
        await page.getByPlaceholder('Type a key and press Enter...').fill(key);
        await page.getByPlaceholder('Type a key and press Enter...').press('Enter');
    }
    await page.getByRole('button', { name: 'Save' }).click();

    // create multiple instances of Table Configuration Test with different values
    // routers do not have a priority field
    await page.getByRole('link', { name: 'Table Configuration Test' }).click();
    await expect(page.getByRole('heading', { name: 'Fields' })).not.toBeVisible();
    for (const instance of instances) {
        await page.getByRole('button').nth(1).click();
        await page.getByLabel('Number', { exact: true }).fill(instance.number);
        await page.getByLabel('Notes').click();
        await page.getByLabel('Notes').fill(instance.notes);
        await page.getByLabel('Text Field', { exact: true }).click();
        await page.getByLabel('Text Field', { exact: true }).fill('Some text');
        await page.getByLabel("Number Field", { exact: true }).click();
        await page.getByLabel("Number Field", { exact: true }).fill(instance.numberField);
        await page.getByLabel("Date Field", { exact: true }).fill(instance.dateField);
        await page.getByLabel("Time Field", { exact: true }).click();
        await page.getByLabel("Time Field", { exact: true }).fill(instance.timeField);
        await page.getByLabel("Paragraph Field", { exact: true }).click();
        await page.getByLabel("Paragraph Field", { exact: true }).fill(instance.paragraphField);
        await page.getByLabel("Single Restricted Select Field", { exact: true }).click();
        await page.getByRole('option', { name: instance.singleRestrictedSelectField, exact: true }).click();
        await page.getByLabel("Single Creative Select Field", { exact: true }).fill(instance.singleCreativeSelectField);
        await page.getByLabel("Single Creative Select Field", { exact: true }).press('Enter');
        for (const option of instance.multipleRestrictedSelectField) {
            await page.getByLabel("Multiple Restricted Select Field", { exact: true }).click();
            await page.getByRole('option', { name: option, exact: true }).click();
        }
        for (const option of instance.multipleCreativeSelectField.restrictedOptions) {
            await page.getByLabel("Multiple Creative Select Field", { exact: true }).click();
            await page.getByRole('option', { name: option, exact: true }).click();
        }
        for (const option of instance.multipleCreativeSelectField.creativeOptions) {
            await page.getByLabel("Multiple Creative Select Field", { exact: true }).fill(option);
            await page.getByLabel("Multiple Creative Select Field", { exact: true }).press('Enter');
        }
        await page.getByTestId('kv-field-Test Single KV').getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel(instance.testSingleKV.key).click();
        await page.getByTestId(`kv-line-value-input-${instance.testSingleKV.key}-0`).click();
        await page.getByTestId(`kv-line-value-input-${instance.testSingleKV.key}-0`).fill(instance.testSingleKV.value);
        await page.getByTestId('kv-line-key-select-trigger--0').click();
        await page.getByLabel(instance.multipleKV[0].key).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[0].key}-0`).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[0].key}-0`).fill(instance.multipleKV[0].value);
        await page.getByRole('button', { name: 'Add new key-value pair' }).click();
        await page.getByTestId('kv-line-key-select-trigger--1').click();
        await page.getByLabel(instance.multipleKV[1].key).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[1].key}-1`).click();
        await page.getByTestId(`kv-line-value-input-${instance.multipleKV[1].key}-1`).fill(instance.multipleKV[1].value);
        await page.getByRole('button', { name: 'Save' }).click();
    }

    // create a router for links
    await routersAdminPageNavigation(page).click();
    await page.getByRole('button', { name: 'New Router' }).click();
    await page.getByRole('textbox').fill('Table Configuration Links');
    await page.getByLabel('Create Router').getByText('Links').click();
    await routerFormColor(page, 16).click();
    await page.getByRole('button', { name: 'Save' }).click();

    // create two instances of Table Configuration Links
    await page.getByRole('link', { name: 'Table Configuration Links' }).click();
    await page.getByRole('button').nth(1).click();
    await page.getByLabel('Number', { exact: true }).fill('L-100');
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').fill('Notes');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('summary-number-input')).toHaveValue('L-100');
    await page.getByRole('button').nth(1).click();
    await page.getByLabel('Number', { exact: true }).fill('L-101');
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').fill('Notes');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByTestId('summary-number-input')).toHaveValue('L-101');
});