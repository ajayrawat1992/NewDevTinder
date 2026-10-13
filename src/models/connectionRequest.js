
const mongoose=require('mongoose')
const User=  require('./user')


const connectionRequestSchema=new mongoose.Schema({
    senderId:{
     type:mongoose.Schema.Types.ObjectId,
     required:true,
     ref:'User'  // reference to User collection
    },    
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum:{
      values:["ignored","interested","accepted","rejected"],  
      message:`{VALUE} is not supported`
        }
    }},{timestamps:true})


    connectionRequestSchema.index({senderId:1,receiverId:1})   // this is compound index which will ensure that there is only one connection request between two users in any direction. It will prevent duplicate requests between the same sender and receiver. The index is created on the combination of senderId and receiverId fields, which means that the combination of these two fields must be unique across all documents in the collection. This will help to avoid duplicate requests between the same sender and receiver.  

    connectionRequestSchema.pre('save',  function()
    {
        const connectionRequest=this    //this refers to the current document being saved
        if(connectionRequest.senderId.equals(connectionRequest.receiverId))
        {
            throw new Error("You cannot send request to yourself")
        }
       
    })

module.exports=mongoose.model('ConnectionRequest',connectionRequestSchema)