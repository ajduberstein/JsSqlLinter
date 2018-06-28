import { unboxConstant } from './commonUnboxers';
import { debug } from './logger';

import {
  resolveArg
} from './resolver';

const unboxCast = (castFunc, arg, useColonSyntax) => {
  // Argument to be cast to a new type
  let resolvedArg = resolveArg(arg);
  // Type to be cast to 
  // TODO maybe include the postgres-determined type
  let type = castFunc.typeName.TypeName.names;
  // A typeMod is the argument to a type, e.g., 64 in VARCHAR(64)
  let typeModStr = unboxTypMod(castFunc);
  let simpleType = mapToSimpleType(type);
  let castStr = _remapCasts(resolvedArg, simpleType, typeModStr, useColonSyntax)
  return castStr
}


const unboxTypMod = (castFunc) => {
  let typmod;
  try {
    let typeModConsts = [];
    let typeMods = castFunc.typeName.TypeName.typmods;
    let typeModConst, typeModStr;
    for (let i = 0; i < typeMods.length; i++) {
      typeModConst = typeMods[i].A_Const;
      typeModStr = unboxConstant(typeModConst);
      typeModConsts.push(typeModStr)
    }
    if (typeModConsts) {
      let argStr = typeModConsts.join(', ')
      return `(${argStr})`
    }
    return '';
  } catch(err) {
    debug(err, 'handler in unboxTypMod');
    return '';
  }
}


const mapToSimpleType = (complexType) => {
  /**
   * Remap nuanced type names of the Postgres compiler
   * to type names that are ANSI SQL-friendly
   */
  let typeAsChar;
  let hasSchema = complexType.length > 1;
  if (hasSchema) {
    let [schema, type] = complexType;
    typeAsChar = type.String.str;
  } else {
    typeAsChar = complexType[0].String.str;
  }
  switch (typeAsChar) {
    case 'int2':
      return 'SMALLINT'
    case 'int4':
      return 'INTEGER'
    case 'int8':
      return 'BIGINT'
    case 'float4':
      return 'real'
    case 'float8':
      return 'FLOAT'
    case 'bpchar':
      return 'CHAR'
    case 'bool':
      return 'BOOLEAN'
    default:
      return typeAsChar.toUpperCase()
  }
}

const _remapCasts = (resolvedArg, simpleType, typeModStr, useColonSyntax) => {
/**
 * The Postgres parser will take
 * constants like TRUE and remap them to 
 * CASE('t' AS BOOLEAN)
 */
  if (resolvedArg === 't' && simpleType === 'BOOLEAN') {
    return 'TRUE'
  } else if (resolvedArg === 'f' && simpleType === 'BOOLEAN') {
    return 'FALSE'
  } else if (simpleType === 'INTERVAL') {
    return `INTERVAL ${resolvedArg.toUpperCase()}`
  } else if (useColonSyntax) {
    return `${resolvedArg}::${simpleType}${typeModStr}`
  } else {
    return `CAST(${resolvedArg} AS ${simpleType}${typeModStr})`
  }
}

export {
  unboxCast
};
