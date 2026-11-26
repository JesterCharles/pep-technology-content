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
predict:{correct:'b',
 job:'counts like these are how teams check data quality, for example how many products have no supplier. Counting the wrong thing gives a number that looks fine and is wrong.',
 why:{a:'COUNT(instructor_id) skips the NULL instructor_id of Web Basics.',b:'COUNT(*) counts all five rows; COUNT(instructor_id) counts the four values that are not NULL.',c:'COUNT(*) counts every row, even one with a NULL in some column.',d:'a column count can never be bigger than the row count; the two meanings are swapped.'}},
sql:{
2:{file:'student-counts.sql',goals:['values','forms'],starter:'-- Count every student and then only known city values.\n\n',
  fallback:'Write one aggregate SELECT over students that returns student_count with COUNT(*) and known_city_count with COUNT(city).',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res);
    if(H.sameList(rows,[['6','4']])){done.values=true;}
    else if(rows.length>1){notes.push('Output has '+rows.length+' rows, so the query lists students instead of counting them. Put COUNT around what you count, as in the example, so the result is one row.');}
    else if(H.sameList(rows,[['6','6']])||H.sameList(rows,[['4','4']])){notes.push('Both numbers are the same, so both COUNTs count the same thing. Use * in the first COUNT and city in the second.');}
    else{notes.push('The one result row should show 6 students and 4 known cities.');}
    var counts=H.calls(o.st.items,'count'),fromStudents=(o.st.from||[]).some(function(f){return f.name==='students';});
    if(done.values&&!(fromStudents&&counts.some(function(c){return c.star;})&&counts.some(function(c){return !c.star&&c.args.length===1&&c.args[0].col==='city';}))){done.values=false;notes.push('Compute both numbers from students: COUNT(*) for all rows and COUNT(city) for known cities.');}
    if(done.values&&H.sameList(o.res.cols,['student_count','known_city_count'])){done.forms=true;}
    else if(done.values){near=true;notes.push('Your counts are right. In your SELECT line, name them with AS: student_count, then known_city_count.');}
    return {done:done,notes:notes,near:near};}},
3:{file:'fee-summary.sql',goals:['values','functions'],starter:'-- Summarize the known course fees in one row.\n\n',
  fallback:'Write one SELECT over courses with SUM, AVG, MIN and MAX of fee, named total_fee, average_fee, lowest_fee and highest_fee.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res);
    if(H.sameList(rows,[['440.00','110.0000000000000000','80.00','150.00']])){done.values=true;}
    else if(rows.length===1&&rows[0].length===4){notes.push('Compare each number with the four known fees: 120.00, 150.00, 80.00 and 90.00. Check that each function reads fee, in the order total, average, lowest, highest.');}
    else{notes.push('The summary should be one row of four values computed from the four known fees; NULL is not zero.');}
    if(done.values&&!H.sameList(o.res.cols,['total_fee','average_fee','lowest_fee','highest_fee'])){done.values=false;near=true;notes.push('Your numbers are right. In your SELECT line, name the four results with AS: total_fee, average_fee, lowest_fee and highest_fee.');}
    var overFee=['sum','avg','min','max'].every(function(f){return H.calls(o.st.items,f).some(function(c){return c.args.length===1&&c.args[0].col==='fee';});})&&(o.st.from||[]).some(function(f){return f.name==='courses';});
    if(done.values&&overFee){done.functions=true;}
    else if(done.values){near=true;notes.push('Your numbers match; compute them from courses with SUM, AVG, MIN and MAX over fee.');}
    return {done:done,notes:notes,near:near};}}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>The decimal <code>100.0</code> keeps the division from dropping the fraction: 4 known cities out of 6 students is about 66.7. On an empty table both counts are 0 and the division fails; wrapping the bottom count as <code>NULLIF(COUNT(*), 0)</code>, which turns a 0 into NULL, makes the answer NULL instead.</p>',
  why:{a:'both counts are the same, so this is always 100 when rows exist; it never looks at city.',b:'100.0 makes the arithmetic keep decimals; known cities over all students gives about 66.7.',c:'COUNT returns a whole number, so 4 / 6 drops the fraction to 0 before the multiply: the result is 0.',d:'the ratio is upside down, about 150, so it can go above 100.'},
  miss:{a:'This never looks at city.',c:'Whole-number division drops the fraction; bring in a decimal before dividing.',d:'The ratio is upside down.'},
  hint:'COUNT returns a whole number: bring a decimal into the calculation before the division, and put the count of the column that can be NULL on top.'},
B:{fs:'apply-b',correct:'c',reveal:'With three rows that are all NULL, <code>COUNT(*)</code> is 3 while <code>SUM(amount)</code> is NULL.',
  why:{a:'COUNT(*) still counts the three rows.',b:'SUM of no values that are not NULL is NULL, not zero.',c:'COUNT(*) counts rows; SUM skips NULL values and has nothing to add.',d:'COUNT(amount) skips all three NULL values, so it is 0.'}}}};
/* /sql-practice page data */
