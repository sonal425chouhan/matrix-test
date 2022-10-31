const csv = require('csv-stream'); //to read input CSV File
const fs = require('node:fs'); //to output file
const { format } = require('@fast-csv/format');

var options = {
  delimiter : '"', // default is ,
  endLine : '\n', // default is \n,
  columns : ["id", "json"], // by default read the first line and use values found as columns
};

const csvStream = csv.createStream(options);
const outputCsvStream = format({ headers: ['id', 'json', 'is_valid'] });
outputCsvStream.pipe(process.stdout).on('end', () => process.exit());

readCSVFile();

function readCSVFile() {
  const inputFileName = process.argv[2];
  let currentId;

  fs.createReadStream(inputFileName).pipe(csvStream)
  .on('error',function(err) {
    console.error(err);
  })
  .on('column',function(key, value) {
    // outputs the column name associated with the value found
    if(key == 'id') currentId = value;

    if(key == 'json') {
      let arr = value.substring(1, value.length -1).split(',');
      arr = arr.map(el=> ~~el);

      const rows = Math.sqrt(arr.length);

      value = create2Darray(arr, rows);
      value = value.length ? rotateMatrix(rows, value) : value;

      //print to the screen
      const isValid = value.length > 0;
      outputCsvStream.write([currentId, JSON.stringify(value), isValid]);
    }
  })
  .on('end', function() {
    outputCsvStream.end();
  });
}

function create2Darray(A, rows) {
  var arr = [];

  if(rows % 1 == 0) {
    for (var i = 0; i < rows; i++) {
      arr[i] = [];
      for (var j = 0; j < rows; j++) {
        arr[i][j] = A[i * rows + j];
      }
    }
  }
  return arr;
}

function rotateMatrix(rows, mat)
{
  let [m, n, row, col, rotatedMatrix, prev, curr] = [rows, rows, 0, 0, []];

  while (row < m && col < n)
  {
    if (row + 1 == m || col + 1 == n)
      break;
    // Store the first element of next
    // row, this element will replace
    // first element of current row
    prev = mat[row + 1][col];
    // Move elements of first row
    // from the remaining rows
    for(let i = col; i < n; i++)
    {
      curr = mat[row][i];
      mat[row][i] = prev;
      prev = curr;
    }
    row++;
    // Move elements of last column
    // from the remaining columns
    for(let i = row; i < m; i++)
    {
      curr = mat[i][n - 1];
      mat[i][n - 1] = prev;
      prev = curr;
    }
    n--;
    // Move elements of last row
    // from the remaining rows
    if (row < m)
    {
      for(let i = n - 1; i >= col; i--)
      {
        curr = mat[m - 1][i];
        mat[m - 1][i] = prev;
        prev = curr;
      }
    }
    m--;
    // Move elements of first column
    // from the remaining rows
    if (col < n)
    {
      for(let i = m - 1; i >= row; i--)
      {
        curr = mat[i][col];
        mat[i][col] = prev;
        prev = curr;
      }
    }
    col++;
  }

  //rotated matrix
  for(let i = 0; i < rows; i++)
  {
    for(let j = 0; j < rows; j++) {
      rotatedMatrix.push(mat[i][j]);
    }
  }
  return rotatedMatrix;
}

module.exports = {
 create2Darray,
 rotateMatrix,
};
