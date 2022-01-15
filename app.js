var {QRGenerator} = require('dynamic-qr-code-generator');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

var serviceAccount = require("./privatekey.json");

 
const express = require('express');

const port = process.env.PORT || 3000;

const path=require('path');
const bodyParser= require('body-parser');
const {check, validationResult}=require('express-validator');
const { Console } = require('console');
const ejs = require('ejs');

//const qrcode=require('qrcode');
// for encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

let date_ob = new Date();
var app = express();  

const { join } = require('path');
  
//const log_f= require('./public/assets/js/script_sign');
const admin_f=require('./public/assets/js/admin-handler');
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

 function get_time () {
    let ts = Date.now();

    let date_ob = new Date(ts);
     date = date_ob.getDate();
     month = date_ob.getMonth() + 1;
     year = date_ob.getFullYear();
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
     current_day = weekday[d.getDay()];
    let c_hours=String(date_ob.getHours());
    let c_minutes=String((date_ob.getMinutes()<10?'0':'') + date_ob.getMinutes());
     c_time=c_hours+""+c_minutes+"00";
     
    console.log("printing time  "+c_time);
};






app.get("/admin",function(req,res){
    res.render('pages/admin')
});
app.get("/index", function(req,res){
    res.render('pages/index')
});
app.get("/contact", function(req,res){
    res.render('pages/contact')
});
app.get("/register", function(req,res){
    res.render('pages/register')
});


app.get("/services", function(req,res){
    res.render('pages/services')
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





let start_time=0,end_time=0,s_time='085500';

rows=[{"subject":" ","section":" ","start_time": start_time,"end_time":end_time}]

async function updateCurrClass(uid,name,res)
{
    get_time();

    const firestore_con  =  admin.firestore();
    if(c_time>=085500 && c_time <=095000)
    {
        start_time="08:55 am";
        s_time='085500';
        end_time='09:50 am';

    }
    else if(c_time>=095000 && c_time <=104500)
    {
        start_time='09:50 am';
        s_time='095000';
        end_time='10:45 am';
    }
    else if(c_time>=104500 && c_time <=111500)
    {
        start_time='10:45 am';
        s_time='104500';
        end_time='11:15 am'
    }
    else if(c_time >=111500 && c_time<=121000)
    {
        start_time='11:15 am';
        s_time='111500';
        end_time='12:10 pm';
    }
    else if((c_time >=121000 )&&(c_time <=130500))
    {

        start_time='12:10 pm';
        s_time='121000';
        end_time='01:05 pm';
        
    }
    else if(c_time >=130500 &&c_time <=160000 )
    {

        start_time='01:05 pm';
        s_time='010500';
        end_time='02:00 pm';
        
    }
    else if (c_time >=160000)
    {
        start_time = '04:00 pm';
        s_time='160000';
        end_time=' next day till 08:55 am'
        rows[0].subject='classes are finished...'
    }
    ////
    console.log("inside updateclass start time : "+ start_time)
    console.log("inside update class c-time is"+ c_time)

   
    const liam = await firestore_con.collection('faculty').doc(uid).collection(current_day).get();
    classes=liam.docs.map(doc => doc.data());
 
    console.log(classes)
  //////

   
            if(c_time <160000)
          {
              
            firestore_con.collection('faculty').doc(uid).collection(current_day).doc(s_time).get().then(function(doc) {
            rows[0]=doc.data()    
           
            console.log("printing rows")
            console.log("s time is ;"+ s_time)
            console.log(doc.data())
            console.log(rows[0].section)
            
           
              
///////
            res.render('pages/faculty_welcome',{
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

            else if (c_time > 160000)
             {
                
                res.render('pages/faculty_welcome',{
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
                   current_timing:rows[0].timing
    
                    
                    })
    

            }
           

}
// end  of update class



app.post('/login', function(req,res,next){
    const uid=String(req.body.uid)
    const password=String(req.body.passkey)

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
            uid: req.body.uid,
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


app.post('/register2',async (request,response) =>{
    var insert = await insertFormData(request);
    var alert = await getFirestore();
    console.log("reading from firestore" +alert)
    //response.render('pages/login',{alert});
    response.sendStatus(200);
    });






//////




// module exports
