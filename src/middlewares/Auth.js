const jwt=require('jsonwebtoken')
const User=require('../models/user') 

const UserAuth= async (req,res,next)=>
{

   try{ 
    const {token}=req.cookies  // accessing the token from the cookies  //here we cookie-parser middleware is used to access the cookies from the request object
    if(!token)
    {
        throw new Error("unauthorised access")
    }

    const decoded=await jwt.verify(token,"Newdevtinder@123")  // validating  the token using jwt.verify() method and passing token and secret key as arguments
       const {_id}=decoded
       
       const user=await User.findById(_id)
     if(!user)
        {
            throw new Error("user not found")   //in case that user is deleted/not present from the database but the token is still present in the cookies
        }  
        req.user=user   // attaching the user object to the request object so that we can access it in the next middleware or route handler       
       next()
    }
   catch(err)
   {
    res.status(400).send("ERROR : "+err.message)
   }

}

module.exports={UserAuth}