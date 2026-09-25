
const express=require('express')

const app=express()

// app.use("/user",(req,res)=>
// {
//     res.send("this is user hello ")
// })

app.get("/user",(req,res)=>
{
    res.send({firstname:"ajay",lastname:"rawar"})
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