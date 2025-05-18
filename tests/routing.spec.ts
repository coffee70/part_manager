import { test, expect } from '@playwright/test';

test('routing', async ({ page }) => {
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
    await page.locator('[id="create-instance-Routing\\ Test"]').click();
    await page.getByLabel('Number').fill('Isopress');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.locator('[id="create-instance-Routing\\ Test"]').click();
    await page.getByLabel('Number').fill('FPI');
    await page.getByRole('button', { name: 'Save' }).click();
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

    // create an instance of the model
    await page.getByRole('link', { name: 'Routing Test' }).click();
    await page.locator('[id="create-instance-Routing\\ Test"]').click();
    await page.getByLabel('Number').fill('Routing Test Instance');
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
    await expect(page.getByRole('row')).toContainText('NOT STARTED');
    await expect(page.locator('#step-button')).toContainText('Not Started');

    // view the routing page
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();

    // check the table header has not started
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();

    // check the table footer has done
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();

    // check the route steps in the table are in the correct order
    let tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();

    // navigate back to the instance page
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route forwards to green machine
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'GREEN MACHINE' }).locator('div').first().click();
    await expect(page.getByRole('row')).toContainText('GREEN MACHINE');
    await expect(page.locator('#step-button')).toContainText('Green Machine');

    // confirm the routing page is at green machine
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route forwards to inspection
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
    await expect(page.getByRole('row')).toContainText('INSPECTION');
    await expect(page.locator('#step-button')).toContainText('Inspection');

    // confirm the routing page is at inspection
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route forwards to isopress
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
    await expect(page.getByRole('row')).toContainText('ISOPRESS');
    await expect(page.locator('#step-button')).toContainText('Isopress');

    // confirm the routing page is at isopress
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route forwards to fpi
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'FPI' }).click();
    await expect(page.getByRole('row')).toContainText('FPI');
    await expect(page.locator('#step-button')).toContainText('FPI');

    // confirm the routing page is at fpi
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route forwards to inspection
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
    await expect(page.getByRole('row')).toContainText('INSPECTION');
    await expect(page.locator('#step-button')).toContainText('Inspection');

    // confirm the routing page is at inspection
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route backwards to fpi
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'FPI' }).click();
    await expect(page.getByRole('row')).toContainText('FPI');
    await expect(page.locator('#step-button')).toContainText('FPI');

    // confirm the routing page is at fpi
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // move the route backwards to isopress
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
    await expect(page.getByRole('row')).toContainText('ISOPRESS');
    await expect(page.locator('#step-button')).toContainText('Isopress');

    // confirm the routing page is at isopress
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // pause the route
    await page.locator('#more-button-dropdown-trigger').click();
    await expect(page.getByRole('menu')).toContainText('Pause Route');
    await page.getByRole('menuitem', { name: 'Pause Route' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await expect(page.getByRole('menu')).toContainText('Resume Route');
    await expect(page.getByRole('menu')).not.toContainText('Pause Route');
    await expect(page.getByRole('menuitem', { name: 'INSPECTION' })).toBeDisabled()
    await expect(page.getByRole('menuitem', { name: 'FPI' })).toBeDisabled()

    // resume the route
    await page.getByRole('menuitem', { name: 'Resume Route' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await expect(page.getByRole('menu')).toContainText('Pause Route');
    await expect(page.getByRole('menu')).not.toContainText('Resume Route');

    // go to the next step
    await page.getByRole('menuitem', { name: 'FPI' }).click();
    await expect(page.getByRole('row')).toContainText('FPI');
    await expect(page.locator('#step-button')).toContainText('FPI');

    // stop the route
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'Stop Route' }).click();
    await page.getByRole('button', { name: 'Stop Route' }).click();
    await expect(page.getByRole('row')).toContainText('NOT STARTED');
    await expect(page.locator('#step-button')).toContainText('Not Started');

    // confirm the routing page is at not started
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).not.toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).not.toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).not.toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // complete the route
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'GREEN MACHINE' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'FPI' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'DONE' }).click();

    // confirm the routing page is at done
    await page.locator('#more-button-dropdown-trigger').click();
    await page.getByRole('menuitem', { name: 'View Route' }).click();
    await expect(page.getByTestId('route-table-header-row')).toContainText('NOT STARTED');
    await expect(page.getByTestId('route-table-header-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-header-row').getByTestId('completed-icon')).toBeVisible();
    await expect(page.getByTestId('route-table-footer-row')).toContainText('DONE');
    await expect(page.getByTestId('route-table-footer-row').getByTestId('pulse')).not.toBeVisible();
    await expect(page.getByTestId('route-table-footer-row').getByTestId('completed-icon')).toBeVisible();
    tableRows = await page.getByTestId('route-table-row').all();
    expect(tableRows[0]).toContainText('GREEN MACHINE');
    await expect(tableRows[0].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[0].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[1]).toContainText('INSPECTION');
    await expect(tableRows[1].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[1].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[2]).toContainText('ISOPRESS');
    await expect(tableRows[2].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[2].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[3]).toContainText('FPI');
    await expect(tableRows[3].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[3].getByTestId('completed-icon')).toBeVisible();
    expect(tableRows[4]).toContainText('INSPECTION');
    await expect(tableRows[4].getByTestId('pulse')).not.toBeVisible();
    await expect(tableRows[4].getByTestId('completed-icon')).toBeVisible();
    await page.getByRole('link', { name: 'Routing Test Instance' }).click();

    // check the route is complete
    await expect(page.getByRole('row')).toContainText('DONE');
    await expect(page.locator('#step-button')).toContainText('Done');
});