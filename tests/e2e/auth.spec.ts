import { test, expect } from "@playwright/test";

test.describe("SEHub Authentication & Role-Based Access", () => {
  test("Landing page loads with verified syllabus units and accessible CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SE-HUB ANITS/i);

    // Verify main headings
    const heading = page.locator("h1");
    await expect(heading).toContainText("Software Engineering");

    // Verify CTAs are present and accessible
    const signInLink = page.getByRole("link", { name: /Sign In to Access Platform/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", "/login");

    const registerLink = page.getByRole("link", { name: /Create Institutional Account/i });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/register");

    // Verify 5 curriculum units overview
    const unit1 = page.getByText(/Process Models & Agile/i).first();
    await expect(unit1).toBeVisible();
  });

  test("Login page supports Student and Faculty role selection with strict validation", async ({ page }) => {
    await page.goto("/login");

    // Student tab is selected by default
    const studentEmailInput = page.locator('input[type="email"]');
    await expect(studentEmailInput).toBeVisible();

    // Fill non-institutional email
    await studentEmailInput.fill("student@gmail.com");
    await page.locator('input[type="password"]').fill("SecretPassword123");
    await page.getByRole("button", { name: /Sign In to Student Portal/i }).click();

    // Verify domain validation message
    const errorNotice = page.getByText(/college email ending with @anits.edu.in/i);
    await expect(errorNotice).toBeVisible();

    // Switch to Faculty role
    const facultyTab = page.getByRole("button", { name: /Faculty Sign In/i });
    await facultyTab.click();

    // Verify Faculty Authorization Code input is displayed
    const facultyCodeInput = page.locator('input[placeholder*="Authorization Code"]');
    await expect(facultyCodeInput).toBeVisible();
  });

  test("Protected route guard redirects unauthenticated users from /teacher to /login", async ({ page }) => {
    await page.goto("/teacher");
    // NextAuth middleware should intercept and redirect
    await expect(page).toHaveURL(/.*login.*/);
  });

  test("Protected route guard redirects unauthenticated users from /student to /login", async ({ page }) => {
    await page.goto("/student");
    await expect(page).toHaveURL(/.*login.*/);
  });
});

