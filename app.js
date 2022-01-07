import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
////////
const firebaseConfig = {
    apiKey: "AIzaSyB9vf35PvTY5fB6ESiHrJFTdU9M649xUy4",
    authDomain: "checkit-bc113.firebaseapp.com",
    projectId: "checkit-bc113",
    storageBucket: "checkit-bc113.appspot.com",
    messagingSenderId: "378432004868",
    appId: "1:378432004868:web:d5cac753009000c728a651",
    measurementId: "G-1FYDLBV2D4"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  
///////

const mysql = require('mysql');  
const express = require('express');  
const port = process.env.PORT || 3000;
const path=require('path');
const bodyParser= require('body-parser');
const {check, validationResult}=require('express-validator');
const { Console } = require('console');
const ejs = require('ejs');

const qrcode=require('qrcode');
// for encryption
const bcrypt = require('bcrypt');
const saltRounds = 10;

let date_ob = new Date();
var app = express();  

const { join } = require('path');
  
const log_f= require('./public/assets/js/script_sign');
const admin_f=require('./public/assets/js/admin-handler');

app.use(bodyParser.urlencoded({
	extended:true
}));



app.use(express.static('public'));
  
app.set('view engine', 'ejs');

// Connection String to Database  
var mysqlConnection = mysql.createConnection({  
    host: 'localhost',  
    user : 'root',  
    password : '7051251928',   
    database : 'appdev',  
    multipleStatements : true  
});  




// To check whether the connection is succeed for Failed while running the project in console.  
mysqlConnection.connect((err) => {  
    if(!err) {  
        console.log("Db Connection Succeed");  
    }  
    else{  
        console.log("Db connect Failed \n Error :" + JSON.stringify(err,undefined,2));  
    }  
});  
  

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
    current_day=date_ob.getDay();
    
    let c_hours=String(date_ob.getHours());
    let c_minutes=String(date_ob.getMinutes());
     c_time=c_hours+""+c_minutes+"00";
    console.log("printing time  "+c_time);
};

 // get registered details 
 app.get('/checkdatabase',(req,res)=>{
    
    mysqlConnection.query('select * from sign_in_faculty',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else 
        console.log(err);
    })
    
});

function check_database()
{
    mysqlConnection.query('select * from sign_in_faculty',(err,rows,fields)=>{
        if(!err)
        res.send(rows);
        else 
        console.log(err);
    })
}


function wow()
{
    console.log("inside wow")
}






















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
app.get("/attendance", function(req,res){
    let data = {
        name:"Employee Name",
        age:27,
        department:"Police",
        id:"aisuoiqu3234738jdhf100223"
    }
    let stringdata = JSON.stringify(data)
    res.render('pages/attendance')
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







//   delete the registration data based on  email
// app.get('/:id',(req,res)=>{
//     // mysqlConnection.query('delete from Registration where email_id=?',[req.params.id],(err,rows,fields)=>{
//     //     if(!err)
//     //     res.send("deletion successful where email_id=?",[req.params.id]);
//     //     else
//     //     console.log(err);
//     // })
//     res.render('pages/req.params.id');
//    });  
//  app.get('/:id',(req,res)=>{
//      res.send('pages/?',req.params.id)
//  })

 

// for register.ejs
app.post('/submit', [
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
            " Minimum eight characters, at least one letter and one number. ",
          )
      .isLength({ min: 6 })
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
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
        var email=String(req.body.email);
        var Name=String(req.body.name);
       
        var  uid = String(req.body.uid);
        var passkey=String(req.body.passkey)
        var confirmpasskey = String(req.body.confirmpasskey);
    
        console.log(req.body.name);
        console.log(req.body.email);
        console.log(req.body.uid);
        console.log(req.body.passkey);
       
    
        const encryptkey = await bcrypt.hash(passkey, saltRounds)
        
        mysqlConnection.query("SELECT COUNT(*) AS cnt FROM sign_in_faculty WHERE uid = ? " , uid , function(err , data)
        {
            
                if(err){
                    console.log(err);
                       }   
             else{
                    if(data[0].cnt > 0)
                    {  
                        // Already exist 
                        console.log("User already exist")
                        const errors=[
                             {msg:'Request Denied !! User Account already exists..'}
                         ]
                         const alert = errors
                         res.render('pages/register', {
                                alert
                            })
                            
                    }
                    else{
                        var sql = "INSERT INTO `sign_in_faculty`(`uid`,`email`,`password`,`name`,`status`) VALUES ('"+uid+"','"+email+"','"+encryptkey+"','"+Name+"','"+0+"')";
                       mysqlConnection.query(sql, function(err, result) 
                            {
                            if(err) throw err;
                            console.log("values inserted succesfully using node");
                            const errors=[
                                {msg:'Horray !  Logged in successfully...'}
                            ]
                            const success = errors
                            
                               
                                setTimeout(function() {
                                   
                                }, 2000 * 4);
                                res.render('pages/login')

                            })
                        
                            
                        }
              }
        })
    

     }
     
})





