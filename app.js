const admin = require('firebase-admin');
const functions = require('firebase-functions');
var alert = require('alert');
var serviceAccount = require("./privatekey.json");
const qrcode = require("qrcode");
 
const express = require('express');

const port = process.env.PORT || 3000;

const path=require('path');
const bodyParser= require('body-parser');
const {check, validationResult}=require('express-validator');
const { Console } = require('console');
const ejs = require('ejs');


// for encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

let date_ob = new Date();
var app = express();  

const { join } = require('path');
  

const { start } = require('repl');

app.use(bodyParser.urlencoded({
	extended:true
}));



app.use(express.static('public'));
  
app.set('view engine', 'ejs');


// To Run the server with Port Number  
app.listen(port,()=> console.log(`Express server is running at port no :${port}`));  
 


  

//      for date

let date,month,year,current_day,c_time;// global
let c_day=date_ob.getDay();

 function get_time () {
    let ts = Date.now();

    let date_ob = new Date(ts);
    utcHour=((date_ob.getUTCHours()+5)%24);
    console.log(utcHour)
    utcMinute=((date_ob.getUTCMinutes()+30)%60);
    console.log(utcMinute)
    let x=0;
    if (date_ob.getUTCMinutes()==30){utcHour=utcHour+1;}
    
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
     current_day = weekday[d.getDay()];

     console.log(date_ob.getHours())
     console.log(date_ob.getMinutes())
  
    let c_minutes=String((utcMinute)<10?'0':'') + utcMinute;
     c_time=utcHour+""+c_minutes;
    
    console.log("printing time  "+c_time);

    ////

   
};



var log_time=0;


app.get("/admin",function(req,res){
    res.render('pages/admin')
});

app.get("/contact", function(req,res){
    res.render('pages/contact')
});
app.get("/register", function(req,res){
    res.render('pages/register')
});



app.get("/", function(req,res){
    res.render('pages/login')
});
app.get("/login", function(req,res){
    res.render('pages/login')
});
app.get("/team",function(req,res){
    res.render('pages/team')
})


let uniqueid;

let start_time=0,end_time=0,s_time='085500';

rows=[{"subject":" ","section":" ","timing":" "}]

async function updateCurrClass(uid,name,res)
{
    get_time();
      log_time=c_time;
    const firestore_con  =  admin.firestore();
    if(c_time>=0855 && c_time <=0950)
    {
        start_time="08:55 am";
        s_time='085500';
        end_time='09:50 am';

    }
    else if(c_time>=0950 && c_time <=1045)
    {
        start_time='09:50 am';
        s_time='095000';
        end_time='10:45 am';
    }
    else if(c_time>=1045 && c_time <=1115)
    {
        start_time='10:45 am';
        s_time='104500';
        end_time='11:15 am'
    }
    else if(c_time >=1115 && c_time<=1210)
    {
        start_time='11:15 am';
        s_time='111500';
        end_time='12:10 pm';
    }
    else if((c_time >=1210 )&&(c_time <=1305))
    {

        start_time='12:10 pm';
        s_time='121000';
        end_time='01:05 pm';
        
    }
    else if(c_time >=1305 &&c_time <=1600 )
    {

        start_time='01:05 pm';
        s_time='130500';
        end_time='02:00 pm';
        
    }
    else 
    {
     
        s_time='160000';
         
        rows[0].subject='classes are finished...'
    }
    ////
    console.log("inside updateclass start time : "+ start_time)
    console.log("inside update class c-time is"+ c_time)
    console.log(log_time)
   
    const liam = await firestore_con.collection('faculty').doc(uid).collection(current_day).get();
    classes=liam.docs.map(doc => doc.data());
 
    console.log(classes)
  //////

   
            if(c_time <1600 && c_time >0855&&c_day !=0)
          {
              
            firestore_con.collection('faculty').doc(uid).collection(current_day).doc(s_time).get().then(function(doc) {
            rows[0]=doc.data()    
           
            console.log("printing rows")
            console.log("s time is ;"+ s_time)
            console.log(doc.data())
            console.log(rows[0].section)
            
           
              
///////
            res.render('pages/faculty_welcome',{
                log_time,
                name,
                section1 : classes[0].section,
                aspect1:classes[0].class,
                timing1: classes[0].timing,

                section2 : classes[1].section,
                aspect2:classes[1].class,
                timing2: classes[1].timing,

                section3: classes[2].section,
                aspect3:classes[2].class,
                timing3: classes[2].timing,

                section4: classes[3].section,
                aspect4:classes[3].class,
                timing4: classes[3].timing,

                day:current_day,
                current_subject:rows[0].class,
                    current_section:rows[0].section,
                   current_timing:rows[0].timing

                
                })


            })// end of firestore_con collection
            .catch(err => { console.log('Error getting document', err);});
            }

            else 
             {
                
                res.render('pages/faculty_welcome',{
                   log_time,
                    name,
                section1 : classes[0].section,
                aspect1:classes[0].class,
                timing1: classes[0].timing,

                section2 : classes[1].section,
                aspect2:classes[1].class,
                timing2: classes[1].timing,

                section3: classes[2].section,
                aspect3:classes[2].class,
                timing3: classes[2].timing,

                section4: classes[3].section,
                aspect4:classes[3].class,
                timing4: classes[3].timing,

                    day:current_day,
                    current_subject:rows[0].subject,
                    current_section:rows[0].section,
                   current_timing: '04:00 pm   till 08:55 am  next day'
                   
    
                    
                    })
    

            }
           

}
// end  of update class



