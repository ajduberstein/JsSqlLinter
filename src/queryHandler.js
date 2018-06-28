import PgQuery from 'pg-query-emscripten';
import { debug } from './logger';

const validateSyntax = (input) => {
  let res = PgQuery.parse(
    input
  )
  if (res.error) {
    debug(res.error.message)
  }
  return res.parse_tree.length > 0
}

const getParseTree = (input) => {
  let res = PgQuery.parse(
    input
  )
  if (res.error) {
    debug(res.error.message)
  }
  return res.parse_tree
}


export {
  validateSyntax,
  getParseTree,
};
