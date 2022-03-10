// handling faculty_check and admin_edit pages

var spin = document.getElementById("cover-spin");
var selectedValue;
function loadAjax() {
  //loading all students details
  var ddl = document.getElementById("get_ajax");
  selectedValue = ddl.options[ddl.selectedIndex].value;

  var xhttp = new XMLHttpRequest();

  xhttp.onprogress = function () {
    spin.style.display = "block";
    console.log("LOADING", xhttp.readyState); // readyState will be 3
  };

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("inside ready state 4 status okk");
      spin.style.display = "none";
      document.getElementById("ajaxLoad").style.display = "block";
      document.getElementById("ajaxLoad").innerHTML = this.responseText;
      console.log("close btn is displayed and get btn is none");
      document.getElementById("closebtn").style.display = "block";
      document.getElementById("getbtn").style.display = "none";
    }
  };
  xhttp.open("GET", `check/${selectedValue}`, true);
  setInterval(xhttp.send(), 5000);
}

// this is for feedbacks through ajax
var feedbtn = document
  .getElementById("get_feedback")
  .addEventListener("click", get_feedback);

function get_feedback() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 1) {
      //loading
      spin.style.display = "block";
      console.log("inside get_feedback fun ,opended", this.readyState);
    }
    if (this.readyState == 4 && this.status == 200) {
      spin.style.display = "none";
      document.getElementById("feedback_data").style.display = "block";
      document.getElementById("feedback_data").innerHTML = this.responseText;
      console.log("inside ready state 4, done");
    }
  };

  xhttp.open("GET", "/get_feedback", true);
  xhttp.send();
}
