const headersMiddleware = require("unfuck-utf8-headers-middleware");

const headers = [
  "uid",
  "mail",
  "preferredlanguage",
  "hypersonsisuid",
  "hyGroupCn",
];

module.exports = headersMiddleware(headers);
