import PgQuery from 'pg-query-emscripten';
import { processSelectStmt } from './selectStatementHandler';

const INPUT = 'select CASE when true THEN 0 ELSE 2 END'
 
let selectStmt = PgQuery.parse(
  INPUT
).parse_tree[0].SelectStmt;
 

console.log(processSelectStmt(selectStmt))
