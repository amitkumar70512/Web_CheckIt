// handling faculty_check and admin_edit pages(loading feedback,students,cruds)

var spin = document.getElementById("cover-spin");
var selectedValue;
function loadAjax() {
  //loading all students details
  var ddl = document.getElementById("get_ajax");
  selectedValue = ddl.options[ddl.selectedIndex].value;

  var xhttp = new XMLHttpRequest();

  xhttp.onprogress = function () {
    spin.style.display = "block";
  };

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      spin.style.display = "none";
      document.getElementById("ajaxLoad").style.display = "block";
      document.getElementById("ajaxLoad").innerHTML = this.responseText;
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
    }
    if (this.readyState == 4 && this.status == 200) {
      spin.style.display = "none";
      document.getElementById("feedback_data").style.display = "block";
      document.getElementById("feedback_data").innerHTML = this.responseText;
    }
  };

  xhttp.open("GET", "/get_feedback", true);
  xhttp.send();
}

function close_feed() {
  document.getElementById("feedback_data").style.display = "none";
}

// for crud of faculty
document.getElementById("faculty-crud-btn").addEventListener("click", () => {
  var xhttp = new XMLHttpRequest();
  var select1 = document.getElementById("start_time");
  var select2 = document.getElementById("day");
  var select3 = document.getElementById("timing");
  const data = {
    uid: document.getElementById("uid").value,
    s_time: select1.options[select1.selectedIndex].value,
    day: select2.options[select2.selectedIndex].value,
    class: document.getElementById("class").value,
    section: document.getElementById("section").value,
    timing: select3.options[select3.selectedIndex].value,
  };
  console.log(data);
  xhttp.onreadystatechange = function () {
    if (this.readyState == 1) {
      //opened
      spin.style.display = "block";
    } else if (this.readyState == 2) {
      //header received
    }
    if (this.readyState == 3) {
      //loading
    }
    if (this.readyState == 4 && this.status == 200) {
      spin.style.display = "none";
      document.getElementById("notification").style.display = "block";
      document.getElementById("notification").innerHTML = this.responseText;
      document.getElementById("close_notification").style.display = "block";
      document.getElementById("facultycrud").style.display = "none";
    }
  };

  xhttp.open(
    "POST",
    `firedb?uid=${data.uid}&s_time=${data.s_time}&day=${data.day}&class=${data.class}&section=${data.section}&timing=${data.timing}`,
    true
  );
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
});

// an event listener to close notifications
var not = document.getElementById("close_notification");
not.addEventListener("click", () => {
  document.getElementById("notification").style.display = "none";
  document.getElementById("close_notification").style.display = "none";
});
