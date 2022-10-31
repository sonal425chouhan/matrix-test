process.argv[2] = 'input.csv';

const { create2Darray, rotateMatrix } = require('./index');
const csv = require('csv-stream');
const fs = require('node:fs');

describe('create2Darray', function() {
  it('should return 2D array if the array is invalid', function() {
    const sqrt = Math.sqrt(2);
    expect(create2Darray([2, -0], sqrt)).toEqual([]);
  });

  it('should return 2D array if the array is valid', function() {
    expect(create2Darray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  });
});

describe('rotateMatrix', function() {
  it('should rotate the matrix', function() {
    expect(rotateMatrix(3, [[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toEqual([4, 1, 2, 7, 5, 3, 8, 9, 6]);
  });
});

