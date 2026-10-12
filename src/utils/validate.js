  
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

const validateEditProfileData=(req)=>
{
    const allowedEditFields=['firstName','lastName','age','gender','about','skills','photoURL']

    const isAllowedUpdate=Object.keys(req.body).every((k)=>
    {
        return allowedEditFields.includes(k)
    })
  
    return isAllowedUpdate


}


module.exports={validateSignup,validateEditProfileData}