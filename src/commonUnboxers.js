import { debug } from './logger';

const unboxConstant = (aConst) => {
  /* 
   * 
   */
    let val, ival;
    let k = aConst.val;
    val = k.Integer || k.String || k.Float;
    if (typeof val === undefined) {
      debug('No recognized type for constant', val)
      return
    }
    let key = Object.keys(k)[0]
    switch (key) {
      case 'Float':
        return val.str
      case 'Integer':
        return val.ival
      case 'String':
        return `'${val.str}'`
      case 'Null':
        return `NULL`
      default:
        debug(aConst, 'Error unboxing value')
        return ''
    }
}

export {
  unboxConstant,
};
