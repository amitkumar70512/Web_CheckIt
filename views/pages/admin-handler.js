 var spin=document.getElementById('cover-spin');
function loadAjax()
{
    console.log("ajax button is clicked");
    user='amitkumar';
    var xhttp= new XMLHttpRequest();
    xhttp.onload=function()
    {
        console.log('loading...');
        spin.style.display='block';
    }
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200)
        {
            
            document.getElementById('ajaxLoad').innerHTML=this.responseText;
        }
    };
    xhttp.open('GET','./demo.txt',true);
    xhttp.send();
}

function show()
{
 console.log('i am inside show');
 spin.style.display='block';
}

function close()
{
 console.log('i am inside close button');
 spin.style.display="none";
}