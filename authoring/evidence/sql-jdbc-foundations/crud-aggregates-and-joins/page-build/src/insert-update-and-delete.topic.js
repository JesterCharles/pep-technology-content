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
predict:{correct:'b',why:{
 a:'UPDATE has no idea of a first row. Without a WHERE clause it targets every row.',
 b:'with no WHERE clause, UPDATE changes every row in the table, so all 5 fees become 0.',
 c:'WHERE is optional. Leaving it out is allowed, which is exactly what makes this mistake easy to make.',
 d:'fee is a numeric(6,2) column with no rule against 0, so 0 is a valid value and no ERROR is raised.'}},
sql:{
 2:{file:'students.sql',goals:['rows','cols'],
  starter:"-- Add students 7 and 8 here, in ONE INSERT that names its columns.\n\n\n-- This query shows the result after your INSERT runs.\nSELECT student_id, name, email, city FROM students ORDER BY student_id;\n",
  fallback:'Write one INSERT that names its columns and adds student 7 (Gus, gus@example.com, Hull) and student 8 (Hana, hana@example.com, no city).',
  check:function(rep,H){var done={},notes=[],want7=['7','Gus','gus@example.com','Hull'],want8=['8','Hana','hana@example.com',null];
   var ins=H.of(rep,'insert','students'),final=H.table(rep,'students');
   var both=ins.filter(function(o){var rows=o.changed.map(function(r){return r.map(H.show);});return rows.some(function(r){return r[0]==='7';})&&rows.some(function(r){return r[0]==='8';});})[0];
   var has7=final.filter(function(r){return r[0]==='7';})[0],has8=final.filter(function(r){return r[0]==='8';})[0];
   var exact=has7&&has8&&H.sameList(has7,want7)&&H.sameList(has8,want8)&&final.length===8;
   if(H.errors(rep).length){notes.push('PostgreSQL rejected a statement: read the ERROR and DETAIL lines in Output.');}
   if(!ins.length&&!H.errors(rep).length){notes.push('No INSERT into students ran yet.');}
   if(exact&&both){done.rows=true;}
   else if(exact){notes.push('Both rows are there, but they came from separate statements: put both rows in one VALUES list, separated by a comma.');}
   else if(has7||has8){notes.push('Compare students 7 and 8 in Output with the task: spelling, single quotes, and Hana\'s missing city.');}
   if(both&&both.st.cols){done.cols=true;}else if(ins.length&&ins.some(function(o){return !o.st.cols;})){notes.push('Name the columns in parentheses after the table name, before VALUES.');}
   return {done:done,notes:notes};}},
 3:{file:'move.sql',goals:['preview','one','ret'],
  starter:"-- 1. Preview: select the row your WHERE will change.\n\n-- 2. Update only that row's city to Hull, returning student_id, name and city.\n\n",
  fallback:'Write a SELECT that lists only Ben\'s row (student 2), then an UPDATE with the same WHERE that sets his city to Hull and returns student_id, name and city.',
  check:function(rep,H){var done={},notes=[],ups=H.of(rep,'update','students'),outs=rep.outcomes||[];
   if(H.errors(rep).length){notes.push('PostgreSQL rejected a statement: read the ERROR in Output.');}
   if(!ups.length){notes.push('No UPDATE of students ran yet.');return {done:done,notes:notes};}
   var u=ups[0],ids=u.changed.map(function(r){return H.show(r[0]);}),final=H.table(rep,'students');
   var want=STUDENTS0.map(function(r){return r[0]==='2'?['2','Ben','ben@example.com','Hull']:r;});
   if(ups.length===1&&H.sameSet(final,want)){done.one=true;}
   else if(u.count>1){notes.push('Your UPDATE changed '+u.count+' rows: its WHERE matched more than Ben. Run that WHERE in your preview SELECT to see everything it matches.');}
   else if(u.count===0){notes.push('Your UPDATE changed 0 rows: its WHERE matched nothing. Check the value it compares with.');}
   else{notes.push('Compare the students table with the task: only Ben\'s city should change, to Hull.');}
   var before=outs.slice(0,outs.indexOf(u)).filter(function(o){return o.res&&o.st.from&&o.st.from.some(function(f){return f.name==='students';});});
   if(before.some(function(o){var k=H.pick(o.res,['student_id'])||H.pick(o.res,['name']);if(!k){return false;}var key=H.pick(o.res,['student_id'])?ids:u.changed.map(function(r){return H.show(r[1]);});return H.sameSet(k,key.map(function(x){return [x];}));})){done.preview=true;}
   else if(!before.length){notes.push('Run a SELECT on students before the UPDATE, with the same WHERE.');}
   else{notes.push('Your preview SELECT lists different rows from those the UPDATE changed; include student_id and use the same WHERE in both.');}
   var rr=u.ret?H.pick(u.ret,['student_id','name','city']):null;
   if(rr&&done.one&&H.sameList(rr,[['2','Ben','Hull']])){done.ret=true;}else if(!u.ret){notes.push('Add RETURNING with student_id, name and city to the end of the UPDATE.');}else if(!rr){notes.push('RETURNING should list student_id, name and city.');}
   return {done:done,notes:notes};}}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>Both columns of the primary key together match exactly one enrollment.</p>',
  why:{a:'also removes student 4\'s enrollment in course 103: two rows.',b:'student_id and course_id together are the primary key, so they match exactly one row.',c:'removes every student\'s enrollment in course 102: three rows.',d:'OR matches any row with either value: four rows.'},
  miss:{a:'This WHERE matches both of student 4\'s enrollments, so course 103 would go too.',c:'This WHERE matches every enrollment in course 102, including students 1 and 3.',d:'OR widens the match: any row with student 4 or with course 102, four rows in all.'},
  hint:'Look for the WHERE that names both parts of the enrollment\'s key, joined so that both must hold.'},
 B:{fs:'apply-b',correct:'c',reveal:'<code>WHERE student_id = 6</code> uses the primary key, so it can match only Femi\'s row.',
  why:{a:'no WHERE: it targets all 6 rows, and because email must be unique PostgreSQL rejects the whole statement with a duplicate key ERROR.',b:'Chen has no city either, so this targets two rows and also fails on the unique email.',c:'the primary key matches only Femi.',d:'matches Femi and also Chen, whose city is NULL.'}}}
};
/* /sql-practice page data */
