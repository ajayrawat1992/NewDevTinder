
const express=require('express')

const requestRouter=express.Router()
const {UserAuth}=  require('../middlewares/Auth')


requestRouter.post('/sendconnectionrequest',UserAuth,(req,res)=>
{
     const user=req.user
    res.send(  user.firstName  +" sent connection request  successfully")
})

module.exports=requestRouter