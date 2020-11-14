const restana = require('restana');
const bodyParser = require('body-parser');

const app = restana();
const { PORT } = require('./constants');

const { log } = require('./utils');
const { createTable, createStaticFolder } = require('./visuals/table');

app.use(bodyParser.json());

// Create static folder
createStaticFolder();

app.post('/table', async (req, res) => {
  // Get table dict from request body
  const { table } = req.body;

  // Get image of png table
  const tableImageLink = await createTable(table);

  // Send link or error
  const data = tableImageLink ? { link: tableImageLink } : { failure: 'Error on the server!' };

  // Send back data
  res.send(data);
});

app.start(PORT).then(() => log(`App is running on port ${PORT}`));
