 var spin=document.getElementById('cover-spin');
 var selectedValue;
function loadAjax()
{
    var ddl = document.getElementById("get_ajax");
     selectedValue = ddl.options[ddl.selectedIndex].value;
    console.log("ajax button is clicked");
   
    var xhttp= new XMLHttpRequest();
    
    xhttp.onprogress = function () {
        console.log('LOADING', xhttp.readyState); // readyState will be 3
        spin.style.display='block';
    };
    xhttp.onload = function () {
        console.log('DONE', xhttp.readyState); // readyState will be 4
        spin.style.display='none';
    };
    xhttp.onreadystatechange=function(){
       
        if(this.readyState==4 && this.status==200)
        {
           
            console.log('inside ready state 4 status okk')
            document.getElementById('ajaxLoad').innerHTML=this.responseText;
        }
    };
    xhttp.open('GET',`check/${selectedValue}`,true);
    setInterval(xhttp.send(),5000);
}

