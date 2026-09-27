
const express=require('express')
  const {AdminAuth,UserAuth}=require('./middlewares/Auth')

const app=express()

// app.use("/user",(req,res)=>
// {
//     res.send("this is user hello ")
// })

//app.use("/user",[rh1,rh2,rh3])

app.use('/user',UserAuth,(req,res)=>
{
  res.send ("this is user auth")
})



app.get('/admin',AdminAuth)                        //this is clean way of writing middlewares

app.get('/admin/getdata',(req,res)=>
{
    res.send("getdata is ready   ") 
})






// //these are the two ways we can  define routes 1. next to route handler 2. make another route  
// app.use('/',(req,res,next)=>
// {
//    console.log('you are in /use method ')
//    next()
// })

// app.get('/user', (req, res,next) => { 
//     console.log(req.params)
    
//     next()
//     //res.send(`tehese ${req.params.id}`)  // it will give error 
// },(req,res,next)=>
// {
//     console.log("2nsd  response")
// next()
// },(req,res,next)=>
// {
// console.log("3rdd respniosn")
// //res.send('3rdd respniosn')
// next()
// },(req,res)=>
// {
// res.send("4th response")
// });




app.get('/user/',(req,res)=>
{
   // console.log(req.query)    ///gives parameter after(?) ex /user?userid=13569871
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