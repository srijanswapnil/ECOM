import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    address: {
        type: String,
        required: true
    },
    answer:{
        type:String,
        reqyuired:true
    },
    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
export default mongoose.model('users',userSchema)