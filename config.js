const { LOGIN, PASSWORD } = process.env;
const config = {};

config.ALLOWED_CORS = [
  'localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'http://localhost:3001',
  'localhost:5000',
  'http://localhost:5000',
  'https://maximka76667.github.io',
  'maximka76667.github.io',
];
config.DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS';
config.JWT_SECRET_DEV = 'jwt-secret';
config.DB_URL = `mongodb+srv://${LOGIN}:${PASSWORD}@cluster0.vdazw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

module.exports = config;
