
const express=require('express')
const connectDb= require('./config/database')
const User=  require('./models/user')
const { validateSignup } = require('./utils/validate')
const bcrypt =  require('bcrypt')
const validator=require('validator')
const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
const {UserAuth} =require('./middlewares/Auth')

const app=express()
app.use(express.json())     //this is the middleware which will run for all the methods and it converts incoming json data coming from end user(who is hittng the API like browser,Postman) to js object   
app.use(cookieParser())  // this is the middleware which will run for all the methods and it converts incoming cookie data coming from end user(who is hittng the API /profile) to js object


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

app.post('/login',async(req,res)=>  // validation  while login
{
try{
 const {emailid,password}=req.body  //req.body will be undefined if we dont use express.json() middleware as it parses the incoming json data to js object and then we can access it using req.body

 if(!validator.isEmail(emailid))
 {
    throw new Error("incorrect format")
 }

 const user= await User.findOne({emailid:emailid})
          //console.log(user);
if(!user)
{
    throw new Error("invalid Credentials")
}

const ispasswordValid= await user.validatePassword(password)  // we have created a method in userSchema to validate password and we are calling that method here to validate password
if(!ispasswordValid)
{
      throw new Error("invalid Credentials")
}
else{

    //res.cookie('token',"xjhAHsfxhjackbckjbcbCVBSKJCVBKSBCV")        //dummhy token
     
   // const token= await jwt.sign({_id:user._id},"Newdevtinder@123",{expiresIn :'1hr'})    //creating token using jwt.sign() method and passing payload and secret key as arguments
    //console.log(token);
      const token= await user.getJWT()  // we have created a method in userSchema to generate token and we are calling that method here to generate token

     res.cookie('token',token,{maxAge:60000})      //sending token to the user in the form of cookie  //cookie will expire in 1 min
    res.send("Login Successful !!")
}

}
catch(err)
{
    res.status(400).send("ERROR : "+err.message)
}
})


app.get('/profile',UserAuth,async (req,res)=>
{
   try{
        const user=req.user          // we can access the user object attached to the request object in the UserAuth middleware 
    res.send(user)
    }
    catch(err)
    {
        res.status(400).send("ERROR : "+err.message)
    }
})

app.post('/sendconnectionrequest',UserAuth,(req,res)=>
{
     const user=req.user
    res.send(  user.firstName  +" sent connection request  successfully")
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

app.post('/signup',async(req,res)=>
    {
         try{                 // always wrap inside try catch block whenever making any database connections.
  //1.validation of  data
      validateSignup(req)   // this is way of validation.to make a helper function and put all validations in it .
      const {firstName,lastName,emailid,password}=req.body

      //2. encrypting the password
    const hashPassword=await bcrypt.hash(password,10)    // encrypting the password
      
        //const user=new User(req.body);  // this is the  bad way of writing
                  const user=new User({
                    firstName,lastName,emailid,password:hashPassword
                  });             
         await user.save()          // it returns promise .so we used async await
         res.send("saved successfully")
      }
      catch(err){res.status(500).send("ERROR : " + err.message)}
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