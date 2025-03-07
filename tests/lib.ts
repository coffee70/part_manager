import { Page } from "@playwright/test";

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