import {
  validateSyntax,
  getParseTree,
} from '../src/queryHandler';

import chai from 'chai';
chai.should();

describe('validateSyntax', () => {
  it('should validate SQL queries', () => {
    validateSyntax('SELECT * FROM table1').should.equal(true)
  });
  it('should validate SQL queries', () => {
    validateSyntax('SELECT * ROM'
    ).should.equal(false)
  });
})

describe('getParseTree', () => {
  it('should should extract a parse tree', () => {
    (getParseTree('SELECT * FROM table1')[0].SelectStmt).should.be.an('Object')
  });
})
