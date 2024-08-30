require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const { userMiddleware } = require("./middleware/user");
const shibboleth = require("./middleware/shibboleth");

const app = express();
const PORT = 3001; //process.env.PORT || 3001; adjust port later from .env, probably using dotenv
const { executeSchemaFile } = require("./dbStartup");
const { insertPlansFromJson } = require("./dbStartup/insertDataFromJson");
const { insertDegreeinfoFromJson } = require("./dbStartup/insertDataFromJson");
const coursesRoutes = require("./routes/coursesRoutes");
const degreesRoutes = require("./routes/degreesRoutes");
const koriRoutes = require("./routes/koriRoutes");
const loginRoutes = require("./routes/loginRoutes");
const path = require("path");

const initializeDatabase = async () => {
  try {
    await executeSchemaFile();
    await insertDegreeinfoFromJson();
    await insertPlansFromJson();
  } catch (error) {
    logger.error("Error during database initialization:", error);
    process.exit(1); // Exit the process with an error code
  }
};

initializeDatabase();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "../dist")));

const corsOptions = {
  exposedHeaders: [
    "Kirjauduttu",
    "User",
    "uid",
    "mail",
    "preferredlanguage",
    "hypersonsisuid",
    "hygroupcn",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(shibboleth);
app.use(userMiddleware);

app.use("/api/courses", coursesRoutes);
app.use("/api/degrees", degreesRoutes);
app.use("/api/kori", koriRoutes);
app.use("/api/kirjauduttu", loginRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.use((req, res) => {
  logger.warn(`Attempted access an undefined route: ${req.originalUrl}`);
  res.status(404).send("Route does not exist.");
});

app.listen(PORT, () => {
  logger.verbose(`Server running on port ${PORT}`);
});

module.exports = app;
