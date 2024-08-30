const { Pool } = require("pg");

jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("index.js tests", () => {
  let OLD_ENV;

  beforeAll(() => {
    // Save the current environment variables
    OLD_ENV = { ...process.env };
  });

  afterAll(() => {
    // Restore the old environment variables after all tests
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    jest.resetModules(); // clears the require cache
    process.env = { ...OLD_ENV }; // Restore to original environment

    // Set the environment variables for the test
    process.env.DATABASE_POOLMODE = "default";
    process.env.POSTGRES_USER = "testuser";
    process.env.POSTGRES_PASSWORD = "testpassword";
    process.env.DATABASE_HOST = "localhost";
    process.env.DATABASE_PORT = "5432";
    process.env.DATABASE_NAME = "testdb";
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test("should use default database pool mode", () => {
    const poolSpy = jest.spyOn(require("pg"), "Pool");

    // Load index.js after setting env variables
    require("./index");

    console.log(Pool.mock.calls); // Log mock calls

    expect(poolSpy).toHaveBeenCalledTimes(1);
    expect(poolSpy).toHaveBeenCalledWith({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    });
  });

  test("should use direct database pool mode", () => {
    process.env.DATABASE_POOLMODE = "direct";
    process.env.DATABASE_DIRECT =
      "postgres://testuser:testpassword@localhost:5432/testdb";

    const poolSpy = jest.spyOn(require("pg"), "Pool");

    // Load index.js after setting env variables
    require("./index");

    console.log(Pool.mock.calls); // Log mock calls

    expect(poolSpy).toHaveBeenCalledTimes(1);
    expect(poolSpy).toHaveBeenCalledWith({
      connectionString: process.env.DATABASE_DIRECT,
    });
  });
});
