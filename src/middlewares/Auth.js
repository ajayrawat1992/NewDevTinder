
 const AdminAuth= (req,res,next)=>
{
    console.log("you scascac/admin")
    let token="ajayrawat"
    let isAuthorised=  token ==="ajayrawat"
    if(!isAuthorised)
    {
        res.status(401).send("unauthorised accss")
    }
    else{
        next()
    }
}

const UserAuth= (req,res,next)=>
{
    console.log("you are in user")
    let token="ajayrawat"
    let isAuthorised=  token ==="ajayrawat"
    if(!isAuthorised)
    {
        res.status(401).send("unauthorised accss")
    }
    else{
        next()
    }
}

module.exports={AdminAuth,UserAuth}