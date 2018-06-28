import { debug } from './logger';

const defaultOpts = {
  useColonCast: true,
  useTopLevelParens: false,
}

let opts;

const resetOpts = () => {
  opts = Object.assign({}, defaultOpts) 
}

const setOpt = (optname, value) => {
  if (Object.keys(opts).indexOf(optname) >= 0) {
    opts[optname] = value;
  } else {
    throw Error(`No such option ${optname}`)
  }
}

const getOpt = (optname) => {
  if (Object.keys(opts).indexOf(optname) >= 0) {
    return opts[optname];
  } else {
    throw Error(`No such option ${optname}`)
  }
}

resetOpts();

export {
  getOpt,
  resetOpts,
  setOpt,
}
