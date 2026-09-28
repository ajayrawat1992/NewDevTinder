
const express=require('express')
  //const {AdminAuth,UserAuth}=require('./middlewares/Auth')
 const connectDb= require('./config/database')
   const User=  require('./models/user')

const app=express()

     app.post('/signup',async(req,res)=>
    {
        const user=new User({      // here we have created a new instance of User model
            firstName:"llaksha",
            lastname:"ruman",
            emailid:"hghja@yahooo.com",
            password:"56789"
        });
      try{                            // always wrap inside try catch block whenever making any database connections.
         await user.save()          // it returns promise .so we used async await
         res.send("saved successfully")
      }
      catch(err){res.status(500).send("some error" + err.message)}
    })



connectDb()
.then(()=>{
    console.log("database connected")
     app.listen(5300,()=>
{
    console.log("sever created successfully at port 5300")
})
    })
.catch(err=>console.log("database not connected"))



// here first database is created then started the application(or listen port) .that is why we have written code of promise here 
//otherwise vice-versa can create problems