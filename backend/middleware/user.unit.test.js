const {
  validateHelsinkiEmail,
  parseIamGroups,
  checkAdmin,
  areHeadersValid,
  createUser,
  mockHeaders,
} = require("./user");

describe("Utility functions", () => {
  describe("validateHelsinkiEmail", () => {
    test("should return true for valid Helsinki email", () => {
      expect(validateHelsinkiEmail("test@helsinki.fi")).toBe(true);
    });

    test("should return false for invalid Helsinki email", () => {
      expect(validateHelsinkiEmail("test@gmail.com")).toBe(false);
      expect(validateHelsinkiEmail("test@helsinki.com")).toBe(false);
    });
  });

  describe("parseIamGroups", () => {
    test("should correctly parse IAM groups", () => {
      const iamGroups = "grp-toska;hy-employees";
      const expected = ["grp-toska", "hy-employees"];
      expect(parseIamGroups(iamGroups)).toEqual(expected);
    });

    test("should return an empty array for an empty string", () => {
      expect(parseIamGroups("")).toEqual([]);
    });

    test("should return an empty array for undefined or null", () => {
      expect(parseIamGroups(undefined)).toEqual([]);
      expect(parseIamGroups(null)).toEqual([]);
    });
  });

  describe("checkAdmin", () => {
    test("should return true if user is in grp-toska", () => {
      const iamGroups = ["grp-toska", "hy-employees"];
      expect(checkAdmin(iamGroups)).toBe(true);
    });

    test("should return false if user is not in grp-toska", () => {
      const iamGroups = ["hy-employees"];
      expect(checkAdmin(iamGroups)).toBe(false);
    });

    test("should return false for an empty array", () => {
      expect(checkAdmin([])).toBe(false);
    });
  });

  describe("areHeadersValid", () => {
    test("should return true for valid headers", () => {
      const headers = { uid: "testUser", mail: "address@helsinki.fi" };
      expect(areHeadersValid(headers)).toBe(true);
    });

    test("should return false if uid is missing", () => {
      const headers = { mail: "address@helsinki.fi" };
      expect(areHeadersValid(headers)).toBe(false);
    });

    test("should return false if email is invalid", () => {
      const headers = { uid: "testUser", mail: "address@gmail.com" };
      expect(areHeadersValid(headers)).toBe(false);
    });
  });

  describe("createUser", () => {
    test("should create a user object from headers", () => {
      const headers = mockHeaders;

      const expectedUser = {
        id: "hy-hlo-123456789",
        username: "testUser",
        email: "address@helsinki.fi",
        language: "fi",
        iamGroups: ["grp-toska", "hy-employees"],
        isAdmin: true,
      };

      expect(createUser(headers)).toEqual(expectedUser);
    });

    test("should handle missing group header gracefully", () => {
      const headers = {
        uid: "testUser",
        mail: "address@helsinki.fi",
        preferredlanguage: "fi",
        hypersonsisuid: "hy-hlo-123456789",
        hygroupcn: "",
      };

      const expectedUser = {
        id: "hy-hlo-123456789",
        username: "testUser",
        email: "address@helsinki.fi",
        language: "fi",
        iamGroups: [],
        isAdmin: false,
      };

      expect(createUser(headers)).toEqual(expectedUser);
    });
  });
});
