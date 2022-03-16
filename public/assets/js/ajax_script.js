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
  console.log(form.email.value);
  if (
    form.name.value == "" ||
    form.email.value == "" ||
    form.subject.value == "" ||
    form.message.value == ""
  ) {
    document.getElementById("error-message").innerHTML =
      "Please fill all the fields";
    err.display = "block";
    fade_message("error-message");
  } else {
    var xhttp = new XMLHttpRequest();
    // 0 means UNOPENED.
    // 1 means OPENED.
    // 2 means HEADERS_RECEIVED.
    // 3 means LOADING.
    // 4 means DONE.

    xhttp.onerror = function () {
      document.getElementById("error-message").innerHTML =
        "Some unknown error has occurred!";
      err.display = "block";
      fade_message("error-message");
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
        sent.display = "block"; // display message
        fade_message("sent-message"); // calling timed fun to fade message
      }
    };

    xhttp.open(
      "POST",
      `feedback?name=${form.name.value}&email=${form.email.value}&subject=${form.subject.value}+&message=${form.message.value}`,
      true
    );
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhttp.send();
  } //end of else block
} // endof sendfeedback fun

function fade_message(id) {
  console.log("inside fade message " + id);

  setInterval(() => {
    document.getElementById(id).style.display = "none";
  }, 4500);
  console.log("fadeed");
}
