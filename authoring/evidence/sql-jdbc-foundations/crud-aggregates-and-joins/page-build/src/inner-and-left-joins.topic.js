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
  job:'this is how a person quietly goes missing from a report. If the request was for every instructor, the inner join gave no warning that Mara was dropped.',
  why:{a:'a NULL title for an unmatched row is what a LEFT JOIN does, which you meet in Activity 3. An inner join leaves the row out.',
    b:'ON pairs rows only where the two instructor_id values are equal, so Mara is never paired with other instructors’ courses.',
    c:'an inner join returns only pairs of rows for which ON is true, and no course row has instructor_id 1.',
    d:'having no match is normal for a join, not an ERROR; the row is simply left out.'}},
sql:{
2:{file:'enrolled-students.sql',goals:['rows','join'],starter:'-- Match each enrollment to its student.\n\n',
  fallback:'Write one SELECT that inner-joins students to enrollments on student_id, shows name and course_id, and sorts by name, then course_id.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var want=[['Ana','101'],['Ana','102'],['Ben','101'],['Ben','103'],['Chen','101'],['Chen','102'],['Dina','102'],['Dina','103'],['Eli','101']];
    var rows=H.rows(o.res),cols=H.sameList(o.res.cols,['name','course_id']),keys=(o.st.order||[]).length,picked=H.pick(o.res,['name','course_id']);
    if(H.sameList(rows,want)){done.rows=true;}
    if(done.rows&&cols&&keys>=2){done.join=true;}
    else if(done.rows&&!cols){near=true;notes.push('Your rows are right. In your SELECT line, keep the column names <code>name</code> and <code>course_id</code>: remove any AS that renames them.');}
    else if(done.rows&&keys===0){near=true;notes.push('Your rows are right, and here they happen to come out in order, but without ORDER BY PostgreSQL does not promise any order. Add an ORDER BY line at the end: name first, then course_id.');}
    else if(done.rows){near=true;notes.push('Your rows are right, but a student with two courses can get them in either order on a real server. In your ORDER BY line, add course_id after name.');}
    else if(picked&&H.sameList(picked,want)){near=true;notes.push('Your rows are right, but the result has extra columns. In your SELECT line, list only <code>name</code> and <code>course_id</code>.');}
    else if(picked&&H.sameSet(picked,want)){near=true;notes.push('You have the right 9 rows in a different order. In your ORDER BY line, sort by name first, then course_id.');}
    else{notes.push('Output should show 9 rows, one per enrollment, each with its student’s name. Check that FROM names students, INNER JOIN names enrollments, and ON compares their two student_id columns.');}
    return {done:done,notes:notes,near:near};}},
3:{file:'instructor-courses.sql',goals:['rows','nulls'],starter:'-- Keep every instructor, even when no course matches.\n\n',
  fallback:'Write one SELECT with instructors on the left of LEFT JOIN courses, joined on instructor_id, with result columns named instructor and course, sorted by the instructor\'s id, then the course\'s id.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var want=[['Mara',null],['Tomas','SQL Basics'],['Priya','Java Foundations'],['Priya','Data Modeling'],['Ken','Intro to Testing']];
    var rows=H.rows(o.res),cols=H.sameList(o.res.cols,['instructor','course']),keys=(o.st.order||[]).length;
    var names=rows.map(function(r){return r[0];}),titles=rows.map(function(r){return r[1];});
    if(H.sameList(rows,want)){done.rows=true;}
    if(done.rows&&rows[0][1]===null&&cols&&keys>=2){done.nulls=true;}
    else if(done.rows&&!cols){near=true;notes.push('Your rows are right. In your SELECT line, name the two columns with AS: <code>instructor</code> and <code>course</code>.');}
    else if(done.rows&&keys===0){near=true;notes.push('Your rows are right, and here they happen to come out in order, but without ORDER BY PostgreSQL does not promise any order. Add an ORDER BY line at the end: the instructor’s id first, then the course’s id.');}
    else if(done.rows){near=true;notes.push('Your rows are right, but Priya’s two courses can come out in either order on a real server. In your ORDER BY line, add the course’s id as a second sort column.');}
    else if(rows.length===5&&H.sameSet(rows,want)){near=true;notes.push('You have the right 5 rows in a different order. In your ORDER BY line, sort by the instructor’s id first, then the course’s id.');}
    else if(titles.indexOf('Web Basics')>=0||names.indexOf('Web Basics')>=0){notes.push('Web Basics appears, so courses is acting as your left table. Swap them: instructors before LEFT JOIN, courses after it.');}
    else if(names.indexOf('Mara')<0&&titles.indexOf('SQL Basics')>=0){notes.push('Mara is missing, so this works like an inner join. Check that instructors is written before LEFT JOIN and courses after it.');}
    else{notes.push('Expect 5 rows: Mara once with a NULL course, Tomas once, Priya twice and Ken once.');}
    return {done:done,notes:notes,near:near};}}},
apply:{
A:{fs:'apply-a',correct:'c',okNote:'<p>With instructors on the left, LEFT JOIN keeps every instructor; Mara gets NULL in the course columns.</p>',
  why:{a:'an inner join still removes instructors without a match, whichever table comes first.',b:'an inner join removes instructors without a matching course, so Mara would be missing.',c:'every instructor starts on the left and is kept; missing course columns become NULL.',d:'this keeps every course, including Web Basics, not every instructor.'},
  miss:{a:'An inner join leaves out unmatched instructors, whichever table comes first.',b:'An inner join leaves out instructors with no course, such as Mara.',c:'This keeps every instructor.',d:'This keeps every course; the report needs every instructor.'},
  hint:'Put the table whose rows must all stay on the left, then choose the join that keeps them.'},
B:{fs:'apply-b',correct:'a',reveal:'Use <code>students INNER JOIN enrollments ON ...</code> when only students with a match belong.',
  why:{a:'an inner join returns only students paired with an enrollment, so students with none are left out.',b:'a left join also keeps students with no enrollment, such as Femi, with NULLs.',c:'this looks for enrollments whose student is missing, a different question; with these tables it returns no rows.',d:'this keeps every course, so it answers a question about courses, not students.'}}}};
/* /sql-practice page data */
