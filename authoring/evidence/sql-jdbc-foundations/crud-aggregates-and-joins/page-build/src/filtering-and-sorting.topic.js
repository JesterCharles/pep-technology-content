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
 job:'a report or a test that relies on the order rows happen to come back in can pass on your laptop and then change on a colleague’s machine or on the server. Only ORDER BY promises an order.',
 why:{a:'PostgreSQL may happen to return Ana first, but the order rows were added in is not a promise.',b:'a larger id does not put a row first unless ORDER BY says so.',c:'without ORDER BY, matching rows come back in an order PostgreSQL does not promise.',d:'WHERE works without ORDER BY; it filters rows but does not sort them.'}},
sql:{
2:{file:'student-report.sql',goals:['rows','order'],starter:'-- List students from Leeds or York; sort by city, then student_id descending.\n\n',
  fallback:'Write a SELECT over students that shows student_id, name and city, keeps Leeds and York, and sorts by city, then student_id descending.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var want=[['4','Dina','Leeds'],['1','Ana','Leeds'],['2','Ben','York']],rows=H.rows(o.res),picked=H.pick(o.res,['student_id','name','city']),oc=H.orderCols(o);
    var orderOk=oc[0]==='city'&&oc[1]==='student_id'&&o.st.order[1].desc;
    var byName=oc.every(function(c){return c!==null;});
    if(H.sameSet(rows,want)){done.rows=true;}
    if(H.sameList(rows,want)&&orderOk){done.order=true;}
    else if(done.rows&&!byName){notes.push('Your rows are right. This practice check reads sort columns by their names, so write them by name in your ORDER BY line rather than by number.');}
    else if(done.rows){near=true;notes.push(oc.length?'Your rows are right, but the order is not the one asked for. In your ORDER BY line, check which column comes first and which one needs DESC.':'Your rows are right, but without ORDER BY PostgreSQL does not promise any order. Add an ORDER BY line at the end with the two sort columns the task names.');}
    else if(picked&&H.sameSet(picked,want)&&rows[0].length>3){near=true;notes.push('Your rows are right, but the result has extra columns. In your SELECT line, list only student_id, name and city.');}
    else if(rows.some(function(r){return r.indexOf('Bristol')>=0||r.indexOf(null)>=0;})){notes.push('Only Leeds and York should appear. Check your WHERE line: <code>city IN (...)</code> with both city names in single quotes.');}
    else{notes.push('Compare Output with the task: Dina and Ana from Leeds, and Ben from York, with student_id, name and city.');}
    return {done:done,notes:notes,near:near};}},
3:{file:'course-report.sql',goals:['filter','sort'],starter:'-- Keep courses with at least 3 credits; sort by fee, NULL last, with a stable tie-breaker.\n\n',
  fallback:'Write a SELECT over courses that keeps at least 3 credits, then sorts fee descending with the NULL fee last and a stable tie-breaker.',
  check:function(rep,H){var done={},notes=[],near=false,sels=H.selects(rep),o=sels[sels.length-1];
    if(!o){if(!H.errors(rep).length){notes.push('No SELECT returned rows yet. Write one SELECT on the empty line under the comment.');}return {done:done,notes:notes};}
    var rows=H.rows(o.res);var want=[['102','Java Foundations','4','150.00'],['101','SQL Basics','3','120.00'],['103','Data Modeling','3',null]];
    var byCredits=H.nodes(o.st.where,function(x){return x.col==='credits';}).length>0;
    if(byCredits&&H.sameSet(rows,want)){done.filter=true;}
    else if(rows.length&&rows.some(function(r){return r[0]==='104'||r[0]==='105';})){notes.push('Courses with 2 credits are still in the result. In your WHERE line, keep only credits of 3 or more: <code>&gt;=</code> includes 3 itself.');}
    else{notes.push('Expect exactly the three courses with at least 3 credits, filtered on credits in WHERE, showing course_id, title, credits and fee.');}
    var ord=o.st.order||[],oc=H.orderCols(o),feeFirst=ord.length>0&&H.nodes(ord[0].e,function(x){return x.col==='fee';}).length>0,idLast=ord.length>=2&&oc[oc.length-1]==='course_id';
    if(done.filter&&feeFirst&&idLast&&H.sameList(rows,want)){done.sort=true;}
    else if(done.filter){near=true;
      if(!feeFirst){notes.push('The right courses appear. '+(ord.length?'In your ORDER BY line, sort by fee first, highest fee first.':'Add an ORDER BY line at the end that sorts by fee, highest fee first.'));}
      else if(rows[rows.length-1][3]!==null){notes.push('The right courses appear, but the NULL fee is not last: with DESC, NULL sorts first. In your ORDER BY line, the reading column shows the words that move it to the end.');}
      else if(!H.sameList(rows,want)){notes.push('The NULL fee is last; now order the priced courses from the highest fee down: add DESC after fee.');}
      else if(!idLast&&oc.indexOf(null)>=0){notes.push('Your rows are in the right order. This practice check reads sort columns by their names, so write the tie-breaker by name at the end of your ORDER BY line.');}
      else if(!idLast){notes.push('Your rows are in the right order, but nothing breaks a tie between equal fees. In your ORDER BY line, add a last sort column that is different on every row.');}}
    return {done:done,notes:notes,near:near};}}},
apply:{A:{fs:'apply-a',correct:'a',okNote:'<p>NULLS LAST keeps the unpriced course at the end, and the final course_id gives tied fees a repeatable order.</p>',
  why:{a:'WHERE keeps 3 credits; fee sorts high to low with the NULL fee last; course_id breaks fee ties.',b:'WHERE must come before ORDER BY, and a comma cannot add a WHERE condition inside ORDER BY.',c:'this sorts by course_id first, so the fees are no longer in order; course_id is a tie-breaker and belongs last.',d:'fees run high to low with NULL last, but rows with the same fee still have no promised order.'},
  miss:{b:'WHERE belongs before ORDER BY.',c:'The first sort column decides the order; here that is course_id, not fee.',d:'The fee direction is right, but a tie-breaker is still missing.'},
  hint:'Look for WHERE before ORDER BY, fee as the first sort column, and a column that is different on every row at the end.'},
B:{fs:'apply-b',correct:'b',reveal:'<code>credits IN (2, 3) AND title LIKE \'%Basics%\'</code> requires both an allowed credit value and the title pattern.',
  why:{a:'AND is applied before OR, so every 2-credit course passes even when its title lacks Basics.',b:'IN picks the two credit values, then AND requires the title pattern too.',c:'OR also keeps any course whose title matches, even outside the range.',d:'OR keeps courses that meet either condition, so every 2- and 3-credit course passes.'}}}};
/* /sql-practice page data */
