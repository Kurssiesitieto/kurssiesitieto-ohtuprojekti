const routes = require("./coursesRoutes");
const { findCourseWithDependencies } = require("./coursesRoutes");
const request = require("supertest");
const express = require("express");
const app = express();
//const logger = require('../middleware/logger'); commented out for linting
app.use(express.json());
app.use("/", routes);

jest.mock("../db/index");

describe("Add Course", () => {
  const course = {
    official_course_id: "CS101",
    course_name: "Intro to CS",
    kori_name: "IntroCS101",
  };

  it("should add a course to database", async () => {
    const result = await request(app)
      .post("/databaseCreateCourse")
      .send(course);
    expect(result._body.kori_id).toBe(course.official_course_id);
    expect(result._body.course_name).toBe(course.course_name);
    expect(result._body.hy_course_id).toBe(course.kori_name);
  });
});
/* NOT WORKING, needs fix
describe("Get Courses", () => {
  const courses = [{
    official_course_id: "CS101",
    course_name: "Intro to CS",
    kori_name: "IntroCS101"
  }];
  it('should get courses from database', async () => {
    const response = await request(app).get("/databaseGetCourses");
    const result = JSON.parse(response.text).rows[0]
    logger.debug("Courses from /databaseGetCourses", result)
    expect(result.kori_id).toBe(courses[0].official_course_id);
    expect(result.course_name).toBe(courses[0].course_name);
    expect(result.hy_course_id).toBe(courses[0].kori_name);
  });
});
*/

describe("Add Prerequisite Course", () => {
  it("should add a prerequisite course", async () => {
    const course_kori_name = "IntroCS102";
    const prerequisite_course_kori_name = "IntroCS101";
    const result = await request(app)
      .post("/addPrerequisiteCourse")
      .send({ course_kori_name, prerequisite_course_kori_name });
    expect(result._body).toEqual(["IntroCS102", "IntroCS101"]);
  });
  it("should fail when given two same courses", async () => {
    const course_kori_name = "IntroCS102";
    const prerequisite_course_kori_name = "IntroCS102";
    const result = await request(app)
      .post("/addPrerequisiteCourse")
      .send({ course_kori_name, prerequisite_course_kori_name });
    expect(result._body).toEqual([]);
  });
});

describe("Course Searching", () => {
  const courses = [
    {
      name: "Tietorakenteet ja algoritmit II",
      identifier: "Tira2",
      dependencies: ["Tira1"],
      type: "mandatory",
    },
    {
      name: "Tietorakenteet ja algoritmit I",
      identifier: "Tira1",
      dependencies: ["Ohja", "Jym"],
      type: "mandatory",
    },
    {
      name: "Ohjelmistotuotanto Projekti",
      identifier: "Ohtupro",
      dependencies: ["Ohtu"],
    },
    {
      name: "Ohjelmistotuotanto",
      identifier: "Ohtu",
      dependencies: ["Tira2"],
      type: "mandatory",
    },
  ];

  it("should find a course and its direct dependencies", () => {
    const result = findCourseWithDependencies("Tira2", courses);

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ identifier: "Tira2" }),
        expect.objectContaining({ identifier: "Tira1" }),
      ])
    );
  });

  it("should find a course and exclude those that follow it", () => {
    const result = findCourseWithDependencies("Tira1", courses);

    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ identifier: "Tira1" })])
    );

    expect(result).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ identifier: "Tira2" })])
    );
  });

  it("should find the correct course when names are similar", () => {
    const result = findCourseWithDependencies("Ohtu", courses);
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining({ identifier: "Ohtu" })])
    );

    expect(result).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ identifier: "Ohtupro" }),
      ])
    );
  });
});
