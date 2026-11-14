import { test, expect } from "@playwright/test";

test.describe("SEHub Public & Academic API Endpoints", () => {
  test("GET /api/resources returns status 200 with JSON resources array", async ({ request }) => {
    const res = await request.get("/api/resources");
    expect(res.status()).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("success", true);
    expect(Array.isArray(json.resources)).toBe(true);
  });

  test("GET /api/announcements returns status 200 with announcements array", async ({ request }) => {
    const res = await request.get("/api/announcements");
    expect(res.status()).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("success", true);
    expect(Array.isArray(json.announcements)).toBe(true);
  });

  test("POST /api/upload blocks unauthenticated users with 403 Forbidden", async ({ request }) => {
    const res = await request.post("/api/upload", {
      multipart: {
        title: "Test Resource",
      },
    });
    // Strict faculty role required
    expect(res.status()).toBe(403);
  });
});

