require("dotenv").config();
const logger = require("../middleware/logger");

logger.info(`DATABASE_HOST: ${process.env.DATABASE_HOST}`);
logger.info(`DATABASE_PORT: ${process.env.DATABASE_PORT}`);
logger.info(`DATABASE_NAME: ${process.env.DATABASE_NAME}`);

const { Pool } = require("pg");

const selectPool = () => {
  if (process.env.DATABASE_POOLMODE === "direct") {
    logger.info("Using direct DATABASE_POOLMODE");
    return new Pool({
      connectionString: process.env.DATABASE_DIRECT,
    });
  } else {
    logger.info("Using default DATABASE_POOLMODE");
    return new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    });
  }
};

const pool = selectPool();

const testDatabaseConnection = async () => {
  try {
    const response = await pool.query("SELECT NOW()");
    logger.info(
      "Successful database connection primary. Current time from DB:",
      response.rows[0].now
    );
  } catch (error) {
    logger.error("Failed to connect to the database:", error);
    return "Failed to connect to the database:", error;
  }
};

testDatabaseConnection();

const executeSchemaFile = async () => {
  const fs = require("fs");
  const path = require("path");
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await pool.query(schema);
  logger.info("Schema file executed");
};

module.exports = {
  executeSchemaFile,
  pool,
};
