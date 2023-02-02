const admin = require("firebase-admin");
const functions = require("firebase-functions");
var alert = require("alert");
var serviceAccount = require("./privatekey.json");
const qrcode = require("qrcode");

const express = require("express");
const port = process.env.PORT || 3000;
var app = express();
const http=require('http');
const server= http.createServer(app);

// handling sockets
var presentList='';
const {Server}=require("socket.io");
const io=new Server(server);
io.on('connection', function (socket) {
  console.log('connected:', socket.client.id);

  socket.on('client_attendance',function(obj){// if user scan qr using mob
  
    socket.broadcast.emit('checkit_message',obj.usn);//message to admin_edit
    console.log("present list "+obj.usn);
  })
  socket.on('admin_connection',(data)=>{
    console.log(data);
  })
  socket.on('get',(data)=>{
    const student={header:'usn',message:'usn is present'};
    socket.emit('send',student);
  })
  socket.on('disconnect', function() {
    console.log('Client disconnected.'+socket.client.id);
    });
  });
 
/// end of sockets

///
const bodyParser = require("body-parser");
const { check, validationResult, checkSchema } = require("express-validator");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// get config vars
dotenv.config();
process.env.TOKEN_SECRET;
// for encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

const { join } = require("path");
const { start } = require("repl");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.set("view engine", "ejs");

// To Run the server with Port Number
server.listen(port, () =>
  console.log(`Express server is running at port no :${port}`)
);

//      for date
let date_ob = new Date();
let  current_day, c_time; // global

let c_day = date_ob.getDay();

function get_time() {
 let ts = Date.now();
 let date_ob = new Date(ts);
 utcHour = (date_ob.getUTCHours() + 5) % 24;
 utcMinute = (date_ob.getUTCMinutes() + 30) % 60;

 if(date_ob.getUTCMinutes() > 29){
  utcHour = utcHour + 1;
 }

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();
  current_day = weekday[d.getUTCDay()];

  let c_hours = String(utcHour < 10 ? "0" : "") + utcHour;
  
  let c_minutes = String(utcMinute < 10 ? "0" : "") + utcMinute;

  c_time = c_hours+ "" + c_minutes;
  console.log("printing time :" + c_time);
  ////

 
console.log("UTC time " + date.getHours())

}

var classes = [];
var rows = {};
rows = [{ class: "", section: "", timing: "" }];
var fname = "",
  femail = "",
  uid = ""; // to be used in dynamic ejs
var today = date_ob.toDateString();

function checkStudent(res) {
  var c_section = rows[0].section;
  console.log(c_section);

  var i = 0,
    j = 0,
    k = 0;
  var lenA = 0;
  var lenB = 0;
  var lenC = 0;
  admin
    .firestore()
    .collection("students_list")
    .doc("5A")
    .collection("list")
    .get()
    .then((val) => {
      val.forEach((doc) => {
        collA[i] = {
          email: doc.id,
          name: doc.data().name,
          usn: doc.data().usn,
        };
        i++;
      });
      lenA = Object.keys(collA).length;
      ////////

      admin
        .firestore()
        .collection("students_list")
        .doc("5B")
        .collection("list")
        .get()
        .then((val2) => {
          val2.forEach((doc) => {
            collB[j] = {
              email: doc.id,
              name: doc.data().name,
              usn: doc.data().usn,
            };
            j++;
          });
          lenB = Object.keys(collB).length;

          admin
            .firestore()
            .collection("students_list")
            .doc("5C")
            .collection("list")
            .get()
            .then((val3) => {
              val3.forEach((doc) => {
                collC[k] = {
                  email: doc.id,
                  name: doc.data().name,
                  usn: doc.data().usn,
                };
                k++;
              });
              lenC = Object.keys(collC).length;
              /////
              //checkPresent();
              res.render("pages/faculty_check", {
                countA: lenA,
                StudentsA: collA,
                countB: lenB,
                StudentsB: collB,
                countC: lenC,
                StudentsC: collC,
              });
            }); // end of 5C
        }); // end of 5B
    }); // end of 5A
}
var presentStudents = {};
function checkPresent() {
  console.log("inside checkPresent");
  var c_section = rows[0].section;
  console.log(c_section);
  console.log(today);
  var present = {};
  var x = 0;
  admin
    .firestore()
    .collection("Attendance")
    .doc(uid)
    .collection(c_section)
    .doc(today)
    .collection("attended")
    .get()
    .then((val) => {
      val.forEach((doc) => {
        console.log(
          "email:" +
            doc.id +
            ",name:" +
            doc.data().name +
            ",usn:" +
            doc.data().usn
        );
        // present[x]={email:doc.id,name:doc.data().name,usn:doc.data().usn};
        k++;
      });
    });
  // lenC = Object.keys(collC).length
  // const present =  await admin.firestore().collection('Attendance').doc(uid).collection(c_section).doc(today).collection('attended').get();
  // presentStudents=present.docs.map(doc => doc.data());
  // console.log("listing present studetns: : ");
  // console.log(presentStudents)
}

