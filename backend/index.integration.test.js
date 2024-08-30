// NOT IN USE // WIP // Requires /db mock // Integration test //

jest.mock("./interfaces/koriInterface");
const request = require("supertest");

const app = require("./index");

describe("Test Routes", () => {
  test("Kori Info Responds with course description", async () => {
    const response = await request(app)
      .get("/api/kori/get_info_by_id/")
      .query({ search: "TKT10003" });
    const courses = JSON.parse(response.text);
    expect(courses.id).toBe("otm-eb0cf926-57aa-4c8e-9ddc-8b6611930674");
    expect(courses.code).toBe("TKT10003");
    expect(courses.name).toBe("Ohjelmoinnin jatkokurssi");
    expect(courses.groupId).toBe("hy-CU-118023947");
    expect(JSON.stringify(courses.curriculumPeriodIds)).toBe('["hy-lv-74"]');
  });
  test("Kori search Responds with courses", async () => {
    const response = await request(app)
      .get("/api/kori/getKori/")
      .query({ search: "TKT10003" });
    const courses = JSON.parse(response.text).searchResults;
    expect(Object.keys(courses).length).toBe(2);
    expect(courses[0].id).toBe("otm-eb0cf926-57aa-4c8e-9ddc-8b6611930674");
    expect(courses[0].code).toBe("TKT10003");
    expect(courses[0].name).toBe("Ohjelmoinnin jatkokurssi");
    expect(courses[0].groupId).toBe("hy-CU-118023947");
    expect(JSON.stringify(courses[0].curriculumPeriodIds)).toBe('["hy-lv-74"]');

    expect(courses[1].id).toBe("otm-6dd390bf-1710-436e-bebb-a6f4e5032b9e");
    expect(courses[1].code).toBe("TKT100031");
    expect(courses[1].name).toBe("Ohjelmoinnin jatkokurssi, lisäosa (Python)");
    expect(courses[1].groupId).toBe("hy-CU-137766069");
    expect(JSON.stringify(courses[1].curriculumPeriodIds)).toBe(
      '["hy-lv-74","hy-lv-75","hy-lv-76"]'
    );
  });
});
