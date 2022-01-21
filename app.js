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
    ////
    utcMinute=((date_ob.getUTCMinutes()+30)%60);
    ///
    let x=0;
    if (date_ob.getUTCMinutes()>29){utcHour=utcHour+1;}
    ///
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
     current_day = weekday[d.getDay()];

  
    let c_minutes=String((utcMinute)<10?'0':'') + utcMinute;
     c_time=utcHour+""+c_minutes;
    
    console.log("printing time :"+c_time);

    ////

   
};


var classes={};
var rows={};

var name='';

app.get("/admin",function(req,res){
    res.render('pages/admin')
});

app.get("/contact", function(req,res){
    res.render('pages/contact')
});
app.get("/register", function(req,res){
    res.render('pages/register')
});
app.get("/faculty_check",function(req,res){
    res.render('pages/faculty_check')
});
app.get("/home",(req,res)=>{
    console.log(name);
    console.log(classes);
    console.log(rows);
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
})
app.get("/", function(req,res){
    res.render('pages/login')
});
app.get("/login", function(req,res){
    res.render('pages/login')
});
app.get("/team",function(req,res){
    res.render('pages/team')
})
app.get("/admin_edit",function(req,res){
    res.render('pages/admin_edit')
})

var uniqueid='';
let scan_valid=0;
let start_time=0,end_time=0,s_time='085500';
rows=[{"class":'',"section":'',"timing":''}]


async function updateCurrClass(uid,name,res)
{
    get_time();
      
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
    else if(c_time >=1305 &&c_time <=1400 )
    {

        start_time='01:05 pm';
        s_time='130500';
        end_time='02:00 pm';
        
    }
    else if(c_time>1400&& c_time<1455)
    {
        start_time='02:00 pm';
        s_time='140000';
        end_time='02:55 pm';
    }
    else if(c_time>1455 && c_time<1550)
    {
        start_time='02:55 pm';
        s_time='145500';
        end_time='03:50 pm';
    }
    else 
    {
     
        s_time='160000';
         scan_valid=0;
        rows[0].timing='04:00 pm to 08:55 am',
        rows[0].class='classes are finished...'
    }
    ////
    
    
    const liam = await firestore_con.collection('faculty').doc(uid).collection(current_day).get();
    classes=liam.docs.map(doc => doc.data());
    console.log("listing all classes on current day: : ");
    console.log(classes)
  //////
 
   
            if(c_time <1600 && c_time >0855&&c_day !=0)
          {
              
            firestore_con.collection('faculty').doc(uid).collection(current_day).doc(s_time).get().then(function(doc) {
            rows[0]=doc.data()    
            console.log("current class :-: ");
            console.log(doc.data())
            
            
           
              
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

            else 
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
                current_subject:rows[0].class,
                current_section:rows[0].section,
                current_timing: '04:00 pm   till 08:55 am  next day'})
    

            }
           

}
// end  of update class



app.post('/login', function(req,res,next){
    const uid=String(req.body.uid)
    const password=String(req.body.passkey)
    uniqueid=req.body.uid;
 
    
   
    
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
              
             bcrypt.compare(password, db_pass, function(err, result) {
                if (!result) 
                {// password mismatch
                   
                
                     
                    console.log('password not matched')
                    const errors=[
                       {msg:'Failed! Invalid crudentials..'}
                   ]
                   const alert = errors
                   res.render('pages/login', {
                          alert
                      })
   
                } // end of password mismatch
                
               
              

                else
                { // password matched 
                    name=doc.data().name;
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

 function incrementClass(sec,sub){
    // getting prev count
    let count=0;
    const liam =  admin.firestore().collection('students_list').doc(sec).collection('total_classes').doc(sub).get().then(doc => {
        if (!doc.exists) { console.log('No  document!'); }
        else {
            console.log(doc.data())
            count=parseInt(doc.data().total);
            count++;
              //// if yes , update increment count of classes 
            const writeResult =  admin.firestore().collection('students_list').doc(sec).collection('total_classes').doc(sub).set({
                total: count
            })
            .then(function() {console.log("count of current classes succesfullly done!");
                             console.log("value of count ::"+count)
            })

            .catch(function(error) {console.error("Error writing document: ", error);});
         }
        })
        .catch(err => { console.log('Error getting document', err);});
        ///count is incremented
        
        console.log(count)
    
  

}

//// for qr page
app.post("/scan", (req, res, next) => {
    var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    get_time();
  //
    var currentdate=date_ob.toDateString();
    var currentclass=rows[0].class;
    var currentsection=rows[0].section;
    ////// inserting random key into db
    const writeResult =  admin.firestore().collection('QR_key').doc(rString).set({
        class: currentclass,
        date: currentdate,
        day:current_day ,
        section: currentsection,
        teacher_USN: uniqueid,
        time: c_time,
        valid: 1,
        })
        .then(function()
        {
             console.log("QR key successfully written!");
             incrementClass(currentsection,currentclass);

        })

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
var feeds=[
    {
      email: 'sahilsharan48@gmail.com',
      name: 'SAHILSHARAN',
      message: 'your app is running nicely and thanks for it\r\n',
      subject: 'your app is working nice'
    }]
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

app.post('/addStudent',(req,res)=>{
    fireusn=(req.body.usn).toUpperCase();
    fireemail=req.body.email;
    firename=(req.body.name).toUpperCase();
    firesection=(req.body.section).toUpperCase();

    const writeResult =  admin.firestore().collection('students_list').doc(firesection).collection('list').doc(fireemail).set({
        usn:fireusn,
        name:firename
       })
       .then(function() {console.log("Document successfully written!");
       const errors=[
           {msg:` Successfully inserted data of ${fireusn}`}
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
   
    res.render('pages/admin_edit',{
        admin_name,feeds
    })
  })

