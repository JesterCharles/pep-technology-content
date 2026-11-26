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
 job:'<code>= NULL</code> is a classic reason a report or a filter quietly returns nothing. When you see it in a query, the fix is <code>IS NULL</code>.',
 why:{a:'= with NULL is never true, even when the stored value is NULL.',b:'two missing values are not equal under =; the comparison gives unknown.',c:'<code>city = NULL</code> gives unknown for every row, and WHERE keeps only rows where its condition is true.',d:'the query is allowed; its condition is unknown rather than an ERROR.'}},
sql:{
2:{file:'student-cities.sql',goals:['rows','coalesce'],starter:'-- Show every student; replace a missing city only in the result.\n\n',
  fallback:'Write a SELECT that shows student_id, name and city_label, using COALESCE so a missing city reads Not recorded, sorted by student_id.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res),want=[['1','Ana','Leeds'],['2','Ben','York'],['3','Chen','Not recorded'],['4','Dina','Leeds'],['5','Eli','Bristol'],['6','Femi','Not recorded']];
    var hasCo=H.calls(o.st.items,'coalesce').some(function(c){return c.args.length>=2&&c.args[0].col==='city';});
    if(H.sameList(rows,want)){done.rows=true;}
    else if(rows.length<6&&rows.length>0){notes.push('Some students are missing. Every student should appear; COALESCE belongs in the SELECT list, and the query needs no WHERE.');}
    else if(rows.length===6&&rows.some(function(r){return r[2]===null;})){notes.push('Chen and Femi still show NULL. In your SELECT line, wrap city in COALESCE with the text Not recorded as its second value.');}
    else if(rows.length===6&&H.sameSet(rows,want)){near=true;notes.push('Your rows are right but not in student_id order. Add ORDER BY student_id at the end.');}
    else{notes.push('All six students should appear, with Not recorded only for Chen and Femi. Check the spelling and capitals of Not recorded inside the quotes.');}
    if(done.rows&&!H.sameList(o.res.cols,['student_id','name','city_label'])){done.rows=false;near=true;notes.push('Your rows are right. In your SELECT line, name the COALESCE column with AS city_label.');}
    if(done.rows&&hasCo){done.coalesce=true;}
    else if(done.rows){near=true;notes.push('Your rows are right; produce city_label with COALESCE(city, ...) so the fallback comes from COALESCE.');}
    return {done:done,notes:notes,near:near};}},
3:{file:'course-fees.sql',goals:['labels','case'],starter:'-- Derive fee_band with CASE; do not update the table.\n\n',
  fallback:'Write a SELECT that shows course_id, title and fee_band with CASE (Not priced, Premium at 100 or more, otherwise Standard), sorted by course_id.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res),want=[['101','SQL Basics','Premium'],['102','Java Foundations','Premium'],['103','Data Modeling','Not priced'],['104','Web Basics','Standard'],['105','Intro to Testing','Standard']];
    if(H.sameList(rows,want)){done.labels=true;}
    else if(rows.length===5&&rows[2]&&rows[2][0]==='103'&&rows[2][2]==='Standard'){notes.push('Data Modeling reads Standard: its NULL fee skipped every comparison and fell through to ELSE. Give NULL a branch of its own, placed first in your CASE.');}
    else if(rows.length===5&&H.sameSet(rows,want)){near=true;notes.push('Your labels are right but not in course_id order. Add ORDER BY course_id at the end.');}
    else{notes.push('Compare the five labels in Output with the three rules in the task, and check the spelling of each label inside its quotes.');}
    if(done.labels&&!H.sameList(o.res.cols,['course_id','title','fee_band'])){done.labels=false;near=true;notes.push('Your labels are right. In your SELECT line, name the CASE column with END AS fee_band.');}
    var nullBranch=H.nodes(o.st.items,function(x){return x.op==='case'&&(x.whens||[]).some(function(w){return H.nodes(w.w,function(y){return y.op==='isnull'&&y.a&&y.a.col==='fee';}).length>0;});}).length>0;
    if(done.labels&&nullBranch){done.case=true;}
    else if(done.labels){near=true;notes.push('Your labels match; derive fee_band with a CASE that has its own WHEN fee IS NULL branch.');}
    return {done:done,notes:notes,near:near};}}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>IS NOT NULL tests for a present value directly; <code>&lt;&gt; NULL</code> and <code>NOT (city = NULL)</code> are unknown for every row.</p>',
  why:{a:'not-equal with NULL is unknown for every row, even Leeds, so WHERE keeps no students.',b:'IS NOT NULL is true for the four students with a city and false for Chen and Femi.',c:'this keeps the opposite rows: Chen and Femi, whose city is missing.',d:'<code>city = NULL</code> is unknown, and NOT of unknown is still unknown, so WHERE keeps no students.'},
  miss:{a:'Not-equal with NULL is unknown too; a present value has its own test.',c:'IS NULL finds the missing cities; the report wants the recorded ones.',d:'NOT of an unknown comparison is still unknown.'},
  hint:'Any ordinary comparison with NULL is unknown; test for a present value with the IS form.'},
B:{fs:'apply-b',correct:'b',reveal:'<code>fee IS NOT NULL</code> keeps exactly the four priced courses; <code>fee &lt;&gt; NULL</code> keeps none.',
  why:{a:'not-equal with NULL is unknown for every row, so no course is kept.',b:'IS NOT NULL is true for the four courses with a fee and false for course 103.',c:'this keeps only course 103, the one course without a fee.',d:'one side is true for every row, so all five courses come back, including unpriced 103.'}}}};
/* /sql-practice page data */
