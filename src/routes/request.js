const express=require('express')
const {UserAuth}=  require('../middlewares/Auth')
const ConnectionRequest=   require('../models/connectionRequest')
const User=require('../models/user')
const authRouter = require('./auth')

const requestRouter=express.Router()


requestRouter.post('/request/send/:status/:toUserId',UserAuth,async(req,res)=>
{
try{    const senderId=req.user._id
    const receiverId=req.params.toUserId
    const status=req.params.status

      const validStatus=["ignored","interested"]
      if(!validStatus.includes(status))
      {
        return res.json({message:"Invalid status : " + status})
      }
 
      // if(receiverId.toString()==senderId.toString())
      // {
      //   return res.json({message:"You cannot send request to yourself"})
      // }

      const receiverUser=await User.findById(receiverId)
      if(!receiverUser)
      {
        return res.status(404).json({message:"User not found"})
      }

      const existingConnectionRequest=await ConnectionRequest.findOne({  //this query becomes expensive(slow as our database size is huge) as it needs to check both senderId and receiverId in both directions. To optimize this query, we can create a compound index on the senderId and receiverId fields in the ConnectionRequest schema. This will allow MongoDB to quickly find documents that match either of the two conditions in the $or operator.
        $or:[
          {senderId:receiverId,receiverId:senderId},
          {senderId,receiverId}
        ]
      })

      if(existingConnectionRequest)
      {
        return res.status(400).send({message:"Request already exists !!"})
      }

      const connectionRequest=new  ConnectionRequest({senderId,receiverId,status})
      
    const data=await connectionRequest.save()
    res.json({message:"request sent successfully",data:data})
}
catch(err)
{
    res.status(400).send("ERROR : "+err.message)
}
})


requestRouter.post('/request/review/:status/:requestId',UserAuth,async (req,res)=>
{
     try{
      const loggedInUser=req.user      
      const {status,requestId}=req.params

     const Allowed_Updates=['accepted','rejected']
     if(!Allowed_Updates.includes(status))
     {
     return  res.status(400).json({message:"status not allowed"})
     }

     const connectionrequest=await ConnectionRequest.findOne({
       _id:requestId,              //requestId tells the route which specific connection-request record the user wants to accept or reject
       receiverId:loggedInUser._id,
       status:"interested"
     })

     if(!connectionrequest)
     {
      return res.status(404).json({message:"connection request not found"})
     }

     connectionrequest.status=status;

     const data=await connectionrequest.save()
     res.json({message:"cpnnection request "+status ,data})
    }
   catch(err)
   {
   res.send("ERROR : "+err.message)
   }
 

})



module.exports=requestRouter