

const mongoose=require('mongoose')


const userSchema=new mongoose.Schema({   //schema tells us the informationsof the user that we are storing in database.
    firstName:{
     type:String
    },
    lastName:{
        type:String
    },
    age:{
        type:Number
    },
    emailid:{
        type:String
    },
    password:{
        type:String
    },
    gender:{
        type:String
    }
})

module.exports=mongoose.model('User',userSchema)    // we insert any user under this model 