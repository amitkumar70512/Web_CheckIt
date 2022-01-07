
// error= function(error){
//    if(error.responseText == 'showAlert')
//        alert("Please enter correct user name and password.")

var mailcheck=  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
var mailcheckclg= /^[a-zA-Z]+.[a-z0-9]+@[a-z]+.[a-z]+[a-z]$/;
var fcheck= /^[a-zA-Z ]{2,30}$/;

function validatemail()
{
   var check1=document.getElementById('email').value;
   



    if(check1==''){
        //automatically handled
    }
   //  else if(mailcheck.test(check1)){
   //   document.getElementsByName('email')[0].placeholder=check1; 
      
   //   }
     else if(mailcheckclg.test(check1)){
      
     }
     else{
        document.getElementsByName("email")[0].value="";
        document.getElementsByName('email')[0].placeholder='please enter valid email';
       
     }

   }
function validatename()
{
  

   var naam=document.getElementById('name').value;
   
 var flength=naam.length;
   var out=0;
   if(naam==''){
    document.getElementsByName("name")[0].value="";
    document.getElementsByName("name")[0].placeholder='please fill out name correctly';
   } 
   else if(flength<=2){
    document.getElementsByName("name")[0].value="";
    document.getElementsByName("name")[0].placeholder='please fill out name correctly';

   }
   else if(fcheck.test(naam)){}

     else{
        document.getElementsByName("name")[0].value="";
        document.getElementsByName("name")[0].placeholder='please fill out name correctly';
     }
      
     }
     

     
function validatecontact()
{
  
 

   var checkmob=document.getElementByName("contact").value;
   var mobcheck=/^[6-9][0-9]{9}$/;

   if(checkmob==''){
    document.getElementsByName("contact")[0].value="";
    document.getElementsByName("contact")[0].placeholder='please fill out field correctly';
   } 
   else if(mobcheck.test(checkmob))// if valid
   {

     }

     
     else{
        document.getElementsByName("contact")[0].value="";
        document.getElementsByName("contact")[0].placeholder='please fill out field correctly';
     }

}
function validatepass()
{
  

   var passone=document.getElementByName("passkey").value;
   var passowrdcheck=/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

   var minNumberofChars = 6;
    var maxNumberofChars = 16;
     
    
    if(passone.length < minNumberofChars || passone.length > maxNumberofChars){
        document.getElementsByName("passkey")[0].value="";
        document.getElementsByName("passkey")[0].placeholder='Invalid length !! please fill out name correctly';
      // alert("password length should be lesser than 16 and greater than 6");
    }
    else if(!passowrdcheck.test(passone)) {
        document.getElementsByName("passkey")[0].value="";
        document.getElementsByName("passkey")[0].placeholder='Invalid  please fill out name correctly';
        alert("password should contain atleast one number and one special character");
     
    }
   else if (passone==''){
    document.getElementsByName("passkey")[0].value="";
    document.getElementsByName("passkey")[0].placeholder='Invalid length !! please fill out name correctly';
   } 
  
     
}



function validatereg(){
   var passone=document.getElementByName("passkey").value;

   var passtwo=document.getElementByName("confirmpasskey").value;
      if(passone==passtwo){

      }
      else{
        document.getElementsByName("confirmpasskey")[0].value="";
        document.getElementsByName("confirmpasskey")[0].placeholder='password mismatch';
      }
  // var pass2=
}


     // for feedback in contact page

function validatefeedback(){
 validatename();
    console.log('name validation done')
validatemail();
console.log('mail validation done')

}
function fun()
{
console.log('hi in fun')
}

//for subsciber 
function validatesubscribe(){
    validatemail();
    console.log('mail validation done')
}


function validatelogin(x){
    validatemail();
    console.log('mail vaidation done');
}


