var {QRGenerator} = require('dynamic-qr-code-generator');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

var serviceAccount = require("./fir-auth-192c5-firebase-adminsdk-l63k0-6240fba284.json");

 
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
    let c_minutes=String(date_ob.getMinutes());
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



var curr_subject='';
var curr_section='';

// for login


app.post('/login',async function(req,res,next){
    const uid=String(req.body.uid)
    const password=String(req.body.passkey)

    console.log(req.body.uid);
    console.log(password)
    
   
    
    const firestore_con  = await admin.firestore();
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
                    get_time();
                   
                           ////////////////////////
                    let start_time=0,end_time=0;
                    
                    if(c_time>=085500 && c_time <=095000)
                    {
                        start_time="08:55 am";
                        end_time='09:50 am';

                    }
                    else if(c_time>=095000 && c_time <=104500)
                    {
                        start_time='09:50 am';
                        end_time='10:45 am';
                    }
                    else if(c_time>=104500 && c_time <=111500)
                    {
                        start_time='10:45 am';
                        end_time='11:15 am'
                    }
                    else if(c_time >=111500 && c_time<=121000)
                    {
                        start_time='11:15 am';
                        end_time='12:10 pm';
                    }
                    else if((c_time >=121000 )&&(c_time <=130500))
                    {

                        start_time='12:10 pm';
                        end_time='01:05 pm';
                        
                    }
                    else if((c_time >=010500 ))
                    {

                        start_time='12:10 pm';
                        end_time='01:05 pm';
                        
                    }
                    ////
                    console.log("inside login start time : "+ start_time)

                    
                  console.log(getFirestore(uid,current_day,start_time))
                   


                    

                     rows=[{"subject":"dont have class","section":null,"start_time": start_time,"end_time":end_time}]
                   
                  
                    
                   const name=doc.data().name;
                    res.render('pages/faculty_welcome',{
                        name,
                        section1 : '4a',
                        aspect1:'cn',
                        starttime1:'085500',
                        endtime1:'095000',

                        section2:'5a',
                        aspect2:'tfcs',
                        starttime2:'09500',
                        endtime2:'104500',

                        section3:'4c',
                        aspect3:'networking',
                        starttime3:'111500',
                        endtime3:'121000',

                        section4:'5D',
                        aspect4:'project work',
                        starttime4:'121000',
                        endtime4:'010500',

                        day:current_day,
                        current_subject:curr_subject,
                        current_section:curr_section,
                        current_start_time:rows[0].start_time,
                        current_end_time:rows[0].end_time

                        
                        })

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
 function getFirestore(uid,current_day,start_time){
    const firestore_con  =  admin.firestore();
    console.log(start_time)
    const s_time=''+start_time;
    const writeResult = firestore_con.collection('faculty').doc(uid).collection(current_day).doc(s_time).get().then(doc => {
    if (!doc.exists) { console.log('No such document!'); }
    else {
       console.log( doc.data().section)
       console.log("inside get firestore")
       curr_subject=doc.data().class;
       curr_section=doc.data().section;
       console.log(curr_section)
      return curr_section;
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