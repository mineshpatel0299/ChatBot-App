import { test, expect } from "@playwright/test"

test.describe("Chatbot Application E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display login form for unauthenticated users", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Sign In")
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test("should toggle between login and signup forms", async ({ page }) => {
    await page.click("text=Don't have an account? Sign up")
    await expect(page.locator("h1")).toContainText("Sign Up")

    await page.click("text=Already have an account? Sign in")
    await expect(page.locator("h1")).toContainText("Sign In")
  })

  test("should show validation errors for invalid login", async ({ page }) => {
    await page.fill('input[type="email"]', "invalid-email")
    await page.fill('input[type="password"]', "short")
    await page.click('button[type="submit"]')

    // Should show validation or error message
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  // Note: These tests would require test user credentials in a real environment
  test.skip("should authenticate and show chat interface", async ({ page }) => {
    await page.fill('input[type="email"]', "test@example.com")
    await page.fill('input[type="password"]', "testpassword")
    await page.click('button[type="submit"]')

    await expect(page.locator("text=AI Chatbot")).toBeVisible()
    await expect(page.locator("text=Chats")).toBeVisible()
  })

  test.skip("should create new chat and send message", async ({ page }) => {
    // This would require authentication first
    await page.click("text=New")
    await page.fill('input[placeholder="Chat title..."]', "Test Chat")
    await page.click("text=Create")

    await page.fill('textarea[placeholder="Type your message..."]', "Hello, chatbot!")
    await page.click('button[aria-label="Send message"]')

    await expect(page.locator("text=Hello, chatbot!")).toBeVisible()
  })
})
