// this js is for _loading Animation in feedback submission in contact .ejs
var spin = document.getElementById("loading").style;
var err = document.getElementById("error-message").style;
var sent = document.getElementById("sent-message").style;
spin.display = "none";
err.display = "none";
sent.display = "none";

function sendFeedback() {
  console.log("validate text is responding from ajax_script.js");
  const form = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message"),
  };
  var xhttp = new XMLHttpRequest();
  // 0 means UNOPENED.
  // 1 means OPENED.
  // 2 means HEADERS_RECEIVED.
  // 3 means LOADING.
  // 4 means DONE.

  xhttp.onerror = function () {
    err.innerHTML = "some unknown error has occured!";
    err.display = "block";
  };

  xhttp.onreadystatechange = function () {
    if (this.readyState == 1) {
      //opened
      console.log("opened", this.readyState);
      spin.display = "block";
    } else if (this.readyState == 2) {
      //header received
      console.log("header received", this.readyState);
    }
    if (this.readyState == 3) {
      //loading
      console.log("loading", this.readyState);
    }
    if (this.readyState == 4 && this.status == 200) {
      spin.display = "none";

      sent.display = "block";
      console.log("inside ready state 4 status okk");
      console.log(this.responseText);
      message = xhttp.responseText.split(":", 1);
      console.log(message);
    }
  };

  xhttp.open(
    "POST",
    `feedback?name=${form.name.value}&email=${form.email.value}&subject=${form.subject.value}+&message=${form.message.value}`,
    true
  );
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send();
}
