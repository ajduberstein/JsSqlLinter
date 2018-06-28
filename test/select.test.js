import chai from 'chai';

import { makeTestTable, testSelect } from './tableUtils';

import { setOpt } from '../src/opts';

import { 
  COMPLEX_SQL_1,
  COMPLEX_SQL_1_ASSERTION,
  NESTED_CASE_ASSERTION,
  NESTED_CASE_INPUT,
} from './testingStrings';

chai.should();

let testFilter = null;

// Uncomment to filter to one test
testFilter = 'should be able to integrate these pieces for meaningful SQL'

const testTable = makeTestTable([
  // Handle siple selects
  [
    'Should be able to handle aliases',
    'SELECT 1, fn1 as fieldname1, fn2 as fieldname2',
    'SELECT 1\n, fn1 AS fieldname1\n, fn2 AS fieldname2',
  ],
  [
    'Should be able to select a field name',
    'SELECT     fieldname', 'SELECT fieldname',
  ],
  [
    'Should be able to handle multiple columns',
    'SELECT fn1, fn2    + fn3, fn3',
    'SELECT fn1\n, fn2 + fn3\n, fn3',
  ],
  // Simple functions and constants
  [
    'should handle DATE',
    `SELECT DATE('2016-01-02') FROM stuff`,
    `SELECT DATE('2016-01-02')`,
  ],
  [
    'should handle constant integer',
    'SELECT 1 FROM stuff',
    'SELECT 1',
  ],
  [
    'should handle multiple fields',
    'SELECT 1, 2 FROM stuff',
    `SELECT 1\n, 2`,
  ],
  // Arithmetic
  [
    'should handle arithmetic',
    'SELECT 1 + 2 * 3',
    'SELECT 1 + (2 * 3)',
  ],
  [
    'should handle parentheses in arithmetic expression',
    'SELECT (1 + 2) * 3 != 7',
    'SELECT ((1 + 2) * 3) != 7',
  ],
  [
    'should handle parentheses in arithmetic expression',
    'SELECT 2 ** ((1 + 2) * 3) != 7',
    'SELECT (2 ** ((1 + 2) * 3)) != 7',
  ],
  // CASTS
  [
    'should handle simple casts',
    `SELECT CAST('1' AS double precision)`,
    `SELECT CAST('1' AS FLOAT)`,
  ],
  [
    'should handle casts with arguments',
    `SELECT CAST('1' AS CHAR(36))`,
    `SELECT CAST('1' AS CHAR(36))`,
  ],
  [
    'should handle nested bools and needless parens',
    `SELECT (TRUE AND TRUE AND TRUE) OR ((NOT TRUE AND NULL) AND (TRUE AND FALSE)), (FALSE AND (TRUE AND FALSE) AND TRUE)`,
    `SELECT (TRUE AND TRUE AND TRUE) OR (NOT TRUE AND NULL AND (TRUE AND FALSE))\n, (FALSE AND (TRUE AND FALSE) AND TRUE)`,
  ],
  [
    'should handle conjoined bools',
    `SELECT true AND    TRUE`,
    `SELECT TRUE AND TRUE`,
  ],
  [
    'should handle nested casts',
    `SELECT CAST(CAST('1' AS FLOAT) AS INTEGER)`,
    `SELECT CAST(CAST('1' AS FLOAT) AS INTEGER)`,
  ],
  [
    'should handle even more nested casts',
    `SELECT CAST(CAST(CAST('1' as int4) as float) AS integer)`,
    `SELECT CAST(CAST(CAST('1' AS INTEGER) AS FLOAT) AS INTEGER)`,
  ],
  [
    'should handle date casts',
    `SELECT CAST('2017-07-04' aS TimestaMPTZ)`,
    `SELECT CAST('2017-07-04' AS TIMESTAMPTZ)`,
  ],
  [
    'should handle booleans',
    `SELECT (CAST('1' as boolean))`,
    `SELECT CAST('1' AS BOOLEAN)`,
  ],
  // casts with :: syntax
  [
    'should handle :: syntax',
    `SELECT '2017-07-04'::date`,
    `SELECT CAST('2017-07-04' AS DATE)`,
  ],
  // datetime tests
  [
    'should handle datetime conversions',
    `SELECT '2017-07-04' at time zone 'PDT'`,
    `SELECT '2017-07-04' AT TIME ZONE 'PDT'`,
  ],
  [
    'should handle datetime conversions with casts',
    `SELECT '2017-07-04 00:00:00'::timestamp at time zone 'PDT'`,
    `SELECT CAST('2017-07-04 00:00:00' AS TIMESTAMP) AT TIME ZONE 'PDT'`,
  ],
  // Case statements
  [
    'should handle CASE statement',
    'SELECT CASE WHEN TRUE THEN 1 ELSE 0 END',
    'SELECT CASE WHEN TRUE THEN 1 ELSE 0 END',
  ],
  [
    'should handle simple CASE statements',
    'SELECT CASE WHEN TRUE THEN 1 END',
    'SELECT CASE WHEN TRUE THEN 1 END',
  ],
  [
    'should not wrap short CASEs',
    `SELECT CASE WHEN TRUE = TRUE AND TRUE THEN (1 + 1001) * 1 ELSE 0 * andy END`,
    `SELECT CASE WHEN TRUE = TRUE AND TRUE THEN (1 + 1001) * 1 ELSE 0 * andy END`,
  ],
  [
     'should support multiple and nested case statements',
     NESTED_CASE_INPUT,
     NESTED_CASE_ASSERTION,
   ],
   [
     'support and clean boolean lists',
     'SELECT 1 IN (1,2,3) AS is_in_list',
     'SELECT 1 IN (1, 2, 3) AS is_in_list',
   ],
   [
     'should support aliases',
     'SELECT 1 "v1"',
     'SELECT 1 AS v1'
   ],
   [
     'should support nested select',
     'select (select (SELECT 1) AS inner) AS outer',
     'SELECT ('              + '\n' +
     '  SELECT ('            + '\n' +
     '    SELECT 1'          + '\n' +
     '  ) AS inner'          + '\n' +
     ') AS outer',
   ],
   [
     'should keep string aliases unchanged',
     'select fieldname "This is one"',
     'SELECT fieldname AS "This is one"',
   ],
   [
      "should be able to integrate these pieces for meaningful SQL",
      COMPLEX_SQL_1,
      COMPLEX_SQL_1_ASSERTION,
   ],
], testFilter);

