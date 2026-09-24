
const express=require('express')

const app=express()


app.use("/",(req,res)=>
{
    res.send("hello my express  you are in rot ")
})

app.use("/test",(req,res)=>
{
    res.send("hello my express bhai mere kahan h ..you are in ")
})


app.use("/apply",(req,res)=>
{
    res.send("hello my express  ")
})

app.listen(5300,()=>
{
    console.log("sever created successfully at port 5300")
})