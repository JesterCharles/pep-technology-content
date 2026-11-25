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
var EMPTY_TABLES={tables:SQL_TABLES.tables.map(function(t){return {name:t.name,cols:t.cols,keys:t.keys,fks:t.fks,rows:[]};})};
var SEED_START="-- seed.sql runs on EMPTY tables. Reorder these four statements so that\n-- every foreign key points at a row that already exists. Do not change values.\nINSERT INTO enrollments (student_id, course_id, grade) VALUES (1, 101, 82), (2, 101, 67);\nINSERT INTO courses (course_id, title, credits, fee, instructor_id) VALUES (101, 'SQL Basics', 3, 120.00, 2);\nINSERT INTO students (student_id, name, email, city) VALUES (1, 'Ana', 'ana@example.com', 'Leeds'), (2, 'Ben', 'ben@example.com', 'York');\nINSERT INTO instructors (instructor_id, name, lead_id) VALUES (1, 'Mara', NULL), (2, 'Tomas', 1);\n";
var TOPIC={
predict:{correct:'b',why:{
 a:'this ordinary foreign key is checked as the INSERT statement finishes, so the missing parent is not accepted for later; only a DEFERRABLE constraint waits until COMMIT.',
 b:'the enrollment points at student 1, who does not exist yet, so PostgreSQL rejects the statement with a foreign key ERROR and adds nothing.',
 c:'PostgreSQL never quietly changes your value. Rejecting the row is the whole point of the constraint.',
 d:'nothing waits: the statement fails at once with an ERROR.'}},
sql:{
 2:{file:'seed.sql',goals:['clean','all'],tables:EMPTY_TABLES,starter:SEED_START,
  fallback:'Reorder the four INSERT statements, without changing values, so each foreign key points at a row that already exists.',
  check:function(rep,H){var done={},notes=[],errs=H.errors(rep);
   var want={instructors:[['1','Mara',null],['2','Tomas','1']],courses:[['101','SQL Basics','3','120.00','2']],students:[['1','Ana','ana@example.com','Leeds'],['2','Ben','ben@example.com','York']],enrollments:[['1','101','82'],['2','101','67']]};
   if(!errs.length&&H.selects(rep).length+H.of(rep,'insert').length>0){done.clean=true;}
   else if(errs.length){notes.push(errs.length+' statement'+(errs.length===1?' was':'s were')+' rejected: read the first ERROR and DETAIL in Output, and move the table it names as missing earlier.');}
   var ok=Object.keys(want).every(function(t){return H.sameSet(H.table(rep,t),want[t]);});
   if(ok){done.all=true;}else if(!errs.length){notes.push('Some seed rows are missing or changed. Keep all four statements and their values; only their order should change.');}
   return {done:done,notes:notes};}},
 3:{file:'bulk.sql',goals:['thirty','one'],tables:EMPTY_TABLES,
  starter:"-- Add students 1 to 30 with ONE INSERT ... SELECT over generate_series.\n\n\nSELECT student_id, name, email FROM students WHERE student_id IN (1, 30) ORDER BY student_id;\n",
  fallback:'Write one INSERT ... SELECT over generate_series that adds students 1 to 30, named Student 1 to Student 30, with emails student1@example.com to student30@example.com.',
  check:function(rep,H){var done={},notes=[],rows=H.table(rep,'students'),want=[];
   for(var i=1;i<=30;i++){want.push([String(i),'Student '+i,'student'+i+'@example.com',null]);}
   if(H.errors(rep).length){notes.push('PostgreSQL rejected a statement: read the ERROR and DETAIL in Output.');}
   if(H.sameSet(rows,want)){done.thirty=true;}
   else if(rows.length){var bad=rows.filter(function(r){var n=+r[0];return !(n>=1&&n<=30&&r[1]==='Student '+n&&r[2]==='student'+n+'@example.com'&&r[3]===null);})[0];
     notes.push('The table holds '+rows.length+' row'+(rows.length===1?'':'s')+'.'+(bad?' Compare this row with the pattern: '+bad.map(function(v){return v===null?'NULL':v;}).join(', ')+'.':' Check that the series runs from 1 to 30.'));}
   var ins=H.of(rep,'insert','students');
   if(ins.length===1&&ins[0].st.query&&ins[0].count===30){done.one=true;}
   else if(ins.some(function(o){return o.st.rows;})){notes.push('Use INSERT ... SELECT with generate_series instead of listing rows after VALUES.');}
   return {done:done,notes:notes};}}},
apply:{A:{fs:'apply-a',correct:'b',okNote:'<p>psql opens the file on your laptop and streams it to the server, so ordinary INSERT permission is enough.</p>',
  why:{a:'COPY makes the server open a file on its own disk, where students.csv is not, and needs a superuser or pg_read_server_files.',b:'psql reads the file on your computer and sends the rows to the server.',c:'INSERT has no FROM-a-file form; this is not valid SQL.',d:'TO writes the table out to the file; it does not load anything.'},
  miss:{a:'COPY is run by the server, which looks for the file on its own disk and requires extra privileges you do not have.',c:'INSERT takes VALUES or a query, never a file name.',d:'The direction is wrong: TO exports the table into a file.'},
  hint:'Ask which program can see the file: the psql on your laptop, or the server on another machine.'},
 B:{fs:'apply-b',correct:'c',reveal:'<code>\\copy</code> is run by psql on your computer; <code>COPY ... FROM \'file\'</code> is run by the server against its own disk.',
  why:{a:'only \\copy reads a local file; COPY FROM a file reads the server\'s disk.',b:'the other way round: COPY with a file needs a superuser or pg_read_server_files; \\copy needs only table permissions.',c:'that is the difference: who opens the file.',d:'\\copy is a psql command, not SQL, so other clients do not understand it.'}}}
};
/* /sql-practice page data */