app.post('/login',async function(req,res,next){
    var uid=String(req.body.uid)
    const password=String(req.body.passkey)

    console.log(uid)
    console.log(password)
    
    const encryptkey = await bcrypt.hash(password, saltRounds)   

    mysqlConnection.query("select count(*) as cnt from sign_in_faculty where uid=?",uid,function(err,data){
if(err){
    console.log(err);

}else{
    if(data[0].cnt>0)
    {
        mysqlConnection.query("select password  from sign_in_faculty where uid=?",uid,async (err,results)=>
     {
         
        console.log("db encrypted password" +results[0].password)
        const comparison = await bcrypt.compare(password, results[0].password)       
        if(err){
            console.log(err);
            res.render('pages/login')
        }
        else{
            if(!comparison)
            {
                 
                 console.log('password not matched')
                 const errors=[
                    {msg:'Failed! Invalid crudentials..'}
                ]
                const alert = errors
                res.render('pages/login', {
                       alert
                   })
            }
            else{
                
                var sql = "UPDATE sign_in_faculty SET status = 1 WHERE uid = '"+uid+"'  ";
                var namesql= "SELECT name FROM sign_in_faculty WHERE  uid = '"+uid+"'  ";
                var faculty_classes= "SELECT section FROM faculty_on_unique_day where uid = '"+uid+"'  ";
                var faculty_subjects= "SELECT subject FROM faculty_on_unique_day where uid = '"+uid+"'  ";
                var start_time = "SELECT start_time FROM faculty_on_unique_day where uid= '"+uid+"'  ";
                var end_time = "SELECT end_time FROM faculty_on_unique_day where uid= '"+uid+"'  ";
                mysqlConnection.query(sql, function(err, result) 
                     {
                     if(err) throw err;
                     console.log("password matched, everything looks gud , go to fac welcome page");
                    //  const message=[
                    //      {msg:'Horray !  Logged in successfully...'}
                    //  ]
                    //  const success = message
                    //  res.render('pages/login', {
                    //        success
                    //     })

                    log_f.signin();
                     

                    mysqlConnection.query(namesql, function(err, resultname) 
                     {
                     if(err) throw err;
                        mysqlConnection.query(faculty_classes, function(err,sections) 
                        {
                            if(err) throw err;
                            mysqlConnection.query(faculty_subjects, function(err, subjects) 
                            {
                             if(err) throw err;

                             mysqlConnection.query(start_time, function(err, stime) 
                             {
                              if(err) throw err;
                              
                             mysqlConnection.query(end_time, function(err, etime) 
                             {
                              if(err) throw err;


                              get_time();
                              mysqlConnection.query('SELECT * FROM faculty_on_unique_day WHERE uid = ? AND day=? AND start_time <= ? AND end_time >= ?',[uid,current_day,c_time,c_time] ,(err,rows,fields)=>{
                                if(err) throw err;  
                                
                                console.log("query successful");
                                    
                                console.log(rows);
                                console.log(current_day); 
                                log_f.signin 
                             

                                const name=resultname[0].name// faculty name
                                
                                var len_c=sections.length// no of sections 
                                console.log("length of sections "+len_c)
                                console.log(subjects)
                                console.log(sections)
                                console.log(stime)
                                console.log(etime)
                                
                                    if(rows.length==0)
                                    {
                                    
                                    rows=[{"subject":"dont have class","section":null,"start_time": null,"end_time":null}]
                                    console.log(rows)
                                    }
                                    else{}

                                    res.render('pages/faculty_welcome',{
                                    name,
                                    section1 : sections[0].section,
                                    aspect1:subjects[0].subject,
                                    starttime1:stime[0].start_time,
                                    endtime1:etime[0].end_time,

                                    section2:sections[1].section,
                                    aspect2:subjects[1].subject,
                                    starttime2:stime[1].start_time,
                                    endtime2:etime[1].end_time,

                                    section3:sections[2].section,
                                    aspect3:subjects[2].subject,
                                    starttime3:stime[2].start_time,
                                    endtime3:etime[2].end_time,

                                    section4:sections[3].section,
                                    aspect4:subjects[3].subject,
                                    starttime4:stime[3].start_time,
                                    endtime4:etime[3].end_time,


                                    current_subject:rows[0].subject,
                                    current_section:rows[0].section,
                                    current_start_time:rows[0].start_time,
                                    current_end_time:rows[0].end_time

                                    
                                    })
                                
                                })  
                            })
                        })
                    })
                })    
                     

            })

                 
               })
            }
        }
   })
}
    
else {
        console.log('no such username');
      
        const errors=[
            {msg:'Sorry !  Invalid crudentials..'}
        ]
        const alert = errors
        res.render('pages/login', {
               alert
           })
        }


    }
    })

    

});


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
    , function(req, res) {
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
        var mail=String(req.body.email);
        var fullname=String(req.body.name);
        var subject=String(req.body.subject)
        
        var message=String(req.body.message)
   
      
        var sql = "INSERT INTO `feedback`(`username`,`email`,`subject`,`message`) VALUES ('"+fullname+"','"+mail+"','"+subject+"','"+message+"')";
                    mysqlConnection.query(sql, function(err, result) 
                            {
                            if(err){
                            
                            const errors=[
                                {msg:'Failed! Error ..'}
                            ]
                            const alert = errors
                            res.render('pages/contact', {
                                alert
                            }) 
                            throw err;
                            
                            }
                            else{
                            console.log("feedback inserted succesfully using node");
                            const errors=[
                                
                                {msg:"Thank you '" + fullname.toUpperCase() + "'  for contacting us...."}
                            ]
                            const message = errors
                            res.render('pages/contact', {
                                message
                            }) 
                            }

                            })
        
    }
})



