const express=require('express')
const { UserAuth } = require('../middlewares/Auth')
const ConnectionRequest= require('../models/connectionRequest')
const user = require('../models/user')

const userRouter=express.Router()



userRouter.get('/user/requests/receiver',UserAuth,async(req,res)=>
{
  try{const loggedInUser=req.user

  const connectionRequest=await ConnectionRequest.find({
    receiverId:loggedInUser._id,
    status:"interested"
  }).populate('senderId',['firstName','lastName','gender','age','photoURL'])
//  }).populate('senderId',"firstName  lastName"])

 res.json({message:"success",data:connectionRequest}) 
}
catch(err)
{
  res.status(400).send("ERROR :"+err.message)
}
})


userRouter.get('/user/requests/connections',UserAuth,async(req,res)=>
{
    try{
        const loggedInUser=req.user

    const connectionRequest=await  ConnectionRequest.find({  
        $or:[
            {senderId:loggedInUser._id,status:"accepted"},
            {receiverId:loggedInUser._id,status:"accepted"}
        ]
    }).populate('senderId',['firstName','lastName','age','gender']).populate('receiverId',['firstName','lastName','age','gender'])

    const data=connectionRequest.map((row)=> {   
     return  row.senderId._id.equals(loggedInUser._id) ?  row.receiverId : row.senderId          
    })

    res.json({message:"success",data:data})
}
    catch(err)
    {   
        res.status(400).send({message:err.message})
    }
})

module.exports= userRouter