app.post('/login', function(req,res,next){
    const uid=String(req.body.uid)
    const password=String(req.body.passkey)
    uniqueid=req.body.uid;
    console.log(req.body.uid);
    console.log(password)
    
   
    
    const firestore_con  =  admin.firestore();
    const writeResult = firestore_con.collection('faculty').doc(req.body.uid).get()
    .then(doc => {
        if (!doc.exists) // entered uid doesnt registered
        { 
            console.log('No such document!');
            const errors=[
                {msg:' Failed!  Invalid Crudentials..'}
            ]
            const alert = errors
            res.render('pages/login', {
                alert
            })

        }
        else { // block for password matching and others
              db_pass=doc.data().password;
              //console.log(doc.data());
             
             console.log(db_pass)  
             bcrypt.compare(password, db_pass, function(err, result) {
                if (!result) {// password mismatch
                   
                
                     
                    console.log('password not matched')
                    const errors=[
                       {msg:'Failed! Invalid crudentials..'}
                   ]
                   const alert = errors
                   res.render('pages/login', {
                          alert
                      })
   
                 } // end of password mismatch
                
               
              

                else{ // password matched 
                   
                    console.log("password matched");
                    uniqueid=uid;
                    updateCurrClass(uid,doc.data().name,res);
                           ////////////////////////
                    
               
                  
                    
                                  }// end of password matched

            });

             }// end of  block for password matching and others





        
     }) // end of then

    .catch(err => {
         console.log('Error getting document', err);
         const errors=[
            {msg:'Failed! '+err}
        ]
        const alert = errors
        res.render('pages/login', {
               alert
           })
     }); // end of catch
    
  

    
});



 

// for register.ejs
app.post('/register', [
    check('name', 'Please enter valid username without space..')
        .exists()
        .isLength({ min: 3 })
        .isAlpha(),
    check('email', 'Please provide valid email')
        .isEmail()
        
        .normalizeEmail(),

    check('uid','please provide unique id')   
           .isLength(10)
           .isAlphanumeric(),
           
    check(
            "passkey",
            " password must have  at least one  number and minumum length 5. ",
          )
      .isLength({ min: 5 })
      .matches(
        
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,20}$/,
              ),
 check('confirmpasskey', 'Passwords do not match').custom((value, {req}) => (value === req.body.passkey)),
            

], async(req, res)=> {
   
    const errors = validationResult(req)
   
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('pages/register', {
            alert
        })
    }

    else{// if no errors
       
    
        console.log(req.body.name);
        console.log(req.body.email);
        console.log(req.body.uid);
        console.log(req.body.passkey);
       
    
        const encryptkey = await bcrypt.hash(req.body.passkey, saltRounds)
        ////

        



        const writeResult = await admin.firestore().collection('faculty').doc(req.body.uid).set({
            name: req.body.name,
            email: req.body.email,
            
            password: encryptkey
            })
            .then(function() 
            {
                console.log("Document successfully written!");
                res.render('pages/login')
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
                // Already exist 
                        console.log("error in inserting")
                        const errors=[
                             {msg:'Request Denied !! Uable to registet.'}
                         ]
                         const alert = errors
                         res.render('pages/register', {
                                alert
                            })
              
            
            });
                             

     }
     
})



// working fine

app.post('/feedback',  [
    check('name', 'Please enter valid username without space..')
        .exists()
        .isLength({ min: 3 })
        .isAlpha(),
    check('email', 'Please provide valid email !!')
        .isEmail()
        .normalizeEmail(),
    check('subject',' invalid subject !!')    
           .exists()
           ,
    check(
            "message",
            "Invalid message body!!"  )
      
       .isLength({min:10})


]
    , async function(req, res) {
        const errors = validationResult(req)
   
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('pages/contact', {
            alert
        })
    }
    else
    {
      
        
      
    
       



        const writeResult = await admin.firestore().collection('feedback').doc(req.body.name+" "+ req.body.subject).set({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
            })
            .then(function() 
            {
                console.log("feedback inserted succesfully using node");
                const errors=[
                    
                    {msg:"Thank you '" + req.body.name.toUpperCase() + "'  for contacting us...."}
                ]
                const message = errors
                res.render('pages/contact', {
                    message
                }) 
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
                // Already exist 
                        console.log("error in inserting")
                        const errors=[
                            {msg:'  Failed ! Error .. '}
                         ]
                         const alert = errors
                         res.render('pages/contact', {
                                alert
                            })
              
            
            });
            


                        

      
        
    }
})