function get_section(sec) {
  var i, j;
  var section =
    '<table class="table" data-aos="fade-up" date-aos-delay="300"><thead><tr><th scope="col">\'#\'</th><th scope="col">Name</th><th scope="col">USN</th><th scope="col">Email</th></tr></thead><tbody>';
  len = Object.keys(sec).length;
  for (i = 0; i < len; i++) {
    section +=
      '<tr><th scope="row">' +
      (i + 1) +
      "</th><td>" +
      sec[i].name +
      "</td><td>" +
      sec[i].usn +
      "</td><td>" +
      sec[i].email +
      "</td></tr>";
  }
  section += "</tbody></table>";

  return section;
}

/// for ajax get in admin
//
app.get("/check/:id", function (req, res) {
  console.log("i am inside get request user");

  if (req.params.id == "3_sectionA") {
    res.send(get_section(collA));
  } else if (req.params.id == "3_sectionB") {
    res.send(get_section(collB));
  } else if (req.params.id == "3_sectionC") {
    res.send(get_section(collC));
  } else {
    res.send(
      '<div class="container" "data-aos="fade-up" date-aos-delay="300"> <span style="background-color:#ff8080; color:white;text-align:center;justify-content:center;padding:5px 10px;font-size:15px"><i class="fa-solid fa-xmark"></i>  Requested not found </span></div>'
    );
  }
});

app.get("/login", function (req, res) {
  res.render("pages/login");
});
app.get("/register", function (req, res) {
  res.render("pages/register");
});
app.get("/admin", function (req, res) {
  res.render("pages/admin");
});
app.get("/contact", function (req, res) {
  res.render("pages/contact");
});

app.get("/logout", authenticateToken, async (req, res) => {
  try {
    res.clearCookie("1jwt_authentication");
    res.clearCookie("1uid");
    console.log("logout successfully");
    res.render("pages/register");
  } catch (error) {
    return res.status(500).send(error);
  }
});

//////token/////
function generateAccessToken(username) {
  console.log("token is geneerated");
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "15d" });
}
function authenticateToken(req, res, next) {
  console.log("inside authentication token function");
  ///
  const token = req.headers.cookie;
  console.log(token);
  
  ////jwt authentication
  const first_token = token && token.split(";")[1];
  console.log(first_token);
  const finaltoken = first_token && first_token.split("=")[1];/// here splitting taking place 1authentication= #h;lhahfa...     ( token will be extracted to final_token )
  console.log("finaltokenis ::");
  console.log(finaltoken);

// for reading uid
  const uid_token = token && token.split(";")[2];
  console.log(uid_token);
  const final_uid = uid_token && uid_token.split("=")[1]; /// here splitting taking place 1uid= 1bm190000     ( 1bm19000 will be extracted to final_uid )
  console.log("final uid is ::");
  console.log(final_uid);
  uid=final_uid
  console.log(uid);
  if (finaltoken == null) {
    const errors = [{ msg: "Session Expired!" }];
    const alert = errors;
    res.render("pages/login", {
      alert,
    });
  } else {

    try {
      

      const verified = jwt.verify(finaltoken, process.env.TOKEN_SECRET);
      if(verified){
        next();
      }else{
          // Access Denied
          return res.status(401).send(error);
      }
  } catch (error) {
    console.log("an error has occurred"+error);
     const errors = [{ msg: error }];
    const alert = errors;
    res.render("pages/login", {
    alert,
    });
  }

    // jwt.verify(finaltoken, process.env.TOKEN_SECRET, (err, user) => {
    //   console.log("token matched");

    //   if (err) {
    //     console.log("an error has occurred"+err);
    //     const errors = [{ msg: err }];
    //     const alert = errors;
    //     res.render("pages/login", {
    //       alert,
    //     });
    //   } 
    //   else{
    //     next();
    //   }

    // });

  }
}

