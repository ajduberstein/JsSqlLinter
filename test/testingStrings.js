let NESTED_CASE_ASSERTION = "" + 
"SELECT CASE WHEN hella_long_boolean THEN 1 ELSE 0 END AS flag" +
"\n, CASE WHEN 1 > var THEN 2 WHEN meh THEN 3" +
"\n   ELSE CASE WHEN TRUE THEN fiiiiiieeeeeeeeeeeld END" +
"\nEND AS nested_case"
;

let NESTED_CASE_INPUT = "" +
"SELECT CASE WHEN hella_long_boolean THEN 1 ELSE 0 END" +
" AS flag," +
" CASE WHEN 1 > var THEN 2" +
" WHEN meh THEN 3 ELSE CASE WHEN" + 
" TRUE THEN fiiiiiieeeeeeeeeeeld END END AS nested_case"
;

let COMPLEX_SQL_1 = "" + 
"SELECT en.message_id, " +
"COALESCE(sp.message, en.message) fieldname" +
", COALESCE(CASE WHEN boolean + 1 > 0 THEN other WHEN more THEN 1 ELSE " +
" 'chaos is a ladder' END) AS other_field" +
", (SELECT NOW() - INTERVAL '2 weeks' AS two_weeks_ago) AS two_weeks_prior"
;

let COMPLEX_SQL_1_ASSERTION = "" + 
"SELECT en.message_id" + 
"\n, COALESCE(sp.message, en.message)"
;


export {
  NESTED_CASE_ASSERTION,
  NESTED_CASE_INPUT,
  COMPLEX_SQL_1,
  COMPLEX_SQL_1_ASSERTION,
}
