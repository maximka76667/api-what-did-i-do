const { LOGIN, PASS } = process.env;
const config = {};

config.ALLOWED_CORS = [
  "localhost:3000",
  "http://localhost:3000",
  "localhost:3001",
  "http://localhost:3001",
  "localhost:5000",
  "http://localhost:5000",
  "https://maximka76667.github.io",
  "maximka76667.github.io",
  "https://wdid-api-971815910885.europe-southwest1.run.app",
  "wdid-api-971815910885.europe-southwest1.run.app",
];
config.DEFAULT_ALLOWED_METHODS = "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS";
config.JWT_SECRET_DEV = "jwt-secret";
config.DB_URL = `mongodb+srv://${LOGIN}:${PASS}@what-did-i-do-db.8efg8.mongodb.net/?retryWrites=true&w=majority&appName=What-Did-I-Do-DB`;

module.exports = config;
