// scroll function controlling scroll  in faculty welocme page
function scroll_window(x,y)
{
   window.scrollTo(x, y);
}



///// for cookies

let x=document.cookie;
function getCookie()
{
   console.log("printing all cookies from browser:::>");
   console.log(x);
}