import { Locator, Page, expect } from "@playwright/test";

export function modelsPrimaryNavigation(page: Page) {
    return page.locator('#models_primary_navigation');
}

export function routersPrimaryNavigation(page: Page) {
    return page.locator('#routers_primary_navigation');
}

export function modelsAdminPageNavigation(page: Page) {
    return page.locator('#models_models_secondary_navigation');
}

export function routersAdminPageNavigation(page: Page) {
    return page.locator('#routers_routerss_secondary_navigation');
}

export function modelFormColor(page: Page, nth: number) {
    return page.locator(`.grid > div:nth-child(${nth})`)
}

export function routerFormColor(page: Page, nth: number) {
    return page.locator(`.grid > div:nth-child(${nth})`)
}

export async function checkRoutingTableIcons(locator: Locator, iconTestIds: string[]) {
    const allIconTestIds = [
        'in-progress-pulse',
        'completed-icon',
        'failed-icon',
        'completed-idle-icon',
        'failed-idle-icon',
        'paused-icon',
    ]
    for (const iconTestId of allIconTestIds) {
        if (iconTestIds.includes(iconTestId)) {
            await expect(locator.getByTestId(iconTestId)).toBeVisible();
        } else {
            await expect(locator.getByTestId(iconTestId)).not.toBeVisible();
        }
    }
}