const mongoose = require('mongoose')

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    otp: {
        type: String, // or Number (but string is easier)
        required: false,
},
    role:{
        type:String,
        enum:['user','admin','superadmin'],
        default:'user'
    },
    tenantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tenant',
        default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports= mongoose.model('User',userSchema)
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
