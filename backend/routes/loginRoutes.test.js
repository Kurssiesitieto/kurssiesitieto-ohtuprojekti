const request = require("supertest");
const express = require("express");
const loginRoutes = require("./loginRoutes");

describe("GET /", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use((req, res, next) => {
      req.kirjauduttu = true;
      req.user = { username: "testUser" };
      next();
    });
    app.use("/api/kirjauduttu", loginRoutes);
  });

  test("should return kirjauduttu and user as JSON", async () => {
    const response = await request(app).get("/api/kirjauduttu");

    expect(response.status).toBe(200);
    expect(response.body.kirjauduttu).toBe(true);
    expect(response.body.user.username).toBe("testUser");
  });

  test("should return null for user if not logged in", async () => {
    const app = express();
    app.use((req, res, next) => {
      req.kirjauduttu = false;
      req.user = null;
      next();
    });
    app.use("/api/kirjauduttu", loginRoutes);

    const response = await request(app).get("/api/kirjauduttu");

    expect(response.status).toBe(200);
    expect(response.body.kirjauduttu).toBe(false);
    expect(response.body.user).toBeNull();
  });
});
