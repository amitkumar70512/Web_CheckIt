
    var el = document.getElementById('close-toast');
    if(el){
    el.addEventListener('click', close, false);
    }
    var dl = document.getElementById('toast');
    if(dl){
    dl.addEventListener('click', close, false);
    }
    function close(){
        document.getElementById('toast').style.animationDuration="800ms";
        document.getElementById('toast').style.animationName="toasthide";
        setInterval(()=>{
            document.getElementById('toast').style.display="none";
        },700);
        
    }
