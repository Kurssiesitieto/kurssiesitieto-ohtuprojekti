const logger = require("../middleware/logger");

class KoriInterface {
  /*
    Interface to communicate with KORI API.

    Methods:
    courseInfo - Used to get full info of a specific course.
    
    searchCourses - Used to list all courses that contain the <search> string.
    */
  #requestOptions;

  constructor() {
    this.#requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      cache: "no-cache",
    };
  }

  isValidInput(input) {
    // This regex accepts numbers, letters (including Unicode letters), dashes, colons, underscores,
    // commas, and allows spaces between words.
    var pattern = /^[\p{L}0-9-:,_]+( [\p{L}0-9-:,_]+)*$/u;

    return pattern.test(input);
  }

  async courseInfo(id, hyYearCode = "hy-lv-75") {
    /*
        Get the course info using <id> which should be the course groupId. Gives the <hyYearCode> implementation of the course.

        Return the course info in JSON format.
        */
    if (this.isValidInput(id) && this.isValidInput(hyYearCode)) {
      const apiUrl = "https://sisu.helsinki.fi/kori/api/course-units?groupId="
        .concat(encodeURIComponent(id))
        .concat("&curriculumPeriodId=" + hyYearCode);
      return fetch(apiUrl, this.#requestOptions)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          logger.debug(apiUrl, data);
          return data;
        })
        .catch((error) => {
          console.error("Fetch error:", error.message);
        });
    } else {
      return "Virheellinen syöte";
    }
  }

  async searchCourses(search, hyYearCode = "hy-lv-75") {
    /*
        Lists max 200 courses that contain the <search> string. Gives the <hyYearCode> implementation of the courses.

        Returns list of courses in JSON format.
        */
    if (this.isValidInput(search) && this.isValidInput(hyYearCode)) {
      const apiUrl =
        "https://sisu.helsinki.fi/kori/api/course-unit-search?fullTextQuery="
          .concat(encodeURIComponent(search))
          .concat("&limit=200&universityOrgId=hy-university-root-id")
          .concat("&curriculumPeriodId=" + hyYearCode);
      return fetch(apiUrl, this.#requestOptions)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          logger.debug(apiUrl, data);
          return data;
        })
        .catch((error) => {
          console.error("Fetch error:", error.message);
        });
    } else {
      return "Virheellinen syöte";
    }
  }
}

module.exports = KoriInterface;
