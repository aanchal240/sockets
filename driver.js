const mongoose=require('mongoose')
const driverSchema=new mongoose.Schema({
    driverName:{
        type:String,
        required:true
    }
})
const Driver=mongoose.model('driver',driverSchema)
module.exports=Driver