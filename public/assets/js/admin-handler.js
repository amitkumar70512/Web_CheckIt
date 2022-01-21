

const status=0
function showfeedback()
{
   console.log("show feedback is called")
   var d= document.getElementById('feedbacks');
   d.style.visibility="visible";
   
}

function CRUDfaculties()
{
    var d=document.getElementById('facultycrud');
    d.style.visibility="visible";
}


function check_students()
{
    console.log("checking students")
}

function check_db()
{
    console.log("checking database")
    
}




//////
function droplist()
{
  var d=document.getElementById("start_time");
  var displaytxt=d.options[d.selectedIndex].text;
  document.getElementById("stime").value=displaytxt;
}
function getday()
{
  var d=document.getElementById("list_day");
  var displaytxt=d.options[d.selectedIndex].text;
  document.getElementById("day").value=displaytxt;
}
function list_timing()
{
  var d=document.getElementById("list_time");
  var displaytxt=d.options[d.selectedIndex].text;
  document.getElementById("timing").value=displaytxt;

}
function dropsection(){
  var d=document.getElementById("select_section");
  var txt=d.options[d.selectedIndex].text;
  document.getElementById("section").value=txt;
}

