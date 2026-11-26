/* sql-practice@1 page data */
var SQL_TABLES={tables:[
{name:'instructors',cols:[{name:'instructor_id',type:'int',notnull:true,pk:true},{name:'name',type:'text',notnull:true},{name:'lead_id',type:'int'}],
 keys:[{name:'instructors_pkey',cols:['instructor_id']}],fks:[{name:'instructors_lead_id_fkey',col:'lead_id',table:'instructors',ref:'instructor_id'}],
 rows:[[1,'Mara',null],[2,'Tomas',1],[3,'Priya',1],[4,'Ken',2]]},
{name:'courses',cols:[{name:'course_id',type:'int',notnull:true,pk:true},{name:'title',type:'text',notnull:true},{name:'credits',type:'int',notnull:true},{name:'fee',type:'num',precision:6,scale:2},{name:'instructor_id',type:'int'}],
 keys:[{name:'courses_pkey',cols:['course_id']}],fks:[{name:'courses_instructor_id_fkey',col:'instructor_id',table:'instructors',ref:'instructor_id'}],
 rows:[[101,'SQL Basics',3,{dec:'120.00'},2],[102,'Java Foundations',4,{dec:'150.00'},3],[103,'Data Modeling',3,null,3],[104,'Web Basics',2,{dec:'80.00'},null],[105,'Intro to Testing',2,{dec:'90.00'},4]]},
{name:'students',cols:[{name:'student_id',type:'int',notnull:true,pk:true},{name:'name',type:'text',notnull:true},{name:'email',type:'text',notnull:true},{name:'city',type:'text'}],
 keys:[{name:'students_pkey',cols:['student_id']},{name:'students_email_key',cols:['email']}],fks:[],
 rows:[[1,'Ana','ana@example.com','Leeds'],[2,'Ben','ben@example.com','York'],[3,'Chen','chen@example.com',null],[4,'Dina','dina@example.com','Leeds'],[5,'Eli','eli@example.com','Bristol'],[6,'Femi','femi@example.com',null]]},
{name:'enrollments',cols:[{name:'student_id',type:'int',notnull:true},{name:'course_id',type:'int',notnull:true},{name:'grade',type:'int'}],
 keys:[{name:'enrollments_pkey',cols:['student_id','course_id']}],fks:[{name:'enrollments_student_id_fkey',col:'student_id',table:'students',ref:'student_id'},{name:'enrollments_course_id_fkey',col:'course_id',table:'courses',ref:'course_id'}],
 rows:[[1,101,82],[1,102,null],[2,101,67],[2,103,74],[3,101,null],[3,102,58],[4,102,91],[4,103,null],[5,101,45]]}
]};
var STUDENTS0=[['1','Ana','ana@example.com','Leeds'],['2','Ben','ben@example.com','York'],['3','Chen','chen@example.com',null],['4','Dina','dina@example.com','Leeds'],['5','Eli','eli@example.com','Bristol'],['6','Femi','femi@example.com',null]];
var TOPIC={
predict:{correct:'c',
 job:'you will meet this ERROR while writing report queries. It always means the same thing: a selected column must be added to GROUP BY or put inside an aggregate.',
 why:{a:'PostgreSQL does not pick a value at random for a column that is not grouped.',b:'COUNT does not join text together; nothing combines the names automatically.',c:'name is neither grouped nor inside an aggregate, and one city group can hold several names.',d:'adding a column that is not allowed does not cancel GROUP BY; the query stops with an ERROR.'}},
sql:{
2:{file:'students-by-city.sql',goals:['groups','counts'],starter:'-- This query stops with an ERROR. Fix it: one row per city, with city and student_count.\nSELECT city, name, COUNT(*) FROM students GROUP BY city;\n',
  starterNote:'That is still the starting query, which stops with an ERROR because <code>name</code> is neither grouped nor inside an aggregate. Change the SELECT list, then press <em>Run</em>.',
  fallback:'Fix the starting query so it returns city and student_count for each city group, sorted by city with the NULL group last.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res),want=[['Bristol','1'],['Leeds','2'],['York','1'],[null,'2']];
    if(H.sameList(rows,want)){done.groups=true;}
    else if(rows.length===4&&H.sameSet(rows,want)){near=true;notes.push('Your groups and counts are right, but the order is not. '+((o.st.order||[]).length?'In your ORDER BY line, sort by city only, low to high, so the NULL group comes last.':'Add an ORDER BY city line at the end, so the cities come in order with the NULL group last.'));}
    else if(rows.length===6){notes.push('Output has one row per student, not per city. Add GROUP BY city, and make sure every other selected value is inside COUNT.');}
    else{notes.push('Expect one row each for Bristol, Leeds and York, and one for the NULL city group.');}
    if(done.groups&&H.sameList(o.res.cols,['city','student_count'])){done.counts=true;}
    else if(done.groups){near=true;notes.push('Your groups are right. In your SELECT line, name the count column with AS student_count.');}
    return {done:done,notes:notes,near:near};}},
3:{file:'busy-courses.sql',goals:['groups','having'],starter:'-- Group enrollments by course, then keep groups of at least 3.\n\n',
  fallback:'Write a grouped SELECT over enrollments that returns course_id and enrollment_count and keeps only groups with at least three rows.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res);
    if(H.sameList(rows,[['101','4'],['102','3']])){done.groups=true;}
    else if(rows.length===3&&H.sameSet(rows.slice(0,2),[['101','4'],['102','3']])){notes.push('Course 103, with only 2 enrollments, is still in the result. Keep only groups whose COUNT(*) is at least 3, with HAVING after GROUP BY.');}
    else{notes.push('Courses 101 and 102 are the only groups with at least three enrollments.');}
    if(done.groups&&!H.sameList(o.res.cols,['course_id','enrollment_count'])){done.groups=false;near=true;notes.push('Your groups are right. In your SELECT line, name the count with AS enrollment_count.');}
    if(done.groups&&(o.st.group||[]).length&&H.nodes(o.st.having,function(x){return x.op==='call'&&x.agg;}).length){done.having=true;if(!(o.st.order||[]).length){notes.push('Tip: add ORDER BY course_id at the end. These rows happen to come out in order here, but without ORDER BY PostgreSQL does not promise it.');}}
    else if(done.groups){near=true;notes.push('Your groups match, but the count condition must sit in HAVING after GROUP BY, not in WHERE.');}
    return {done:done,notes:notes,near:near};}}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>HAVING is the filter that runs after grouping, so it can test the count.</p>',
  why:{a:'WHERE runs before grouping, so COUNT(*) is not available there.',b:'GROUP BY forms city groups, then HAVING keeps the groups whose count is at least 2.',c:'city is selected without GROUP BY, so there is no group for it to name.',d:'GROUP BY needs the column to group on, here city, not a test of an aggregate.'},
  miss:{a:'COUNT(*) is not available to WHERE.',c:'The selected city needs GROUP BY city.',d:'Group by city, not by a test of an aggregate.'},
  hint:'Form the city groups first, then put the count condition after GROUP BY.'},
B:{fs:'apply-b',correct:'b',reveal:'With <code>GROUP BY course_id</code>, select <code>course_id</code> and aggregates such as <code>COUNT(*)</code>.',
  why:{a:'student_id is neither grouped nor inside an aggregate.',b:'course_id names each group and COUNT(*) sums it up.',c:'student_id is not the grouping column.',d:'grade is neither grouped nor inside an aggregate.'}}}};
/* /sql-practice page data */
