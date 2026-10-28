const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:[true,'Username already exists'],
        required:true,
    },

    email:{
        type:String,
        unique:[true,'Account alrealy exist'],
        require:true,
    },

    password:{
        type:String,
        require:true
    }
})

const userModel=mongoose.model("user",userSchema)

module.exports=userModel