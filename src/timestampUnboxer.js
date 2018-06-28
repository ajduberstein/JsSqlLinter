import { debug } from './logger';
import { resolveArgs } from './resolver';

const unboxTimezoneFunc = (parsedFuncCall) => {
  let args = parsedFuncCall.args;
  let resolvedArgs = resolveArgs(args);
  let [tz, ts] = resolvedArgs;
  return `${ts} AT TIME ZONE ${tz}`
}

export {
  unboxTimezoneFunc,
}
