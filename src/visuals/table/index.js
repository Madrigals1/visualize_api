const puppeteer = require('puppeteer');

const { log, error, getUniquePath } = require('../../utils');

const { CHROMIUM_PATH } = require('../../constants');

const dictToHtml = (tableDict) => {
  // We only use first row of table to determine list of possible columns
  const firstRow = tableDict[0];
  const columns = Object.keys(firstRow);

  return `
<html lang="en">
  <head>
    <title>Title</title>
    <style>
      table {
        padding: 8px;
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      tr:nth-child(even) {
        background-color: #dddddd;
      }
    </style>
  </head>
  <body>
  
    <table>
      <tr>${columns.map((column) => `<th>${column}</th>`).join('')}</tr>
      ${tableDict.map((row) => (
    `<tr>${columns.map((column) => `<th>${row[column]}</th>`).join('')}</tr>`
  )).join('')}
    </table>
    
  </body>
</html>
  `;
};

const createTable = async (tableDict) => {
  // HTML version of table
  const content = dictToHtml(tableDict);

  // Generate unique path
  const uniquePath = getUniquePath({ prefix: 'table', extension: 'png' });

  try {
    // Set options for Puppeteer
    const options = CHROMIUM_PATH
      ? { args: ['--no-sandbox'], executablePath: CHROMIUM_PATH }
      : {};

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport({
      width: 960,
      height: 760,
      deviceScaleFactor: 1,
    });
    await page.setContent(content);
    await page.waitForSelector('table');
    const table = await page.$('table');
    await table.screenshot({ path: uniquePath.absolute });
    await browser.close();
    log(`Image was created at path ${uniquePath.absolute}`);
    return uniquePath.link;
  } catch (err) {
    error(`Image was NOT created at path ${uniquePath.absolute}, error: ${err}`);
    return false;
  }
};

module.exports = { createTable };
