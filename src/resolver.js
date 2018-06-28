import { debug } from './logger';
import {
  unboxConstant,
} from './commonUnboxers';

import {
  unboxCast,
} from './castFuncUnboxer';

import {
  unboxExpression,
  unboxBoolExpr,
} from './expressionUnboxers';

import {
  unboxCase,
} from './caseUnboxer';

import { 
  getOpt
} from './opts';

import {
  processSelectStmt
} from './selectStatementHandler'

import { unboxTimezoneFunc } from './timestampUnboxer'

// Everything atomic gets its own unboxer
// Everything else kind of has to go here, unless I want to
// give resolveArg as a callback function

/**
 *  This is an example arg object
 *  The top-level key is the argument's parsed type
 *  The second-level keys are `val` (the type and value) and location
 * 
 *  {
 *    "A_Const": {
 *      "val": {
 *        "String": {
 *          "str": "PDT"
 *        }
 *      },
 *      "location": 33
 *    }
 *  }
 *
 */

let selectDepth = 0;

const resolveArg = (arg, depth = 0) => {
  /**
   * Resolve an argument that could be any type
   * to be a string
   *
   * arg - argument to be resolved
   */
  if (!arg) return
  let key = Object.keys(arg)[0];
  switch (key) {
    case 'A_Const':
      return unboxConstant(arg[key])
    case 'A_Expr':
      return unboxExpression(arg[key], depth, resolveArg)
    case 'BoolExpr':
      return unboxBoolExpr(arg[key], depth, resolveArg)
    case 'CaseExpr':
      return unboxCase(arg[key], depth, resolveArg)
    case 'ColumnRef':
      return unboxColumnRef(arg[key])
    case 'FuncCall':
      return unboxFunc(arg[key])
    case 'TypeCast':
      return unboxCast(
        arg[key], arg[key].arg, getOpt('useColonCast')
      )
    case 'SubLink':
      selectDepth++
      return processSelectStmt(
        arg[key].subselect.SelectStmt, selectDepth
      )
    // TODO
    // window statements
    // with statements
    default:
      return resolveArg(arg[key], ++depth)
  }
}

const resolveArgs = (args) => {
  let resolvedArgs = [];
  let resolved;
  for (let arg of args) {
    resolved = resolveArg(arg);
    resolvedArgs.push(resolved)
  }
  return resolvedArgs;
}

const unboxColumnRef = (colRef) => {
  return colRef.fields[0].String.str
}

const _isTimeZoneCast = (parsedFuncCall) => {
  try {
    return parsedFuncCall.funcname[1].String.str == 'timezone'
  } catch (err) {
    return false
  }
}


const unboxFunc = (parsedFuncCall) => {
  if (_isTimeZoneCast(parsedFuncCall)) {
    return unboxTimezoneFunc(parsedFuncCall)
  }
  let funcName = parsedFuncCall.funcname[0].String.str.toUpperCase();
  let funcArgs = []
  if (parsedFuncCall.args) {
    funcArgs = resolveArgs(parsedFuncCall.args);
  }
  let strArgs = funcArgs.join(', ')
  let cleanedFunc = `${funcName}(${strArgs})`
  debug(cleanedFunc, 'cleaned')
  return cleanedFunc;
}


const getLocationFromArg = (arg) => {
  /**
   * Return location from arg
   */
  let argKey = Object.keys(arg)[0];
  return arg[argKey].location
}


const resolveArgsWithLocation = (args) => {
  let parsedArgsDict = {}
  for (let arg of args) {
    let argIdx = getLocationFromArg(arg)
    parsedArgsDict[argIdx] = resolveArg(arg);
  }
  return parsedArgsDict
}


export {
  resolveArg,
  resolveArgs,
  resolveArgsWithLocation,
}
