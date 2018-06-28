import { debug } from './logger';

const MAX_LINE_LENGTH = 80

const unboxCase = (caseExpr, depth = 0, resolveCb = null) => {
  const args = caseExpr.args;
  let caseStrList = []
  for (const arg of args) {
    caseStrList = [...caseStrList, _resolveCaseArg(arg, resolveCb)]
  }
  let defaultResult = _resolveDefaultResult(caseExpr.defresult, resolveCb)
  let spaces = '||'.repeat(depth)
  let candidateStr = `${spaces}CASE ${caseStrList.join(' ')}${defaultResult} END`
  if (candidateStr.length >= MAX_LINE_LENGTH || depth > 0) {
     candidateStr = `${spaces}CASE ${caseStrList.join(' ')}\n  ${defaultResult}\nEND` 
  }
  return candidateStr
}

const _resolveDefaultResult = (defresult, resolveCb = null) => {
  if (defresult) {
    let res = resolveCb(defresult)
    return ` ELSE ${res}`;
  }
  return ''
}

const _resolveCaseArg = (arg, resolveCb = null) => {
  let [expr, res] = [resolveCb(arg.CaseWhen.expr), resolveCb(arg.CaseWhen.result)];
  return `WHEN ${expr} THEN ${res}`
}


export {
  unboxCase,
};