const colonTest = makeTestTable([
  // Simple functions and constants
  [
    'should handle datetime conversions with casts',
    `SELECT '2017-07-04 00:00:00'::timestamp at time zone 'PDT'`,
    `SELECT '2017-07-04 00:00:00'::TIMESTAMP AT TIME ZONE 'PDT'`,
  ],
  [
    'handle simple colon cast',
    `SELECT CAST('42' AS int)`,
    `SELECT '42'::INTEGER`,
  ],
  [
    'should handle nested casts',
    `SELECT CAST(CAST('42' AS int) AS varchar)`,
    `SELECT '42'::INTEGER::VARCHAR`,
  ],
  [
    'should handle casts, nested functions in tandem',
    `SELECT 2 ** ((1 + 2) * DATE_TRUNC('HOUR', 3::DATE)) != 7, 1::timestamp, 1`,
    `SELECT (2 ** ((1 + 2) * DATE_TRUNC('HOUR', 3::DATE))) != 7\n, 1::TIMESTAMP\n, 1`,
  ],
], testFilter);


// testSelect(
//   colonTest,
//   'Test fields and functions with colons',
//   setOpt,
//   ['useColonCast', true]
// )
// 
testSelect(
  testTable,
  'Test fields and functions',
  setOpt,
  ['useColonCast', false]
)
