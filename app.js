const fs = require('fs');
const path = require('path');
const csv = require('csv-stream');
const csvjson = require('csvjson');
const through2Batch = require('through2-batch');

const pathSource = './data.csv';
const csvStream = csv.createStream({ delimiter: ',' });
const readStream = fs.createReadStream(pathSource);
let newData = [];

const saveNewData = (data) => {
  const newCsv = csvjson.toCSV(data, {
    delimiter : ',',
    headers: 'key'
  });

  fs.writeFile(path.join(__dirname, 'rezult.csv'), newCsv, (err) => {
      if (err) {
          console.warn("err", err);
      }
      console.log('newCsv has been saved!');
  });
};

readStream
  .pipe(csvStream)
  .pipe(through2Batch.obj({ batchSize: 1000 })) // 1000 items in one batch (10 items by default)
  .on('error', (err) => {
    console.error("err", err);
  })
  .on('header', (columns) => {
    console.log('columns', columns);
  })
  .on('data', async (rows) => {
    // outputs an array of objects containing a set of key/value pair representing a line found in the csv file.
    rows.forEach(row => {
      console.log('row', row);
    });

    newData = [...newData, rows];
  })
  .on('column', (key, value) => {
    // outputs the column name associated with the value found
  })
  .on('end', () => {
    console.info('End reading the file');
    saveNewData(newData);
  });