//////////////////// update function is loading home page as well
let scan_valid = 0;
let start_time = 0,
  end_time = 0,
  s_time = "085500";

async function updateCurrClass(uid, fname, res) {
  get_time();
  console.log("inside update uid=" + uid);
  const firestore_con = admin.firestore();
  const writeResult = firestore_con
    .collection("faculty")
    .doc(uid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No such document in write result!");
        console.log(uid);
        const errors = [{ msg: " Failed!  server error.." }];
        const alert = errors;
        res.render("pages/login", {
          alert,
        });
      } else {
        fname = doc.data().name;
        femail = doc.data().email;
        console.log(fname + "  " + femail);
      }
    }); // end of getting fname and femail

  if (c_time >= 0855 && c_time <= 0950) {
    start_time = "08:55 am";
    s_time = "085500";
    end_time = "09:50 am";
  } else if (c_time >= 0950 && c_time <= 1045) {
    start_time = "09:50 am";
    s_time = "095000";
    end_time = "10:45 am";
  } else if (c_time >= 1045 && c_time <= 1115) {
    start_time = "10:45 am";
    s_time = "104500";
    end_time = "11:15 am";
    rows[0].timing = "10:45am   to 11:15 am";
    rows[0].class = "Tea Break";
    rows[0].secion = "";
  } else if (c_time >= 1115 && c_time <= 1210) {
    start_time = "11:15 am";
    s_time = "111500";
    end_time = "12:10 pm";
  } else if (c_time >= 1210 && c_time <= 1305) {
    start_time = "12:10 pm";
    s_time = "121000";
    end_time = "01:05 pm";
  } else if (c_time >= 1305 && c_time <= 1400) {
    start_time = "01:05 pm";
    s_time = "130500";
    end_time = "02:00 pm";
  } else if (c_time > 1400 && c_time < 1455) {
    start_time = "02:00 pm";
    s_time = "140000";
    end_time = "02:55 pm";
  } else if (c_time > 1455 && c_time < 1550) {
    start_time = "02:55 pm";
    s_time = "145500";
    end_time = "03:50 pm";
  } 
  else if (c_time > 1550 && c_time < 1645) {
    start_time = "03:50 pm";
    s_time = "155000";
    end_time = "04:45 pm";
  }
  else if (c_time > 1645 && c_time < 1730) {
    start_time = "04:45 pm pm";
    s_time = "164500";
    end_time = "05:30 pm";
  }
  else {
    s_time = "160000";
    scan_valid = 1;
    (rows[0].timing = "04:00 pm to 08:55 am"),
      (rows[0].class = "classes are finished...");
  }
  ////
  console.log(uid);
  console.log(current_day);

  await firestore_con
    .collection("faculty")
    .doc(uid)
    .collection(current_day)
    .get()
    .then((querySnapshot) => {
      classes = [];
      querySnapshot.docs.forEach((doc) => {
        classes.push(doc.data());
      });
      console.log("marker data");
      console.log(classes);
      ///

      // const liam =  await firestore_con.collection('faculty').doc(uid).collection(current_day).get();
      // classes=liam.docs.map(doc => doc.data());
      // console.log("listing all classes on current day: : ");
      // console.log(classes)
      //////
      console.log("fname of faculty" + fname);
      console.log(c_time);
      if (c_day == 0) {
        rows[0].timing = "NO CLASSES TODAY";
        rows[0].class = "";
      }
      if (c_time < 1800 && c_time > 0800 && c_day != 0) {
        firestore_con
          .collection("faculty")
          .doc(uid)
          .collection(current_day)
          .doc(s_time)
          .get()
          .then(function (doc) {
            if (doc.data() === undefined) {
              console.log("i am inside undefined doc.data");
              rows[0].class = "NO CLASS NOW !!";
              rows[0].section = "";
              rows[0].timing = "";
              scan_valid = 0;
            } else {
              rows[0] = doc.data();
              scan_valid = 1;
            }

            console.log("current class :-: ");
            console.log(doc.data());

            ///////
            try {
              res.render("pages/faculty_welcome", {
                uid,
                fname,
                femail,
                classes,
                day: current_day,
                current_subject: rows[0].class,
                current_section: rows[0].section,
                current_timing: rows[0].timing,
                current_time: c_time,
              });
            } catch (error) {
              
              const errors = [{ msg: " Failed!  server error.." }];
              const alert = errors;
              res.render("pages/login", {
                alert,
              });
            }
          }) // end of firestore_con collection
          .catch((err) => {
            console.log("Error getting document", err);
          });
      } else {

        if (c_time < 0800 && c_time > 0001) {
          console.log("inside else c_time < 0800 && c_time > 0001 block");
          rows[0].timing = "";
          scan_valid = 0;
          console.log(typeof classes[0]);
          if (typeof classes[0] != "undefined") {
            rows[0].timing =
              classes[0].class + "  will start at " + classes[0].timing;
          } else {
            t = 0855 - c_time;

            rows[0].timing = "classes will start in " + t + " hours";
          }
        } else {
          rows[0].timing = "04:00 pm   till 08:55 am  next day";
        }

        try {
          res.render("pages/faculty_welcome", {
            uid,
            fname,
            femail,
            classes,
            day: current_day,
            current_subject: rows[0].class,
            current_section: rows[0].section,
            current_timing: rows[0].timing,
            current_time: c_time,
          });
        } catch (error) {
          const errors = [{ msg: " Failed!  server error.." }];
          const alert = errors;
         console.log(alert)
        }
      }

      ///
    });
}
// end  of update class

