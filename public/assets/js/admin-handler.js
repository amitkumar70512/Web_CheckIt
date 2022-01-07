const app_fun=require('../../../app')

const status=0
function feedback()
{
    prompt("inside feedback")
    
app_fun.wow();

}

function check_faculties()
{
    const fid=prompt("Enter faculty id ")
}


function check_students()
{
    console.log("checking students")
}

function check_db()
{
    console.log("checking database")
    app_fun.check_database();
}



module.exports = {feedback,check_faculties,check_students,check_db};