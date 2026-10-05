

const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')


const userSchema=new mongoose.Schema({   //schema tells us the informationsof the user that we are storing in database.
    firstName:{
     type:String,
     required:true,
     minLength:4,
     maxLength:10,
     trim:true
    },
    lastName:{
        type:String,
        trim:true
    },
    age:{
        type:Number,
        min:18
    },
    emailid:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value)
        {
          if(!validator.isEmail(value))
          {
            throw new Error("emailid not in correct format :" +value)
          }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value)    // this is custom validation and we have used validator package here
        {
            if(!validator.isStrongPassword(value))
            {
                throw new Error("not strong password")
            }
        }
        
    },
    gender:{
        type:String,
        validate(value){                                      // this is custom validation
           if( !['male','female','others'].includes(value))
           {
            throw new Error("gender data is not valid")
           }
        }
    },
    photoURL:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/020/120/848/non_2x/user-icon-fake-photo-sign-profile-button-simple-style-social-media-poster-background-symbol-user-brand-logo-design-element-user-t-shirt-printing-for-sticker-free-vector.jpg",
        validate(value)
        {
            if(!validator.isURL(value))
            {
                throw new Error("invalid URL") 
            }
        }
        
    },
    about:{
        type:String,
        default:" this is default explanation of the users"
    },
    skills:{
        type:[String]
    }

},{timestamps:true})


userSchema.methods.getJWT= async function()
{
    const user=this
    const token= await jwt.sign({_id:user._id},"Newdevtinder@123",{expiresIn :'1hr'})

    return token
}


userSchema.methods.validatePassword= async function(passwordInputByUser)
{
    const user=this
    const isPasswordValid= await bcrypt.compare(passwordInputByUser,user.password)  // dont interchange the order of the arguments in bcrypt.compare() method as it will give wrong result if we change the order of the arguments
    return isPasswordValid
}

module.exports=mongoose.model('User',userSchema)    // we insert any user under this model 