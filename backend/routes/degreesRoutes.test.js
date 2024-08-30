//OLD SCHEMA,  both tests need fixing
//This module has been added to jest.config.backend.js to be excluded from tests before fix
jest.mock("../db/index");

const routes = require("./degreesRoutes");
const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());
app.use("/", routes);

describe("Open Main Page", () => {
  const degrees = [
    {
      degree_name: "Matemaattisten tieteiden kandiohjelma 2023-2026",
      degree_years: "2023-2026",
      hy_degree_id: "kh50_001",
    },
    {
      degree_name: "Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026",
      degree_years: "2023-2026",
      hy_degree_id: "kh50_005",
    },
  ];
  it("should get degrees", async () => {
    const result = await request(app).get("/");
    expect(result.status).toBe(200);
    expect(result._body).toEqual(degrees);
  });
});

describe("Search By Degree", () => {
  const degreecode = "kh50_005";
  const degreeyears = "2023-2026";
  const courses = [
    {
      name: "Johdatus yliopistomatematiikkaan",
      kori_id: "hy-CU-117375151",
      identifier: "MAT11001",
      type: "compulsory",
      x: null,
      y: null,
      dependencies: [],
    },
    {
      name: "Tietorakenteet ja algoritmit I",
      kori_id: "hy-CU-132986295",
      identifier: "TKT200011",
      type: "compulsory",
      x: null,
      y: null,
      dependencies: ["TKT10003", "MAT11001"],
    },
  ];

  it("should find courses by degree", async () => {
    const result = await request(app)
      .get("/search_by_degree")
      .set("degree-id", degreecode)
      .set("degree-years", degreeyears);
    expect(result._body).toEqual(courses);
  });
});
