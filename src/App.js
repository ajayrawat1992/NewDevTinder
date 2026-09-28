
const express=require('express')
  //const {AdminAuth,UserAuth}=require('./middlewares/Auth')
 const connectDb= require('./config/database')
   const User=  require('./models/user')

const app=express()

app.use(express.json())     //this is the middleware which will run for all the methods and it converts incoming json datacoming from end user(who is hittng the API like browser,Postman) to js object   



app.get('/user',async (req,res)=>
{
   //const username=req.body.firstName
   const id=req.body._id
try{
  // const user= await User.findOne({firstName:username})
   const user=await User.findById(id)
    if(!user)
    {
         res.status(404).send("user not found ")
    }
    else{
res.send(user)
   }
}
   catch(err){
   res.status(400).send("something went wrong ")
   }
   
})

app.get('/feed',async(req,res)=>
{
const users=await User.find({})
  try{
  res.send(users)
  }
  catch(err){
    res.status(400).send("something serios went wrong" +err.message)
  }
})





     app.post('/signup',async(req,res)=>
    {
       //console.log(req.body)
        const user=new User(req.body);
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