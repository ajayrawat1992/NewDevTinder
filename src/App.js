
const express=require('express')
const connectDb= require('./config/database')
const User=  require('./models/user')

const cookieParser=require('cookie-parser')
//const jwt=require('jsonwebtoken')
//const {UserAuth} =require('./middlewares/Auth')

const app=express()
app.use(express.json())     //this is the middleware which will run for all the methods and it converts incoming json data coming from end user(who is hittng the API like browser,Postman) to js object   
app.use(cookieParser())  // this is the middleware which will run for all the methods and it converts incoming cookie data coming from end user(who is hittng the API /profile) to js object

const authRouter=require('./routes/auth')
const profileRouter=require('./routes/profile')
const requestRouter=require('./routes/request')

app.use('/',authRouter)      //Use the router object authRouter.For every incoming request whose path starts with / and pass it to the routes defined inside authRouter
app.use('/',profileRouter)
app.use('/',requestRouter)

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

app.delete('/user',async (req,res)=>
{
    const id=req?.body?.userid

    try
    {
         //const user=await User.findByIdAndDelete({_id:id})
        //const user=await User.findByIdAndDelete(id)
        const user=await User.deleteMany({})  //to empty the collection
        res.send("deleted success")
    }
    catch(err)
    {res.status(400).send("sme error")} 
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

app.patch('/user/:userid',async(req,res)=>  // we can pass the userid in url as  example in this case as userid cant be updated
    {
        const id=req.params?.userid    
        //console.log(id);
        
        const data=req.body
        console.log(data);     
        
try{
     const ALLOWED_UPDATES=['userid',"password","about","skills"]  // if i dont want to update email,gender otr enter new while updating then this is API level validation

        const isAllowed_updates= Object.keys(data).every((k)=>
        {
            return ALLOWED_UPDATES.includes(k)
        })
     
        if(!isAllowed_updates)
        {
            throw new  Error("updation not allowed")
        }

        if(data?.skills?.length >4 || data?.skills?.length < 2  )
        {
            throw new Error("skills should be between 2 and 4")
        }
       

const user=await User.findByIdAndUpdate({_id:id} ,data,{runValidators:true})  //by default runvalidators is off validate function run on new document not updations by default.we have to enable it on updates also
res.send("updated success")
}

catch(err)
{
    res.status(400).send("not found "+err.message)
}
})






connectDb()
.then(()=>{
    console.log("database connected")
     app.listen(5300,()=>
{
    console.log("server created successfully at port 5300")
})
    })
.catch(err=>console.log("database not connected"))



// here first database is created then started the application(or listen port) .that is why we have written code of promise here 
//otherwise vice-versa can create problems