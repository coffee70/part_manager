import { test, expect } from '@playwright/test';
import { checkRoutingTableIcons } from './lib';

test.describe('routing', () => {
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
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'NOT STARTED' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Not Started');

        // move the route forwards to green machine
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Start Route' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // complete green machine step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // move the route forwards to inspection
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Fail inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Redo inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Complete inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Go back to green machine step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'GREEN MACHINE' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // Complete green machine step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'GREEN MACHINE' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Green Machine');

        // Go to inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Complete inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // move the route forwards to isopress
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // Complete isopress step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // move the route forwards to fpi
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // Complete fpi step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Complete Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // move the route forwards to inspection
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'INSPECTION' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // Fail inspection step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'INSPECTION' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Inspection');

        // move the route backwards to fpi
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // Fail fpi step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Fail Step' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // move the route backwards to isopress
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'ISOPRESS' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
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
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'ISOPRESS' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('Isopress');

        // go to the next step
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'FPI' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'FPI' })).toBeVisible();
        await expect(page.locator('#step-button')).toContainText('FPI');

        // stop the route
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'Stop Route' }).click();
        await page.getByRole('button', { name: 'Stop Route' }).click();
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'NOT STARTED' })).toBeVisible();
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
        await expect(page.getByRole('row', { name: 'Routing Test Instance 1' }).getByRole('cell', { name: 'DONE' })).toBeVisible();
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
        // this will also check the summary title updates 
        // as the user moves through the steps on the table page
        await expect(page.getByTestId('route-not-started-container')).toBeVisible();
        await page.getByLabel('Start Route').click();
        await expect(page.getByTestId('route-summary-title')).toContainText('Green Machine');
        // complete the green machine step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        await expect(page.getByTestId('route-summary-title')).toContainText('Inspection');
        // complete the inspection step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        await expect(page.getByTestId('route-summary-title')).toContainText('Isopress');
        // complete the isopress step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        await expect(page.getByTestId('route-summary-title')).toContainText('FPI');
        // complete the fpi step
        await page.getByLabel('Complete Step').click();
        await page.getByLabel('Start Next Step').click();
        await expect(page.getByTestId('route-summary-title')).toContainText('Inspection');
        // complete the inspection step
        await page.getByLabel('Complete Step').click();
        await expect(page.getByTestId('route-summary-title')).toContainText('Inspection');
        // complete the route
        await page.getByLabel('Complete Route').click();
        await expect(page.getByTestId('route-completed-container')).toBeVisible();

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
        await page.goto('/');

        // create an instance of the model
        await page.getByRole('link', { name: 'Routing Test' }).click();
        await page.locator('[id="create-instance-Routing\\ Test"]').click();
        await page.getByLabel('Number').fill('Routing Test Instance 3');
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

        // navigate to the routing page
        await page.getByTestId('step-button-trigger').click();
        await page.getByRole('menuitem', { name: 'View Route' }).click();

        // confirm the routing page is at not started
        await expect(page.getByTestId('route-not-started-container')).toBeVisible();
        await expect(page.getByTestId('route-completed-container')).not.toBeVisible();

        // start the route
        await page.getByLabel('Start Route').click();

        // confirm both the not started and completed containers are not visible
        await expect(page.getByTestId('route-not-started-container')).not.toBeVisible();
        await expect(page.getByTestId('route-completed-container')).not.toBeVisible();

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

        // complete the step
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // start the next step: inspection
        await page.getByTestId('route-table-row').nth(1).click();
        await page.getByTestId('start-step-button').click();

        // fail the step
        await page.getByTestId('fail-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // start previous step: green machine
        await page.getByTestId('route-table-row').first().click();
        await page.getByTestId('start-step-button').click();

        // confirm all the fields are still filled in
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

        // fail the step
        await page.getByTestId('fail-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // confirm all the fields are still filled in
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

        // redo the step
        await page.getByTestId('redo-step-button').click();

        // confirm all the fields are still filled in
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

        // complete the step
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // confirm all the fields are still filled in
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

        // start the next step: inspection
        await page.getByTestId('route-table-row').nth(1).click();
        await page.getByTestId('start-step-button').click();

        // complete the step
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // start the next step: isopress
        await page.getByTestId('route-table-row').nth(2).click();
        await page.getByTestId('start-step-button').click();
        
        // complete the step
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // start the next step: fpi
        await page.getByTestId('route-table-row').nth(3).click();
        await page.getByTestId('start-step-button').click();

        // pause the route
        await page.getByLabel('Pause Route').click();

        // confirm the complete and fail buttons are disabled
        await expect(page.getByTestId('complete-step-button')).toBeDisabled();
        await expect(page.getByTestId('fail-step-button')).toBeDisabled();

        // confirm the paused warning banner is visible
        await expect(page.getByTestId('paused-warning-banner')).toBeVisible();

        // resume the route
        await page.getByLabel('Resume Route').click();

        // confirm the complete and fail buttons are enabled
        await expect(page.getByTestId('complete-step-button')).toBeEnabled();
        await expect(page.getByTestId('fail-step-button')).toBeEnabled();

        // confirm the paused warning banner is not visible
        await expect(page.getByTestId('paused-warning-banner')).not.toBeVisible();
        
        // complete the step
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();

        // stop the route
        await page.getByLabel('Stop Route').click();
        await page.getByRole('button', { name: 'Stop Route' }).click();

        // confirm the not started container is visible
        await expect(page.getByTestId('route-not-started-container')).toBeVisible();
        await expect(page.getByTestId('route-completed-container')).not.toBeVisible();

        // complete the route
        await page.getByLabel('Start Route').click();
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();
        await page.getByTestId('route-table-row').nth(1).click();
        await page.getByTestId('start-step-button').click();
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();
        await page.getByTestId('route-table-row').nth(2).click();
        await page.getByTestId('start-step-button').click();
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();
        await page.getByTestId('route-table-row').nth(3).click();
        await page.getByTestId('start-step-button').click();
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();
        await page.getByTestId('route-table-row').nth(4).click();
        await page.getByTestId('start-step-button').click();
        await page.getByTestId('complete-step-button').click();
        await expect(page.getByTestId('redo-step-button')).toBeVisible();
        await page.getByTestId('complete-route-button').click();
        
        // confirm the routing page is at completed
        await expect(page.getByTestId('route-completed-container')).toBeVisible();
        await expect(page.getByTestId('route-not-started-container')).not.toBeVisible();
    });
});