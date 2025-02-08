var express = require ("express");
let app = express();
let mysql2=require ("mysql2");
app.use(express.json());
var fileUpload = require ("express-fileupload");
app.use(fileUpload());
var cloudinary = require('cloudinary').v2; 
//to connect db
// let config={
//     host:"127.0.0.1",
//     user:"root",
//     password:"asdf",
//     database:"project"
// }

// hosted on render 
// sql is on clever cloud
let config={
    host:"btkwsdixga9umjpped5j-mysql.services.clever-cloud.com",
    user:"uuptinz2zbcrf2hd",
    password:"UjUskK4XvFRa1hVEe8Li",
    database:"btkwsdixga9umjpped5j",
    dateStrings:true,
    // keepAliveInitialDelay: 10000, 
    // enableKeepAlive: true, 
 maxIdle: 0,
idleTimeout: 60000,
enableKeepAlive: true,
}
app.use (express.static("public"))
var mysql=mysql2.createConnection(config);
mysql.connect(function(err){ 
    if(err==null)
    {
        console.log("connected to database successfully");
    }
    else
     console.log(err.message);
})
// starting server
app.listen(2025,function(req,resp){
    console.log("Server Has Been Started :)");
})
// index file
app.get("/",function(req,resp){
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
})
//ajax signup
app.get("/signup-process",function(req,resp)
{
    
    console.log(req.query);
    let status=1;
    let email=req.query.txtEmail;
    let pwd=req.query.pwd;
    let utype=req.query.combo;
    
    mysql.query("insert into users values(?,?,?,1)",[email,pwd,utype,status],function(err)
    {
        if(err==null)
        {
            resp.send("SignedUp Successfullyy")
        }
        else
            console.log(err.message);
    })
})
//ajax login 
app.get("/login-process",function(req,resp)
{
    let email=req.query.txtEmaill;
    let txtPwd=req.query.txtPwd;
    mysql.query("select * from users where email=? and pwd=?",[email,txtPwd],function(err,result)
    {
        if(err!=null)
        {
            resp.send(err.message); return;
        }
        if(result.length==0)
        {
            resp.send("Invalid Id or Password");return;''
        }
        if(result[0].status==1)
        {
            resp.send(result[0].utype); return;
        }
        else{
            resp.send("You Are Blocked!!!"); return;
        }
    })
})
// send dashboard
app.get("/dashboard",function(req,resp)
{
    let path=__dirname+"/public/dashboard.html";
    resp.sendFile(path);
})
// send dash profile 
app.get("/dash-profile",function(req,resp)
{
    let path=__dirname+"/public/dash-profile.html";
    resp.sendFile(path);
})
// dash profile submit
app.post("/curd-submit",async function(req,resp)
{
    let fileName="nopic.jpg";
    if(req.files!=null)
        {
            fileName=req.files.ppic.name;
            let path=__dirname+"/public/uploads/"+fileName;
            //req.files.ppic.mv(path);
            await cloudinary.uploader.upload(path)
            .then(function(result){
                fileName=result.url;
            })
        }
        else
        fileName="nopic.jpg";
            console.log(req.body.iadd);
    mysql.query("insert into infprof values(?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.inputEmail4 ,fileName,req.body.iadd,
            req.body.ilast,req.body.igender,req.body.idate,req.body.inputAddress,req.body.inputCity,req.body.inputState,
            req.body.inputZip,req.body.iinsta,req.body.ifacebook,req.body.iyt],function(err) 
    {
        
            if(err==null)
                    resp.send("/");
            else
                    resp.send(err.message);
    })

});
// update dash-profile 
app.post("/curd-update",function(req,resp)
{
    console.log(req.body);

    let fileName="";
    if(req.files!=null)
        {
            fileName=req.files.ppic.name;
           let path=__dirname+"/public/uploads/"+fileName;
           req.files.ppic.mv(path);
        }
        else
        {
            fileName=req.body.hdn;
        }   
    mysql.query("update infprof set ppic=?, fname=? , lname=?,gender=? , dob=? ,addr=?,city=?,state=? , zip=?,insta=?,fb=?,yt=? where email=?",[fileName,req.body.iadd,
        req.body.ilast,req.body.igender,req.body.idate,req.body.inputAddress,req.body.inputCity,req.body.inputState,
        req.body.inputZip,req.body.iinsta,req.body.ifacebook,req.body.iyt,req.body.inputEmail4],function(err,result)
    {
        if(err==null)//no error
        {
               if(result.affectedRows>=1) 
                   resp.send("Updated  Successfulllyyyy....");
                else
                    resp.send("Invalid Email ID");
        }
    else
        resp.send(err.message);
    })

});
// post events 
app.get("/check-post-events",function (req,resp)
{
    console.log(req.query);
    mysql.query("insert into events values(null,?,?,?,?,?,?)",[req.query.txtEmail,req.query.ititle,req.query.idate,req.query.itime,
        req.query.icity,req.query.ivenue],function(err,result){
    if(err==null)
    {
        resp.send("Success!!!");
        return;
    }
    else{
        resp.send(err.message);
        return;
    }
    console.log(result);
    resp.send(result);
})
})
// change password
app.get("/change-pass", function (req, resp) {
    console.log(req.query);

    mysql.query(
        "UPDATE users SET pwd=? WHERE email=? AND pwd=?",
        [req.query.txtPwdn, req.query.txtEmaill, req.query.txtPwdo],
        function (err, result) {
            if (err) {
                console.error(err);
                resp.send(err.message);
                return;
            }
            if (result.affectedRows === 0) {
                resp.send("Invalid Email or Password");
                return;
            }
            resp.send("Password Changed Successfully!");
        }
    );
});
// admin panel
app.get("/admin-pannel",function(req,resp)
{
    let path=__dirname+"/public/admin-pannel.html";
    resp.sendFile(path);
});
// user management
app.get("/user-man",function(req,resp)
{
    let path=__dirname+"/public/user-manager.html";
    resp.sendFile(path);
});
// influencer manager 
app.get("/inf-console",function(req,resp)
{
    let path=__dirname+"/public/inf-manager.html";
    resp.sendFile(path);
});
// -----------------------------
// user managerment ka fetch all enail send to combo box
app.get("/fetch-all-emails",function(req,resp)
{
    mysql.query("select distinct email from users",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message); return;
            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
})
// all data
app.get("/fetch-all",function(req,resp)
{
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })

})
// filter as per email
app.get("/fetch-some",function(req,resp)
{
    mysql.query("select * from users where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
})
app.get("/del-one",function(req,resp)
{
    mysql.query("delete from users where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
            resp.send("Deleted");  
    })
})
app.get("/block-one",function(req,resp)
{
    mysql.query("UPDATE users SET status = 0 WHERE email = ? ",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
            resp.send("Blocked");
    })
})
app.get("/resume-one",function(req,resp)
{
    mysql.query("UPDATE users SET status = 1 WHERE email = ? ",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
            resp.send("Resumed");
    })
})
app.get("/fetch-all-data",function(req,resp)
{
    mysql.query("select distinct email from infprof",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
})

app.get("/fetch-all-inf",function(req,resp)
{
    mysql.query("select * from infprof",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
})
app.get("/influ-finder",function(req,resp)
{
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
});

// influ-finder ka content
app.get("/do-find",function(req,resp)
{
    console.log("lol");
    //console.log(req.query.fields);
    mysql.query("select * from infprof where fb like ? && city = ? ",["%"+req.query.fields+"%",req.query.city],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultJsonAry);
    })
})
app.get("/do-findbyname",function(req,resp)
{
    console.log("wmk");
    //console.log(req.query.fields);
    mysql.query("select * from infprof where fname like ?",["%"+req.query.pname+"%"],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultJsonAry);
    })
})
app.get("/find-influ", function(req,resp) {
    //console.log("check find infu")
    mysql.query("select * from  infprof where fb like ?",["%"+req.query.fields+"%"] , function(err,resultJsonAry)
    {
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/events-manager",function(req,resp){
    let path=__dirname+"/public/events-manager.html";
    resp.sendFile(path);
})
app.get("/fetch-all-events",function(req,resp)
{
    mysql.query("select * from events where email=?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
})
app.get("/fetch-all-event-view",function(req,resp)
{
    mysql.query("select * from events",function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
       resp.send(resultJsonAry);//sending array of json object 0-1
    })
})
app.get("/del-one-event",function(req,resp)
{
    mysql.query("delete from events where email=? and rid=?",[req.query.email,req.query.rid],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
            resp.send("Deleted");  

    })
})


// /for search deets
app.get("/find-user-details",function(req,resp)
{
    let email= req.query.txtEmail;
   
    mysql.query("select * from infprof where email=?",[email],function(err,resultJsonAry){
        if(err!=null)
            {
                resp.send(err.message);
                return;

            }
        console.log(resultJsonAry);
            resp.send(resultJsonAry);//sending array of json object 0-1
    })

})