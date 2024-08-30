class KoriInterface {
  /*
    MOCK Interface to communicate with KORI API.

    Methods:
    courseInfo - Used to get full info of a specific course.
    
    searchCourses - Used to list all courses that contain the <search> string.
    */

  constructor() {
    this.courses = JSON.parse(`{
            "searchResults": [
                {
                    "id": "otm-eb0cf926-57aa-4c8e-9ddc-8b6611930674",
                    "code": "TKT10003",
                    "name": "Ohjelmoinnin jatkokurssi",
                    "groupId": "hy-CU-118023947",
                    "curriculumPeriodIds": [
                        "hy-lv-74"
                    ]
                },
                {
                    "id": "otm-6dd390bf-1710-436e-bebb-a6f4e5032b9e",
                    "code": "TKT100031",
                    "name": "Ohjelmoinnin jatkokurssi, lisäosa (Python)",
                    "groupId": "hy-CU-137766069",
                    "curriculumPeriodIds": [
                        "hy-lv-74",
                        "hy-lv-75",
                        "hy-lv-76"
                    ]
                },
                {
                    "id": "otm-0d82da83-b28a-40f0-a5d8-868e9fa8c2b8",
                    "code": "TKT10002",
                    "name": "Ohjelmoinnin perusteet",
                    "groupId": "hy-CU-118023867",
                    "curriculumPeriodIds": [
                        "hy-lv-74"
                    ]
                },
                {
                    "id": "otm-61ed6c35-a7b7-461f-8a4c-b74418f3a413",
                    "code": "TKT100021",
                    "name": "Ohjelmoinnin perusteet, lisäosa (Python)",
                    "groupId": "hy-CU-137765567",
                    "curriculumPeriodIds": [
                        "hy-lv-74"
                    ]
                },
                {
                    "id": "otm-5b525260-b775-4578-81ac-5e3ba347e893",
                    "code": "TKT10004",
                    "name": "Tietokantojen perusteet",
                    "groupId": "hy-CU-118023990",
                    "curriculumPeriodIds": [
                        "hy-lv-74",
                        "hy-lv-75",
                        "hy-lv-76"
                    ]
                },
                {
                    "id": "otm-70c80428-00d1-4a65-ad9c-a716cd49c3a8",
                    "code": "TKT10005",
                    "name": "Tietokoneen toiminta",
                    "groupId": "hy-CU-118024303",
                    "curriculumPeriodIds": [
                        "hy-lv-74",
                        "hy-lv-75",
                        "hy-lv-76"
                    ]
                },
                {
                    "id": "otm-e4cbe2b1-12be-49ca-92ce-9aeead0759f3",
                    "code": "TKT10006",
                    "name": "Tietokone ja Internet",
                    "groupId": "otm-e4cbe2b1-12be-49ca-92ce-9aeead0759f3",
                    "curriculumPeriodIds": [
                        "hy-lv-74"
                    ]
                }
            ]
        }`);
  }

  isValidInput(input) {
    // This regex accepts numbers, letters (including Unicode letters), dashes, colons, underscores,
    // commas, and allows spaces between words.
    var pattern = /^[\p{L}0-9-:,_]+( [\p{L}0-9-:,_]+)*$/u;

    return pattern.test(input);
  }

  async courseInfo(id, hyYearCode = "hy-lv-74") {
    /*
        Get the course info using <id> which should be the course groupId. Gives the <hyYearCode> implementation of the course.

        Return the course info in JSON format.
        */
    if (this.isValidInput(id)) {
      const course = this.courses.searchResults.find(
        (course) => course.code === id
      );
      if (course.curriculumPeriodIds.includes(hyYearCode)) {
        return course;
      }
      return null;
    } else {
      return "Virheellinen syöte";
    }
  }

  async searchCourses(search, hyYearCode = "hy-lv-74") {
    /*
        Lists max 200 courses that contain the <search> string. Gives the <hyYearCode> implementation of the courses.

        Returns list of courses in JSON format.
        */
    if (this.isValidInput(search)) {
      const results = [];
      this.courses.searchResults.forEach((course) => {
        if (
          (course.name.includes(search) || course.code.includes(search)) &&
          course.curriculumPeriodIds.includes(hyYearCode)
        ) {
          results.push(course);
        }
      });
      const resultsJSON = { searchResults: results };
      return resultsJSON;
    } else {
      return "Virheellinen syöte";
    }
  }
}

module.exports = KoriInterface;
