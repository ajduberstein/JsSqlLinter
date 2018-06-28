import {
  resolveArg
} from './resolver';

import {
  debug
} from './logger';

const TAB = '  '

const processSelectStmt = (
  selectStmt,
  depth = 0
) => {
  let output = [];
  let targets = selectStmt.targetList;
  let fromClause = selectStmt.fromClause;
  let field, valString, fieldNameString, isFirst;
  for (let i = 0; i < targets.length; i++) {
    isFirst = i === 0;
    fieldNameString = targets[i].ResTarget.name || '';
    field = resolveArg(targets[i].ResTarget.val);
    valString = ''
    if (isFirst) {
      valString = `SELECT ${field}`
    } else {
      valString = `${field}`
    }
    if (fieldNameString !== '') {
      if (fieldNameString.indexOf(' ') > 0) {
        fieldNameString = `"${fieldNameString}"`
      }
      fieldNameString = ` AS ${fieldNameString}`
    }
    if (depth > 0) {
      let tab = TAB.repeat(depth)
      let endTab = tab.replace(TAB, '')
      valString = `(\n` + tab + valString + '\n'
      valString = valString.trim() + fieldNameString + `\n${endTab})`
      output.push(valString)
    } else {
      output.push(valString + fieldNameString)
    }
  }
  return output
}

export {
  processSelectStmt
}
