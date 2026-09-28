const {  mongoose } = require("mongoose");

const connectDb= async ()=>
{
    await mongoose.connect("mongodb+srv://ajayrawat1871_db_user:KfauZ77jAWwk9Vaf@cluster-ajay.oul5acs.mongodb.net/devTinder")
}
// we are connecting to the cluster/databasename //as it returns promise so we wrapped it inside async await


module.exports=connectDb
