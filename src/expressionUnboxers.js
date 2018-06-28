import { debug } from './logger';
import { resolveArgs } from './resolver';
import { AExprKind } from './enums';

import {
  addParensToExpression,
  convertBoolop,
  remapOperator,
} from './expressionHelpers'
;

const unboxExpression = (parsedAExpr, depth = 0, resolveArgCb) => {
  switch (AExprKind.getByIndex(parsedAExpr.kind)) {
    case AExprKind.OP:
      return _parseAExprOp(parsedAExpr, depth, resolveArgCb)
    case AExprKind.IN:
      return _parseAExprIn(parsedAExpr, depth, resolveArgCb)
    default:
      return _parseAExprOp(parsedAExpr, depth, resolveArgCb)
  }
}

const _parseAExprOp = (parsedAExpr, depth, resolveArgCb) => {
  let operator =  parsedAExpr.name[0].String.str;
  let remappedOperator = remapOperator(operator);
  // If another layer of expression, wrap in parentheses
  let leftOpen, rightOpen, leftClose, rightClose;
  if (depth === 0 || getOpt('useTopLevelParens') === false) {
    [leftOpen, rightOpen, leftClose, rightClose] = addParensToExpression(parsedAExpr);
  }
  let lExpr = resolveArgCb(parsedAExpr.lexpr, depth);
  let rExpr = resolveArgCb(parsedAExpr.rexpr, depth);
  let operatorStr = `${leftOpen || ''}${lExpr}${leftClose || ''} ${remappedOperator} ${rightOpen || ''}${rExpr}${rightClose || ''}`
  return operatorStr
}

const _parseAExprIn = (parsedAExpr, depth, resolveArgCb) => {
  let lExpr = resolveArgCb(parsedAExpr.lexpr);
  let rExpr = resolveArgs(parsedAExpr.rexpr);
  let operatorStr = `${lExpr} IN (${rExpr.join(', ')})`
  return operatorStr
}

const unboxBoolExpr = (parsedBoolExpr, depth = 0, resolveArgCb) => {
  let op = convertBoolop(parsedBoolExpr.boolop);
  let exprList = [];
  for (let i = 0; i < parsedBoolExpr.args.length; i++) {
    exprList.push(resolveArgCb(parsedBoolExpr.args[i], depth++, resolveArgCb))
  }
  let outputStr = exprList.length > 1 ? exprList.join(op) : op.replace(' ', '') + exprList[0];
  if (depth > 2) {
    return `(${outputStr})`;
  }
  return `${outputStr}`;
}


export {
  unboxExpression,
  unboxBoolExpr,
}
