var spin = document.getElementById("cover-spin");
var selectedValue;
function loadAjax() {
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
      console.log(this.responseText);
      console.log("close btn is displayed and get btn is none");
      document.getElementById("closebtn").style.display = "block";
      document.getElementById("getbtn").style.display = "none";
    }
  };
  xhttp.open("GET", `check/${selectedValue}`, true);
  setInterval(xhttp.send(), 5000);
}
