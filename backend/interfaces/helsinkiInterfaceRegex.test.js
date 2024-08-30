const HelsinkiInterface = require("./helsinkiInterface");

describe("HelsinkiInterface", () => {
  let helInterface;

  beforeEach(() => {
    helInterface = new HelsinkiInterface();
  });

  describe("isValidInput method", () => {
    test("should allow single words with letters", () => {
      expect(helInterface.isValidInput("Ohjelmoinnin")).toBe(true);
    });

    test("should allow multiple words", () => {
      expect(helInterface.isValidInput("Ohjelmoinnin Jatkokurssi")).toBe(true);
    });

    test("should allow words with numbers, underscores and dashes", () => {
      expect(helInterface.isValidInput("Kurssi-1_23")).toBe(true);
    });

    test("should allow words with åäö", () => {
      expect(helInterface.isValidInput("abcdefghijklmnopqrstuvwxyzåäö")).toBe(
        true
      );
    });

    test("should not allow leading or trailing spaces", () => {
      expect(helInterface.isValidInput(" Ohjelmoinnin")).toBe(false);
      expect(helInterface.isValidInput("Ohjelmoinnin ")).toBe(false);
      expect(helInterface.isValidInput("Ohjelmoinnin Jatkokurssi ")).toBe(
        false
      );
    });

    test("should not allow multiple consecutive spaces within", () => {
      expect(helInterface.isValidInput("Ohjelmoinnin  jatkokurssi")).toBe(
        false
      );
    });

    test("should allow these special characters", () => {
      expect(helInterface.isValidInput("OhjelmoinninJatko-kurssi")).toBe(true);
      expect(helInterface.isValidInput("Ohjelmoinnin,Jatkokurssi")).toBe(true);
      expect(helInterface.isValidInput("Ohjelmo:inninJatkokurssi")).toBe(true);
      expect(helInterface.isValidInput("Ohj_elmoinninJatkokurssi")).toBe(true);
    });

    test("should not allow special characters other than dashes", () => {
      expect(helInterface.isValidInput("OhjelmoinninJatko\\kurssi")).toBe(
        false
      );
      expect(helInterface.isValidInput("Ohjelmoinnin/Jatkokurssi")).toBe(false);
      expect(helInterface.isValidInput("Ohjelmo$inninJatkokurssi")).toBe(false);
      expect(helInterface.isValidInput("Ohj*elmoinninJatkokurssi")).toBe(false);
      expect(helInterface.isValidInput("OhjelmoinninJatkok?urssi")).toBe(false);
    });
  });
});
