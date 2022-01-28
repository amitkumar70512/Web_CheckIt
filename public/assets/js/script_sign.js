// scroll function controlling scroll  in faculty welocme page
function scroll_window(x,y)
{
   window.scrollTo(x, y);
}



///// for cookies
function getCookie(cname) {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(';');
   for(let i = 0; i <ca.length; i++) {
     let c = ca[i];
     while (c.charAt(0) == ' ') {
       c = c.substring(1);
     }
     if (c.indexOf(name) == 0) {
       return c.substring(name.length, c.length);
     }
   }
   return "";
 }

function getCookie()
{
   console.log("printing all cookies from browser:::>");
   if(decodeURIComponent(document.cookie)!='')
   {
      console.log("user is logged in");
      document.getElementById('user_login').style.display="none";
   }
   
  
  
}