describe("Can search courses", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  describe("Can input text into the search bar", () => {
    it("Types into the search bar", () => {
      const testText = "Teksti Testi";
      cy.get("input#searchBar").type(testText);
      cy.should("have.value", testText);
    });
  });

  describe("Can input a course and see the number of recommendations", () => {
    it("Types into the search bar and counts the recommendations", () => {
      const testText = "Ohjelmoin";
      cy.get("input#searchBar").type(testText);

      cy.get(".searchResult")
        .its("length")
        .then((count) => {
          console.log("Number of courseResult components:", count);
          expect(count).to.be.at.least(3); // Ohpe, Ohja and Tikaweb
        });
    });
  });

  describe("Course search and recommendation verification", () => {
    it("Types into the search bar and verifies specific course recommendations", () => {
      const testText = "Ohjelmoinnin";
      cy.get("input#searchBar").type(testText);

      const expectedCourses = [
        "ohjelmoinnin perusteet",
        "ohjelmoinnin jatkokurssi",
      ];

      let foundCoursesCount = {
        "ohjelmoinnin perusteet": 0,
        "ohjelmoinnin jatkokurssi": 0,
      };

      cy.get(".searchResult")
        .each(($el, index) => {
          const textContent = $el.text().toLowerCase();

          expectedCourses.forEach((course) => {
            if (textContent.includes(course)) {
              foundCoursesCount[course] += 1;
              cy.log(`Match found for "${course}" in result #${index + 1}`);
            }
          });
        })
        .then(() => {
          expectedCourses.forEach((course) => {
            cy.log(`"${course}" found ${foundCoursesCount[course]} times.`);
            expect(
              foundCoursesCount[course],
              `Checking for course: ${course}`
            ).to.be.at.least(1);
          });
        });
    });
  });

  describe("Course search verification for unexpected results", () => {
    it('Types "Ohjelmoin" into the search bar and ensures no incorrect course is suggested', () => {
      const testText = "Ohjelmoinnin";
      const incorrectCourse = "Laskentaympäristöt";

      cy.get("input#searchBar").type(testText);

      cy.get(".searchResult").each(($el) => {
        const textContent = $el.text().toLowerCase();

        expect(textContent).to.not.include(incorrectCourse);
      });
    });
  });

  describe("Specific course search verification using course name", () => {
    it('Searches "Ohjelmoinnin perusteet" and verifies the exact course and code appear', () => {
      const searchText = "Ohjelmoinnin perusteet";
      const expectedCourseName = "ohjelmoinnin perusteet";
      const expectedCourseCode = "TKT10002";

      cy.get("input#searchBar").type(searchText);
      cy.get(".searchResult")
        .first()
        .invoke("text")
        .then((text) => {
          const resultText = text.toLowerCase();
          expect(resultText).to.include(expectedCourseName);
          expect(resultText).to.include(expectedCourseCode.toLowerCase());
        });
    });
  });

  describe("Specific course search using course code", () => {
    it('Searches "TKT10002" and verifies the exact course and code appear', () => {
      const searchText = "TKT10002";
      const expectedCourseName = "ohjelmoinnin perusteet";
      const expectedCourseCode = "TKT10002";

      cy.get("input#searchBar").type(searchText);
      cy.get(".searchResult")
        .first()
        .invoke("text")
        .then((text) => {
          const resultText = text.toLowerCase();
          expect(resultText).to.include(expectedCourseName);
          expect(resultText).to.include(expectedCourseCode.toLowerCase());
        });
    });
  });

  describe("Course selection from search results", () => {
    it('Searches for "Ohjelmoinnin", displays the courses, and clicks "Ohjelmoinnin Jatkokurssi"', () => {
      const testText = "Ohjelmoinnin Jatkokurssi";

      cy.get("input#searchBar").type(testText);
      cy.get(".searchResult").then(($results) => {
        if ($results.length > 0) {
          cy.wrap($results[0]).click();
        } else {
          throw new Error("No search results found");
        }
      });

      cy.get("body").contains("Ohjelmoinnin jatkokurssi");
      cy.get("body").contains("Ohjelmoinnin perusteet");
      cy.get("body").should("not.contain", "Johdatus");
    });
  });
});