// for admin login
app.post('/verify',async function(req,res,next){
    var id=String(req.body.admin_key)

    const password=String(req.body.passkey)
   
    console.log(id)
    console.log(password)
     key="70512";
    if(password==key&&(id=="anisha"||id=="amit"||id=="aishu")){
        if  (id=="anisha"){ admin_name="anisha ";}
        else if (id == "aishu"){ admin_name="aishwariya ";}
        else{admin_name="Sinnga";}

        faculties="";
        faculty_ids="";
        faculty_emails="";
        faculty_names="";
        
        
        res.render('pages/admin_edit')
   
    }
    else{
        console.log('invalid password or admin key');
  
        const errors=[
            {msg:'Sorry !  Invalid crudentials..'}
        ]
        const alert = errors
        res.render('pages/admin', {
               alert
           })
      
        
    }
 })

 app.post('/search',(req,res)=>{
   var id=String(req.body.id);  
    mysqlConnection.query('select name from sign_in_faculty where uid = ?',id,(err,rows,fields)=>{
        if(!err)
        { admin_name="amit";
            faculty_ids="";
            faculty_emails="";
            faculty_names="";  
         faculties=JSON.stringify(rows);   
        res.render('pages/admin_edit')
        }
        else 
        {
            console.log('invalid search '+id);
    
            const errors=[
                {msg:'Sorry !  Invalid crudentials..'}
            ]
            const alert = errors
            res.render('pages/admin_edit', {
                alert
            })
        }
    })
    
});



// for displaying current subject according to current time

app.get('/faculty/:uid',(req,res)=>{
    get_time();
    mysqlConnection.query('SELECT * FROM faculty_on_unique_day WHERE uid = ? AND day=? AND start_time <= ? AND end_time >= ?',[req.params.uid,current_day,c_time,c_time] ,(err,rows,fields)=>{
        if(!err)
        {
        console.log("query successful");
          current_fac_subject:rows[0].subject;
          current_fac_section:rows[0].section;
          current_fac_start_time:rows[0].start_time;
          current_fac_end_time:rows[0].end_time;
        console.log(rows[0].subject);
        console.log(rows)
        }
        else 
        console.log(err);
    })
    console.log(req.params);
    console.log("current time is " +c_time);
    console.log("current day is " +current_day);
    
    res.send('pages/login');
       });  




const nameuser="amit"

// module exports

module.exports= {check_database, wow ,nameuser};