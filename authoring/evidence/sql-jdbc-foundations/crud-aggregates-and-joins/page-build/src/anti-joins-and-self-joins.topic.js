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
 job:'NOT IN over a list that can contain NULL is a well-known trap: the query runs without any ERROR and simply returns nothing, so a follow-up list comes back empty.',
 why:{a:'for Mara and Ken the comparisons with 2 and 3 are false, but the comparison with NULL is unknown, so NOT IN is not true.',b:'Mara is also compared with the NULL item, which leaves the whole NOT IN unknown.',c:'when no item is equal and one item is NULL, NOT IN gives unknown, and WHERE keeps no row.',d:'a NULL in the list is allowed; it changes the result to unknown instead of causing an ERROR.'}},
sql:{
2:{file:'unenrolled-students.sql',goals:['rows','anti'],starter:'-- Keep only students for whom no enrollment row matches.\n\n',
  fallback:'Write a LEFT JOIN from students to enrollments that keeps only students with no enrollment, showing student_id and name.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res);
    if(H.sameList(rows,[['6','Femi']])){done.rows=true;}
    else if(rows.length>6){notes.push('Output shows every enrollment, so nothing filters out the matched rows yet. After the join, add WHERE with an IS NULL test on the enrollments key.');}
    else if(rows.length===6){notes.push('Output shows every student. Add a WHERE line after the join that tests the enrollments alias\'s student_id with IS NULL.');}
    else if(!rows.length){notes.push('No rows came back. Check that students is on the left of LEFT JOIN, and that IS NULL tests a column from enrollments, not from students.');}
    else{notes.push('Only Femi has no enrollment in the sample rows.');}
    var lj=(o.st.from||[]).filter(function(f){return f.kind==='left'&&f.name==='enrollments';})[0],rq=lj&&(lj.alias||lj.name);
    var anti=!!lj&&H.nodes(o.st.where,function(x){return x.op==='isnull'&&x.a&&x.a.qual===rq&&(x.a.col==='student_id'||x.a.col==='course_id');}).length>0;
    var unq=!!lj&&H.nodes(o.st.where,function(x){return x.op==='isnull'&&x.a&&!x.a.qual&&(x.a.col==='student_id'||x.a.col==='course_id');}).length>0;
    if(done.rows&&!anti){done.rows=false;notes.push(unq?'The row is right. This practice check looks for the IS NULL test written with the enrollments alias and a dot in front of the column; add the alias there.':'The row is right, but find it with a LEFT JOIN to enrollments and an IS NULL test on that right-side key.');}
    if(done.rows&&H.sameList(o.res.cols,['student_id','name'])){done.anti=true;}
    else if(done.rows){near=true;notes.push('The row is right. In your SELECT line, show exactly the columns student_id and name.');}
    return {done:done,notes:notes,near:near};}},
3:{file:'reporting-lines.sql',goals:['rows','aliases'],starter:'-- Join instructors to itself: employee to manager.\n\n',
  fallback:'Write a self LEFT JOIN of instructors with the aliases employee and manager, with columns named employee and manager.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res),want=[['Mara',null],['Tomas','Mara'],['Priya','Mara'],['Ken','Tomas']];
    var rowsOk=H.sameList(rows,want);
    if(rowsOk&&H.sameList(o.res.cols,['employee','manager'])){done.rows=true;}
    else if(rowsOk){near=true;notes.push('The rows are right. In your SELECT line, name the two columns with AS: employee and manager.');}
    else if(rows.length===3&&H.sameSet(rows,want.slice(1))){notes.push('Mara is missing, so this works like an inner join. Use LEFT JOIN for the manager copy so Mara stays with a NULL manager.');}
    else if(rows.length===4&&H.sameSet(rows,want)){near=true;notes.push('The rows are right but in a different order. In your ORDER BY line, sort by the employee alias\'s instructor_id.');}
    else{notes.push('Expect Mara with NULL, Tomas and Priya with Mara, and Ken with Tomas. If the names look swapped, check which alias\'s lead_id the ON line uses.');}
    var ins=(o.st.from||[]).filter(function(f){return f.name==='instructors';}),self=false;
    if(ins.length===2&&ins[0].alias&&ins[1].alias&&ins[0].alias!==ins[1].alias&&ins[1].on){var e=ins[0].alias,m=ins[1].alias;self=H.nodes(ins[1].on,function(x){return x.op==='='&&x.a&&x.b&&((x.a.qual===e&&x.a.col==='lead_id'&&x.b.qual===m&&x.b.col==='instructor_id')||(x.b.qual===e&&x.b.col==='lead_id'&&x.a.qual===m&&x.a.col==='instructor_id'));}).length>0;}
    if(rowsOk&&self){done.aliases=true;}
    else if(rowsOk){near=true;notes.push('The rows match; get them from instructors used twice, with an employee alias and a manager alias, joined the way the Ken example joins its two copies.');}
    return {done:done,notes:notes,near:near};}}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>NOT EXISTS checks each instructor for a real matching course, so the NULL in course 104 cannot spoil the answer.</p>',
  why:{a:'the list from courses contains a NULL, so NOT IN is unknown for every instructor with no course and keeps nobody.',b:'the inner SELECT looks for a course of this instructor, and NOT EXISTS keeps the instructor when there is none.',c:'&lt;&gt; needs exactly one value, but the subquery returns five rows, so PostgreSQL stops with an ERROR.',d:'the inner WHERE compares a course with itself and never mentions the outer instructor, so a match always exists and nobody is kept.'},
  miss:{a:'The NULL in the subquery’s list makes NOT IN keep nobody.',c:'This compares with a whole list as if it were one value.',d:'The inner SELECT never refers to the outer instructor i.'},
  hint:'Choose the form whose inner SELECT looks for a match of this instructor, instead of comparing with a list that can contain NULL.'},
B:{fs:'apply-b',correct:'b',reveal:'The employee row’s <code>lead_id</code> points at the manager row’s <code>instructor_id</code>.',
  why:{a:'this matches each employee with themself.',b:'the employee row stores its manager’s id in lead_id.',c:'this reverses the direction and finds the people the employee leads.',d:'names are not the relationship the table declares, and two people can share a name.'}}}};
/* /sql-practice page data */
