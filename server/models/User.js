const mongoose= require('mongoose');
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    phone:{
        type:String,
    },
    gender:{
        type:String,
        enum:['Male','Female'],
    },
    image:{
        type:String,
    },
});
module.exports= mongoose.model('User',UserSchema);