import {Enum} from 'enumify';

class AExprKind extends Enum {}
// Lifted from the PG Source
// https://doxygen.postgresql.org/parsenodes_8h.html#a41cee9367d9d92ec6b4ee0bbc0df09fd
AExprKind.initEnum([
    'OP',                   /* normal operator */
    'OP_ANY',               /* scalar op ANY (array) */
    'OP_ALL',               /* scalar op ALL (array) */
    'DISTINCT',             /* IS DISTINCT FROM - name must be "=" */
    'NOT_DISTINCT',         /* IS NOT DISTINCT FROM - name must be "=" */
    'NULLIF',               /* NULLIF - name must be "=" */
    'OF',                   /* IS [NOT] OF - name must be "=" or "<>" */
    'IN',                   /* [NOT] IN - name must be "=" or "<>" */
    'LIKE',                 /* [NOT] LIKE - name must be "~~" or "!~~" */
    'ILIKE',                /* [NOT] ILIKE - name must be "~~*" or "!~~*" */
    'SIMILAR',              /* [NOT] SIMILAR - name must be "~" or "!~" */
    'BETWEEN',              /* name must be "BETWEEN" */
    'NOT_BETWEEN',          /* name must be "NOT BETWEEN" */
    'BETWEEN_SYM',          /* name must be "BETWEEN SYMMETRIC" */
    'NOT_BETWEEN_SYM',      /* name must be "NOT BETWEEN SYMMETRIC" */
    'PAREN',                /* nameless dummy node for parentheses */
]);

AExprKind.getByIndex = (idx) => {
  return AExprKind.enumValues[idx + 1]
}

export {
  AExprKind,
}
