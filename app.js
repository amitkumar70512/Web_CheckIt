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





app.post('/login2',async function(req,res,next){
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
      
        
      
    
       



        const writeResult = await admin.firestore().collection('feedback').doc(req.body.email).set({
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


///////firestore////

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    
  });

/// getting data
async function getFirestore(){
    const firestore_con  = await admin.firestore();
    const writeResult = firestore_con.collection('faculty').doc('faculty_doc').get().then(doc => {
    if (!doc.exists) { console.log('No such document!'); }
    else {return doc.data();}})
    .catch(err => { console.log('Error getting document', err);});
    return writeResult
    }



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

// module exports
