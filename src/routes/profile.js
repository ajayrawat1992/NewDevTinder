const express=require('express')
const profileRouter=  express.Router()
const {UserAuth}=  require('../middlewares/Auth')
const  {validateEditProfileData}  =   require('../utils/validate')
const validator= require('validator')
const bcrypt=  require('bcrypt')



profileRouter.get('/profile/view',UserAuth,async (req,res)=>
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

profileRouter.get('/profile/edit',UserAuth, async (req,res)=>
{
  try{
    //validateEditProfileData(req)   // this is way of validation.to make a helper function and put all validations in it .    
    if(!validateEditProfileData(req))
    {
        throw new Error("invalid edit request")
    }

    let loggedInUser=req.user
        //console.log("loggedInUser before : ",loggedInUser)

    Object.keys(req.body).forEach((key)=>
    {
        loggedInUser[key]=req.body[key]
    })

    //console.log("loggedInUser after : ",loggedInUser)
    await loggedInUser.save()

    res.json({message:"profile updated successfully",user:loggedInUser})
}
 catch(err)
 {
    res.status(400).send('ERROR : '+err.message) 
 }

    
})

profileRouter.patch('/profile/changePassword',UserAuth,async (req,res)=>
{
    try{
   const{oldPassword,newPassword}=req.body

   const loggedInUser=req.user

    const isoldPasswordvalid=  await loggedInUser.validatePassword(oldPassword) 
    
    if(!isoldPasswordvalid)
    {
        throw new Error("invalid old password")
    }

    if(!validator.isStrongPassword(newPassword))
    {
        throw new Error("new password is not strong")
    }

    const hashnewPssword=await bcrypt.hash(newPassword,10)    // encrypting the password

    loggedInUser.password=hashnewPssword
    await loggedInUser.save()
    res.send("password changed successfully")

}
catch(err)
{
    res.status(400).send("ERROR : "+err.message)
}

})



module.exports=profileRouter