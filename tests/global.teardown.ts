import { test as teardown, expect } from "@playwright/test";

teardown('logout', async ({ page }) => {
    await page.goto('/');
    await page.locator('button[name="more"]').click();
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('heading')).toContainText('Log in');
})