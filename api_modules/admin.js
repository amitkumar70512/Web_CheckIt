
export function get_section(sec)
{
    var i,j;
    console.log(sec);
    var section='<table class="table "data-aos="fade-up" date-aos-delay="300"><thead><tr><th scope="col">\'#\'</th><th scope="col">Name</th><th scope="col">USN</th><th scope="col">Email</th></tr></thead><tbody>';
    console.log( Object.keys(sec).length);
    len=Object.keys(sec).length;
    for(i=0;i<len;i++){
        section+='<tr><th scope="row">'+
            (i+1)+
            '</th><td>'
            +  sec[i].name + 
            '</td><td>' + sec[i].usn +
            '</td><td>' + sec[i].email+ 
            '</td></tr>';
    }
    section+='</tbody></table>';
    console.log(section);
    return section;
}

