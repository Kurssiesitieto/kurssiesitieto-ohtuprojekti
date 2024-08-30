const KoriInterface = require("./koriInterface");

describe("KoriInterface", () => {
  let kori;

  beforeEach(() => {
    kori = new KoriInterface();
  });

  describe("isValidInput method", () => {
    test("should allow single words with letters", () => {
      expect(kori.isValidInput("Ohjelmoinnin")).toBe(true);
    });

    test("should allow multiple words", () => {
      expect(kori.isValidInput("Ohjelmoinnin Jatkokurssi")).toBe(true);
    });

    test("should allow words with numbers and dashes", () => {
      expect(kori.isValidInput("Kurssi-123")).toBe(true);
    });

    test("should allow words with åäö", () => {
      expect(kori.isValidInput("abcdefghijklmnopqrstuvwxyzåäö")).toBe(true);
    });

    test("should not allow leading or trailing spaces", () => {
      expect(kori.isValidInput(" Ohjelmoinnin")).toBe(false);
      expect(kori.isValidInput("Ohjelmoinnin ")).toBe(false);
      expect(kori.isValidInput("Ohjelmoinnin Jatkokurssi ")).toBe(false);
    });

    test("should not allow multiple consecutive spaces within", () => {
      expect(kori.isValidInput("Ohjelmoinnin  jatkokurssi")).toBe(false);
    });

    test("should allow these special characters", () => {
      expect(kori.isValidInput("OhjelmoinninJatko-kurssi")).toBe(true);
      expect(kori.isValidInput("Ohjelmoinnin,Jatkokurssi")).toBe(true);
      expect(kori.isValidInput("Ohjelmo:inninJatkokurssi")).toBe(true);
      expect(kori.isValidInput("Ohj_elmoinninJatkokurssi")).toBe(true);
    });

    test("should not allow these special characters", () => {
      expect(kori.isValidInput("OhjelmoinninJatko\\kurssi")).toBe(false);
      expect(kori.isValidInput("Ohjelmoinnin/Jatkokurssi")).toBe(false);
      expect(kori.isValidInput("Ohjelmo$inninJatkokurssi")).toBe(false);
      expect(kori.isValidInput("Ohj*elmoinninJatkokurssi")).toBe(false);
      expect(kori.isValidInput("OhjelmoinninJatkok?urssi")).toBe(false);
      expect(kori.isValidInput("Ohjelmoinnin{Jatkokurssi")).toBe(false);
    });
  });
});
