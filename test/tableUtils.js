import PgQuery from 'pg-query-emscripten';
import { processSelectStmt } from '../src/selectStatementHandler';

const makeTestTable = (testObjectArray, singleTestDescription = null) => {
  /**
   * testObjectArray - Array of test objects to be created
   * singleTestDescription - filter to a single test with a particular description
   *                         No filtering if null
   */
  let testCases = []
  let testCase;
  for (const record of testObjectArray) {
    testCase = {
      description: record[0],
      input: record[1],
      expectation: record[2]
    };
    // If only running one test
    if (singleTestDescription && testCase.description === singleTestDescription) {
      testCases = []
      testCases.push(testCase)
      break
    }
    testCases.push(testCase);
  }
  return testCases;
}


const testSelect = (
  testTable,
  description,
  beforeCallback = null,
  beforeArgs = []) => {

  for (const testCase of testTable) {
    
    describe(description, () => {
    
      before(() => {
        if (beforeCallback) {
          beforeCallback(...beforeArgs)
        }
      });
  
      let selectStmt = PgQuery.parse(
        testCase.input
      ).parse_tree[0].SelectStmt;
    
      it(testCase.description, () => {
          processSelectStmt(
            selectStmt
          ).join('\n, ').should.equal(
            testCase.expectation
          )
        }
      )
    })
  }
}


export {
  makeTestTable,
  testSelect,
};
