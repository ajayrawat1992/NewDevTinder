  const validator= require('validator')


const validateSignup=(req)=>
{
const {firstName,lastName,emailid,password}=req.body

if(!firstName || !lastName)
{
    throw new Error("Kindly enter Name")
}

if(!validator.isEmail(emailid))
{
    throw new Error("emailid is not correct format")
}

if(!validator.isStrongPassword(password))
{
    throw new Error("password is not strong")
}

}


module.exports={validateSignup}