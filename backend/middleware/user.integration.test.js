const express = require("express");
const request = require("supertest");
const { userMiddleware } = require("./user");

const app = express();

app.use(userMiddleware);
app.get("/api/kirjauduttu", (req, res) => {
  res.json({
    kirjauduttu: req.kirjauduttu,
    user: req.user ? req.user : null,
  });
});

describe("Integration tests for userMiddleware", () => {
  let originalEnv;

  // Save the original environment variables
  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  // Restore the original environment variables after tests
  afterAll(() => {
    process.env = originalEnv;
  });

  // Set specific environment variable for the test
  beforeEach(() => {
    process.env.NODE_ENV = "production";
  });

  // Test with valid headers
  test("should return 200 and correct JSON for valid headers", async () => {
    const response = await request(app).get("/api/kirjauduttu").set({
      uid: "testUser",
      mail: "address@helsinki.fi",
      preferredlanguage: "fi",
      hypersonsisuid: "hy-hlo-123456789",
      hygroupcn: "grp-toska;hy-employees",
    });

    expect(response.status).toBe(200);
    expect(response.body.kirjauduttu).toBe(true);
    expect(response.body.user).toEqual({
      id: "hy-hlo-123456789",
      username: "testUser",
      email: "address@helsinki.fi",
      language: "fi",
      iamGroups: ["grp-toska", "hy-employees"],
      isAdmin: true,
    });
  });

  // Test with invalid headers
  test("should return 200 and false kirjauduttu for invalid headers", async () => {
    const response = await request(app).get("/api/kirjauduttu").set({
      uid: "testUser",
      mail: "invalid-email@domain.com",
      preferredlanguage: "fi",
      hypersonsisuid: "hy-hlo-123456789",
      hygroupcn: "grp-toska;hy-employees",
    });

    expect(response.status).toBe(200);
    expect(response.body.kirjauduttu).toBe(false);
    expect(response.body.user).toBe(null);
  });

  // Test missing headers
  test("should return 200 and false kirjauduttu for missing headers", async () => {
    const response = await request(app).get("/api/kirjauduttu").set({
      uid: "",
      mail: "",
      preferredlanguage: "fi",
      hypersonsisuid: "hy-hlo-123456789",
      hygroupcn: "grp-toska;hy-employees",
    });

    expect(response.status).toBe(200);
    expect(response.body.kirjauduttu).toBe(false);
    expect(response.body.user).toBe(null);
  });
});