// for admin login
var admin_name="";

app.post('/verify',(req,res)=>{
    const key=String(req.body.admin_key)
    const password=String(req.body.passkey)


       
    
    const firestore_con  =  admin.firestore();
    const writeResult = firestore_con.collection('admins').doc(req.body.admin_key).get()
    .then(doc => {
        if (!doc.exists) // entered uid doesnt registered
        { 
            console.log('No such document!');
            const errors=[
                {msg:' Failed!  Invalid Crudentials..'}
            ]
            const alert = errors
            res.render('pages/login', {
                alert
            })

        }
        else { // block for password matching and others
              db_pass=doc.data().password;
              //console.log(doc.data());
             
             console.log(db_pass)  
             bcrypt.compare(password, db_pass, function(err, result) {
                if (!result) {// password mismatch
                   
                
                     
                    console.log('password not matched')
                    const errors=[
                       {msg:'Failed! crudentials not matched'}
                   ]
                   const alert = errors
                   res.render('pages/admin', {
                          alert
                      })
   
                 } // end of password mismatch
                
               
              

                else{ // password matched 
                   
                    console.log("password matched");
                    admin_name=doc.data().name;

                           ////////////////////////
                    
               
                    res.render('pages/admin_edit',{
                        admin_name
                    })
                    
                                  }// end of password matched

            });

             }// end of  block for password matching and others





        
     }) // end of then

    .catch(err => {
         console.log('Error getting document', err);
         const errors=[
            {msg:' Invalid admin crudentials   : '+err}
        ]
        const alert = errors
        res.render('pages/admin', {
               alert
           })
     }); // end of catch
    
  




});

///////firestore////

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    
  });




/// getting class on unique day
 function getFirestore(uid,current_day,time){
    const firestore_con  =  admin.firestore();
  
    const writeResult =  firestore_con.collection('faculty').doc(uid).collection(current_day).doc(time).get().then(doc => {
    if (!doc.exists) { console.log('No  document!'); }
    else {
       console.log(doc.data())
      
     }
    })
    .catch(err => { console.log('Error getting document', err);});
    
    }



/////////






///  inserting data
async function insertFormData(request){
    const writeResult = await admin.firestore().collection('faculty').add({
    name: request.body.name,
    email: request.body.email,
    uid: request.body.uid,
    password: request.body.passkey
    })
    .then(function() {console.log("Document successfully written!");})
    .catch(function(error) {console.error("Error writing document: ", error);});
    }







//////


function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}



//// for qr page
app.post("/scan", (req, res, next) => {
    var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    console.log(rString)
    get_time();
    var currentdate=date_ob.getDate();
    var currentday=date_ob.getDay()
    ////// inserting random key into db
    const writeResult =  admin.firestore().collection('QR_key').doc(rString).set({
        class: rows[0].subject,
        
        date: currentdate,
        
        day:currentday ,
        
        section: rows[0].section,
        
        teacher_USN: uniqueid,
        
        time: c_time,
        
        valid: 1,
        
      
        })
        .then(function() {console.log("Document successfully written!");})
        .catch(function(error) {console.error("Error writing document: ", error);});



    /////
    var input_text=rString
      qrcode.toDataURL(input_text, (err, src) => {
      if (err) res.send("Something went wrong!!");
      res.render("pages/scan", {
        qr_code: src,
      });
    });
  });



  app.post('/faculty_welcome',(req,res)=>{
      res.sendFile('')
  })




/////////////////////////// for admin page ///////////
  ////
  app.post('/firedb',(req,res)=>{
     fireuid=req.body.uid;
     fires_time=req.body.s_time;
     fireday=req.body.day;
     fireclass=req.body.class;
     firesection=req.body.section;
     firetiming=req.body.timing;

     const writeResult =  admin.firestore().collection('faculty').doc(fireuid).collection(fireday).doc(fires_time).set({
        class:fireclass,
        section:firesection,
        timing:firetiming
        })
        .then(function() {console.log("Document successfully written!");
        const errors=[
            {msg:` Successfully inserted data of ${fireuid}`}
        ]
        const alert = errors
        res.render('pages/admin_edit', {
               admin_name,alert,feeds
           })

        })
        .catch(function(error) {console.error("Error writing document: ", error);
        const errors=[
            {msg:'Failed to insert into database'}
        ]
        const alert = errors
        res.render('pages/admin_edit', {
               admin_name,feeds
           })

        });



    
  })





  /// for accessing feedbacks 

  app.post('/access_feedback',async(req,res)=>{
    const feed =  await admin.firestore().collection('feedback').get();
    classes=feed.docs.map(doc => doc.data());
    console.log(classes)
    var feeds=[
        {
          email: 'sahilsharan48@gmail.com',
          name: 'SAHILSHARAN',
          message: 'your app is running nicely and thanks for it\r\n',
          subject: 'your app is working nice'
        }]
    res.render('pages/admin_edit',{
        admin_name,feeds
    })
  })

