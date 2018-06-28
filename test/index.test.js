// import chai from 'chai';
// 
// chai.should();
// 
// describe('linter', () => {
//   it('should handle `SELECT *` queries', () => {
//     parsed('SELECT * FROM table1').should.equal(
//     `SELECT *
//      FROM table1`
//     )
//   });
// 
//   it('should handle `SELECT *` queries with an alias', () => {
//     parsed('SELECT * FROM table1 t').should.equal(
//     `SELECT *
//      FROM table1 t`
//     )
//   });
// 
//   it('should handle `SELECT *` queries with a join', () => {
//     parsed('SELECT * FROM table1 t1 JOIN table2 t2 ON t1.id = t2.id').should.equal(
//     `SELECT *
//      FROM table1 t1
//      JOIN table2 t2
//      ON t1.id = t2.id`
//     )
//   });
// 
//   it('should handle subquery JOINs', () => {
//     parsed('SELECT * FROM table1 t1 JOIN (SELECT * FROM table t) t2 ON t1.id = t2.id').should.equal(
//       `SELECT *
//        FROM table1 t1
//        JOIN (
//          SELECT *
//          FROM table t
//        ) t2
//        ON t1.id = t2.id`
//     );
//   });
// 
//   it('should handle odd whitespace', () => {
//     const sql = `SELECT       1, * FROM      
//                   FROM table t1 
//                   
//                   JOIN table t2 USING(id)
//                 `
//     parsed(sql).should.equal(
//       `SELECT 1
//        , *
//        FROM table t1
//        JOIN table t2
//        USING(id)`
//     )
//   });
// 
//   it('should CTE queries', () => {
//     const sql = `WITH tmp AS (SELECT 1 + 1 UNION ALL SELECT 1) SELECT * FROM tmp`
//     parsed(sql).should.equal(
//       `WITH tmp AS (
//          SELECT 1 + 1
//          UNION ALL
//          SELECT 1
//        )
//        SELECT *
//        FROM tmp
//       `);
//     
//   })
// 
// })
