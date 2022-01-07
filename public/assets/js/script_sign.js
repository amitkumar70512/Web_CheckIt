const app_func= require('../../../app')


var login_status=0
function signin()
{
   console.log("setting status to  on" ) 
   login_status=1
    
}

function scroll_window(x,y)
{
   window.scrollTo(x, y);
}



function take_attendance()
{
   
}

function showqr()
{
   prompt("showing qr")
}



function demo()
{
  // prompt("inside demo")
   prompt(app_func.nameuser)
   app_func.wow
}


module.exports= {signin};