const express=require('express')
const { UserAuth } = require('../middlewares/Auth')
const ConnectionRequest= require('../models/connectionRequest')
const User = require('../models/user')

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

userRouter.get('/feed',UserAuth,async(req,res)=>
{
  try{  
    const loggedInUser=req.user
    const page= parseInt(req.query.page) || 1
    let limit=parseInt(req.query.limit) || 10
     limit= limit>50?50:limit              
    const skip=(page-1)*limit     

  const connectionRequests=await ConnectionRequest.find({               // to get all the connections(sent or received or accepted)
    $or:[{senderId:loggedInUser._id},{receiverId:loggedInUser._id}]
  }).select("senderId receiverId status")

   const  hideUsersFromFeed=new Set()   // for no duplications

   connectionRequests.forEach((req)=>                  // adding all the ids(received or sent ) in set
{
    hideUsersFromFeed.add(req.senderId.toString())
    hideUsersFromFeed.add(req.receiverId.toString())
})
  // console.log(hideUsersFromFeed)

   const users=  await User.find({
    $and:[{_id:{$nin:Array.from(hideUsersFromFeed)}},{_id:{$ne:loggedInUser._id}}]   //all the above id's should not be present  and loggedin user should also not present
   }).select("firstName lastName age gender photoURL ").skip(skip).limit(limit)  

  res.send(users)
}
catch(err)
{
    res.status(400).send(err.message)
}
})

module.exports= userRouter