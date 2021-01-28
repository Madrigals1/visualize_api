const dotenv = require('dotenv');

dotenv.config();

const { PORT, STATIC_URL, IS_DOCKER } = process.env;

const STATIC_FOLDER = '/var/www/static/vizapi';

module.exports = {
  PORT, STATIC_URL, STATIC_FOLDER, IS_DOCKER,
};