app.post("/login", function (req, res, next) {
  uid = String(req.body.uid);
  const password = String(req.body.passkey);
  uid = req.body.uid;
  if(uid!='')
  {

  
  const firestore_con = admin.firestore();
  const writeResult = firestore_con
    .collection("faculty")
    .doc(req.body.uid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        // entered uid doesnt registered
        console.log("No such document!");
        const errors = [{ msg: " Failed!  Invalid Crudentials.." }];
        const alert = errors;
        res.render("pages/login", {
          alert,
        });
      } else {
        // block for password matching and others
        db_pass = doc.data().password;

        bcrypt.compare(password, db_pass, function (err, result) {
          if (!result) {
            // password mismatch

            console.log("password not matched");
            const errors = [{ msg: "Failed! Invalid crudentials.." }];
            const alert = errors;
            res.render("pages/login", {
              alert,
            });
          } // end of password mismatch
          else {
            // password matched
            fname = doc.data().name;
            console.log("password matched");
            const user = {
              id: uid,
              username: fname,
              password: password,
            };
            const token = generateAccessToken(user);
            console.log("token is created");
            console.log(token);

            res.cookie("1jwt_authentication", token, {
              maxAge: 15 * 24 * 60 * 60 * 1000,
              httpOnly: true,
            });

            res.cookie("1uid", uid, {
              maxAge: 15 * 24 * 60 * 60 * 1000,
              httpOnly: true,
            });
            ///////
            updateCurrClass(uid, doc.data().name, res);
            ////////////////////////
          } // end of password matched
        });
      } // end of  block for password matching and others
    }) // end of then

    .catch((err) => {
      console.log("Error getting document", err);
      const errors = [{ msg: "Failed! " + err }];
      const alert = errors;
      res.render("pages/login", {
        alert,
      });
    }); // end of catch

  }
});

// for register.ejs
app.post(
  "/register",
  [
    check("name", "Please enter valid username ")
      .exists()
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z ]*$/),
    check("email", "Please provide valid email")
      .isEmail()

      .normalizeEmail(),

    check("uid", "please provide unique id").isLength(10).isAlphanumeric(),

    check(
      "passkey",
      " password must have  at least one  number and minumum length 5. "
    )
      .isLength({ min: 5 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,20}$/),
    check("confirmpasskey", "Passwords do not match").custom(
      (value, { req }) => value === req.body.passkey
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("pages/register", {
        alert,
      });
    } else {
      // if no errors

      console.log(req.body.name);
      console.log(req.body.email);
      console.log(req.body.uid);
      console.log(req.body.passkey);

      const encryptkey = await bcrypt.hash(req.body.passkey, saltRounds);
      const writeResult = await admin
        .firestore()
        .collection("faculty")
        .doc(req.body.uid)
        .set({
          name: req.body.name,
          email: req.body.email,
          password: encryptkey,
        })
        .then(function () {
          console.log("Document successfully written!");
          const toast_message={header:`Welcome ${req.body.name}`,body:" You have been Registered on  CHECKIT "};
          
          res.render("pages/login",{
            toast_message,
          });
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
          // Already exist
          console.log("error in inserting");
          const errors = [{ msg: "Request Denied !! Uable to register..." }];
          const alert = errors;
          res.render("pages/register", {
            alert,
          });
        });
    }
  }
);

