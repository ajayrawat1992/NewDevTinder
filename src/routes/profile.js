
const express=require('express')
const profileRouter=  express.Router()
const {UserAuth}=  require('../middlewares/Auth')


profileRouter.get('/profile',UserAuth,async (req,res)=>
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


module.exports=profileRouter