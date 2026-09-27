
const express=require('express')
  //const {AdminAuth,UserAuth}=require('./middlewares/Auth')

const app=express()



//error handling using express.  but the good is to use Always use try catch  .using it ..it will not go to another route


app.get('/getalldata',(req,res)=>
{
    try{
        throw new Error("iuwgdsjkgdkabkd")
  res.send("user data sent")
}
    catch (err){
   res.status(500).send("something awful")
    }
})

app.use('/',(err,req,res,next)=>      //always write this  at the end 
{
    if(err)
    {
        res.status(500).send("some trype od  error")
    }
})





app.get('/user/',(req,res)=>
{
   // console.log(req.query)         ///gives parameter after(?) ex /user?userid=13569871
    res.send(` heloo checkkkkkk`)   
})


app.patch("/user",(req,res)=>
{
    //  console.log("user updated success");
    res.send("user updated success")
    
})

app.delete("/user",(req,res)=>
{
    res.send("deleted success")
})

app.post('/user',(req,res)=>
{
res.send("posted successfully")
})


app.listen(5300,()=>
{
    console.log("sever created successfully at port 5300")
})