app.post("/feedback", async function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("errors occuring in feedback processing");
    return res.status(422).jsonp(errors.array());
  } else {
    const writeResult = await admin
      .firestore()
      .collection("feedback")
      .doc(req.query.name + " " + req.query.subject)
      .set({
        name: req.query.name,
        email: req.query.email,
        subject: req.query.subject,
        message: req.query.message,
      })
      .then(function () {
        console.log("feedback inserted succesfully using node");
        const errors = [
          {
            msg:
              "Thank you '" +
              req.query.name.toUpperCase() +
              "'  for contacting us. Our team will respond you",
          },
        ];
        const message = errors;
        res.send(message);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        // Already exist
        console.log("error in inserting");
        const errors = [{ msg: "  Failed ! Error .. " }];
        const alert = errors;
        res.send(alert);
      }); // end of catch
  }
});
// this post is replaced by above ajax
app.post(
  "/feed",
  [
    check("name", "Please enter valid username ..")
      .exists()
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z]+(\s[a-zA-Z]+)?$/),
    check("email", "Please provide valid email !!").isEmail().normalizeEmail(),
    check("subject", "Please provide subject title !!").exists(),
    check("message", "Invalid message body!!").isLength({ min: 5 }),
  ],
  async function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(422).jsonp(errors.array())
      const alert = errors.array();
      res.render("pages/contact", {
        alert,
      });
    } else {
      const writeResult = await admin
        .firestore()
        .collection("feedback")
        .doc(req.body.name + " " + req.body.subject)
        .set({
          name: req.body.name,
          email: req.body.email,
          subject: req.body.subject,
          message: req.body.message,
        })
        .then(function () {
          console.log("feedback inserted succesfully using node");
          const errors = [
            {
              msg:
                "Thank you '" +
                req.body.name.toUpperCase() +
                "'  for contacting us. Our team will respond you",
            },
          ];
          const message = errors;
          res.render("pages/contact", {
            message,
          });
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
          // Already exist
          console.log("error in inserting");
          const errors = [{ msg: "  Failed ! Error .. " }];
          const alert = errors;
          res.render("pages/contact", {
            alert,
          });
        });
    }
  }
);

// for admin login
var admin_name = "admin";
var collA = {};
var collB = {};
var collC = {};
app.post("/verify", (req, res) => {
  const key = String(req.body.admin_key);
  const password = String(req.body.passkey);
  console.log(key);
  if (key == "" || password == "") {
    const errors = [{ msg: "please fill all fields" }];
    const alert = errors;
    res.render("pages/admin", {
      alert,
    });
  } else {
    const firestore_con = admin.firestore();
    const writeResult = firestore_con
      .collection("admins")
      .doc(key)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          // entered uid doesnt registered
          console.log("No such document!");
          const errors = [{ msg: " Failed!  Invalid Crudentials.." }];
          const alert = errors;
          res.render("pages/login", {
            alert,
          });
        } else {
          // block for password matching and others
          db_pass = doc.data().password;

          bcrypt.compare(password, db_pass, function (err, result) {
            if (!result) {
              // password mismatch

              const errors = [{ msg: "Failed! crudentials not matched" }];
              const alert = errors;
              res.render("pages/admin", {
                alert,
              });
            } // end of password mismatch
            else {
              // password matched

              console.log("password matched");
              admin_name = doc.data().name;

              ////////////////////////

              var i = 0,
                j = 0,
                k = 0;

              admin
                .firestore()
                .collection("students_list")
                .doc("5A")
                .collection("list")
                .get()
                .then((val) => {
                  val.forEach((doc) => {
                    collA[i] = {
                      email: doc.id,
                      name: doc.data().name,
                      usn: doc.data().usn,
                    };
                    i++;
                  });
                  ////////

                  admin
                    .firestore()
                    .collection("students_list")
                    .doc("5B")
                    .collection("list")
                    .get()
                    .then((val2) => {
                      val2.forEach((doc) => {
                        collB[j] = {
                          email: doc.id,
                          name: doc.data().name,
                          usn: doc.data().usn,
                        };
                        j++;
                      });

                      admin
                        .firestore()
                        .collection("students_list")
                        .doc("5C")
                        .collection("list")
                        .get()
                        .then((val3) => {
                          val3.forEach((doc) => {
                            collC[k] = {
                              email: doc.id,
                              name: doc.data().name,
                              usn: doc.data().usn,
                            };
                            k++;
                          });
                          lenC = Object.keys(collC).length;
                          /////

                          /////
                          res.render("pages/admin_edit", {
                            admin_name
                            
                          });
                        }); // end of 5C
                    }); // end of 5B
                }); // end of  5A
            } // end of password matched
          });
        } // end of  block for password matching and others
      }) // end of then

      .catch((err) => {
        console.log("Error getting document", err);
        const errors = [{ msg: " Invalid admin crudentials   : " + err }];
        const alert = errors;
        res.render("pages/admin", {
          alert,
        });
      }); // end of catch
  }
});

