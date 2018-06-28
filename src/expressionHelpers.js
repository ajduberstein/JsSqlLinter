const addParensToExpression = (parsedAExpr) => {
  const shouldAddLeftParens = parsedAExpr.lexpr.A_Expr;
  const shouldAddRightParens = parsedAExpr.rexpr.A_Expr;
  let [leftOpen, rightOpen, leftClose, rightClose] = ['', '', '', ''];
  if (shouldAddLeftParens) {
    [leftOpen, leftClose] = ['(', ')']
  }
  if (shouldAddRightParens) {
    [rightOpen, rightClose] = ['(', ')']
  }
  return [leftOpen, rightOpen, leftClose, rightClose]
}

const convertBoolop = (boolop) => {
  switch (boolop) {
    case 0:
      return ' AND '
    case 1:
      return ' OR '
    case 2:
      return ' NOT '
  }
}

const remapOperator = (operator) => {
  switch(operator) {
    case '<>':
      return '!='
    default:
      return operator
  }
}

export {
  addParensToExpression,
  convertBoolop,
  remapOperator,
}
