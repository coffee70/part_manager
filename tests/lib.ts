import { Page } from "@playwright/test";

export function modelsPrimaryNavigation(page: Page) {
    return page.locator('#models_primary_navigation');
}

export function modelsAdminPageNavigation(page: Page) {
    return page.locator('#models_models_secondary_navigation');
}

export function modelFormColor(page: Page, nth: number) {
    return page.locator(`.grid > div:nth-child(${nth})`)
}