///////firestore////

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/// getting class on unique day
function getFirestore(uid, current_day, time) {
  const firestore_con = admin.firestore();

  const writeResult = firestore_con
    .collection("faculty")
    .doc(uid)
    .collection(current_day)
    .doc(time)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No  document!");
      } else {
        console.log(doc.data());
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
}

/////////

///  inserting data
async function insertFormData(request) {
  const writeResult = await admin
    .firestore()
    .collection("faculty")
    .add({
      name: request.body.fname,
      email: request.body.email,
      uid: request.body.uid,
      password: request.body.passkey,
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

//////

function randomString(length, chars) {
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function incrementClass(sec, sub) {
  // getting prev count
  let count = 0;
  const liam = admin
    .firestore()
    .collection("students_list")
    .doc(sec)
    .collection("total_classes")
    .doc(sub)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("No  document!");
      } else {
        console.log(doc.data());
        count = parseInt(doc.data().total);
        count++;
        //// if yes , update increment count of classes
        const writeResult = admin
          .firestore()
          .collection("students_list")
          .doc(sec)
          .collection("total_classes")
          .doc(sub)
          .set({
            total: count,
          })
          .then(function () {
            console.log("count of current classes succesfullly done!");
            console.log("value of count ::" + count);
          })

          .catch(function (error) {
            console.error("Error writing document: ", error);
          });
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
  ///count is incremented

  console.log(count);
}

// async function deletekey(key)
// {
//     console.log(key)
//     //await admin.firestore().collection('QR_key').doc(key).delete();
//     console.log(" key is deleted")
// }

//// for qr page scanning

app.post("/scan", (req, res, next) => {
  console.log(c_time);
  console.log("in /scan post method qr ");
  
  if (c_time > 1730 || current_day == "Sunday" || scan_valid == 0) {
    console.log("no class so no qr");
    checkStudent(res);
  } else {
    var rString = randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    get_time();
    var count = 0;
    var str = "";
    var currentdate = date_ob.toDateString();
    var currentclass = rows[0].class;
    var currentsection = rows[0].section;
    console.log(currentdate);
    console.log(currentclass);
    console.log(currentsection);
    console.log(uid);
    console.log(c_time);
    console.log(c_day);
    ////// inserting random key into db
    const writeResult = admin
      .firestore()
      .collection("QR_key")
      .doc(rString)
      .set({
        class: currentclass,
        date: currentdate,
        day: current_day,
        section: currentsection,
        teacher_USN: uid,
        time: c_time,
        valid: 1,
      })
      .then(function () {
        prev_rkey = rString; // storing current random string in prev

        console.log("QR key successfully written!");

        incrementClass(currentsection, currentclass);
        
      })

      .catch(function (error) {
        console.error("Error writing document: ", error);
      });

    //////
    var input_text = rString;
    qrcode.toDataURL(input_text, (err, src) => {
      if (err) res.send("Something went wrong!!");
      res.render("pages/scan", {
        qr_code: src,
      });
      
      setTimeout(deletekey, 10000);
    });
  }
});

function deletekey() {
  console.log("i am inside /delete/key");
  console.log(uid);
  let collectionRef = admin.firestore().collection("QR_key");

  collectionRef
    .where("teacher_USN", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  console.log("deletion worked inside deletekey");
}

/////////////////////////// for admin page ///////////
//// inserting faculty data using ajax
app.post("/addFaculty", (req, res) => {
  fireuid = req.query.uid;
  fires_time = req.query.s_time;
  fireday = req.query.day;
  fireclass = req.query.class;
  firesection = req.query.section;
  firetiming = req.query.timing;
  console.log(fireuid + " " + fires_time);
  try {
    const writeResult = admin
      .firestore()
      .collection("faculty")
      .doc(fireuid)
      .collection(fireday)
      .doc(fires_time)
      .set({
        class: fireclass,
        section: firesection,
        timing: firetiming,
      })
      .then(function () {
        console.log("Document successfully written!");
        res.send(`Successfully inserted data of Faculty  ${req.query.uid}`);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        res.send(
          '<div class="container" "data-aos="fade-up" date-aos-delay="300"> <span style="background-color:#ff8080; color:white;text-align:center;justify-content:center;padding:5px 10px;margin:10px 0;font-size:15px"><i class="fa-solid fa-xmark"></i>  Requested not found </span></div>'
        );
      });
  } catch (err) {
    res.send(
      '<div class="container" "data-aos="fade-up" date-aos-delay="300"> <span style="background-color:#ff8080; color:white;text-align:center;justify-content:center;padding:5px 10px;margin:10px 0;font-size:15px"><i class="fa-solid fa-xmark"></i> Some fields are incorrect </span></div>'
    );
  }
});

app.post("/addStudent", (req, res) => {
  fireusn = req.query.usn.toUpperCase();
  fireemail = req.query.email;
  firename = req.query.name.toUpperCase();
  firesection = req.query.section.toUpperCase();
  const writeResult = admin
    .firestore()
    .collection("students_list")
    .doc(firesection)
    .collection("list")
    .doc(fireemail)
    .set({
      usn: fireusn,
      name: firename,
    })
    .then(function () {
      console.log("Document successfully written!");
      res.send(`Successfully inserted data of  ${rename}`);
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);

      res.send(
        '<div class="container" "data-aos="fade-up" date-aos-delay="300"> <span style="background-color:#ff8080; color:white;text-align:center;justify-content:center;padding:5px 10px;margin:10px 0;font-size:15px"><i class="fa-solid fa-xmark"></i> Some fields are incorrect </span></div>'
      );
    });
});

/// for accessing feedbacks (using ajax)

app.get("/get_feedback", async (req, res) => {
  const feed = await admin.firestore().collection("feedback").get();
  feedbacks = feed.docs.map((doc) => doc.data());
  lenfeed = Object.keys(feedbacks).length;
  var i, feed_data;
  feed_data =
    '<div class="form-outline"><label class="form-label" for="textAreaExample">Queries :</label><table class="table "data-aos="fade-up" date-aos-delay="300"><thead><tr><th scope="col">\'\'</th><th scope="col">Name</th><th scope="col">Email</th><th scope="col">Subject</th><th scope="col">Message</th></tr></thead><tbody>';
  for (i = 0; i < lenfeed; i++) {
    feed_data +=
      '<tr><th scope="row">' +
      (i + 1) +
      "</th><td>" +
      feedbacks[i].name +
      "</td><td>" +
      feedbacks[i].email +
      " </td><td>" +
      feedbacks[i].subject +
      "</td><td>" +
      feedbacks[i].message +
      '</td> <td><button type="button" class="btn btn-danger" style="text-align:center";>delete</button></td></tr>';
  }
  feed_data +=
    '</tbody></table><button type="button" onclick="close_feed()"  class="btn btn-danger" style="text-align: center;" >Close</button></div>';
  res.send(feed_data);
});

app.get("/attendance", (req, res) => {
  console.log("inside get attendance");

  res.render("pages/attendance");
});

app.get("/faculty_check", authenticateToken, function (req, res) {
  checkStudent(res);
  //checkPresent();  // should be called by  get method
});

app.get("/home", authenticateToken, (req, res) => {
  updateCurrClass(uid, fname, res);
});
app.get("/", authenticateToken, function (req, res) {
  updateCurrClass(uid, fname, res);
});

app.get("/:id",  function (req, res) {
  res.render(`pages/${req.params.id}`);
});
