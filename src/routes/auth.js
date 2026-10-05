

const express = require('express');
const { validateSignup } = require('../utils/validate')
const bcrypt =  require('bcrypt')
const validator=require('validator')
 const User=  require('../models/user')

const authRouter=express.Router()

authRouter.post('/signup',async(req,res)=>
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

    
authRouter.post('/login',async(req,res)=>  // validation  while login
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


module.exports=authRouter