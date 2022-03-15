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
  console.log("inside get feedback");
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
      fade_notification();
      document.getElementById("facultycrud").style.display = "none";
    }
  };

  xhttp.open(
    "POST",
    `addFaculty?uid=${data.uid}&s_time=${data.s_time}&day=${data.day}&class=${data.class}&section=${data.section}&timing=${data.timing}`,
    true
  );
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
});

// for student cruds
document.getElementById("student-crud-btn").addEventListener("click", () => {
  console.log("i am inside student crud");
  var select = document.getElementById("select_section");
  const data = {
    usn: document.getElementById("usn").value,
    section: select.options[select.selectedIndex].value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
  };
  console.log(data.section);
  var xhttp = new XMLHttpRequest();
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

      fade_notification();
    }
  };

  xhttp.open(
    "POST",
    `addStudent?usn=${data.usn}&email=${data.email}&name=${data.name}&section=${data.section}`,
    true
  );
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send();
});

function fade_notification() {
  console.log("fade notification started");
  setInterval(() => {
    document.getElementById("notification").style.opacity = 0.8;
  }, 2500);
  setInterval(() => {
    document.getElementById("notification").style.opacity = 0.6;
  }, 5000);
  setInterval(() => {
    document.getElementById("notification").style.opacity = 0.4;
  }, 7500);
  setInterval(() => {
    document.getElementById("notification").style.display = "none";
  }, 10000);
  console.log("fadeed");
}

// close btn on studetns crud modal ==display kar none for modal
document.getElementById("close_student_crud").addEventListener("click", () => {
  document.getElementById("studentcrud").style.display = "none";
});

// |upar aala |  display block kari udd
document.getElementById("student-btn").addEventListener("click", () => {
  document.getElementById("studentcrud").style.display = "block";
});
