const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const accountScehma = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required :true
    },
    balance:{

        type:Number,
        required:true
    }
})

const Account = mongoose.model("Accounts", accountScehma);

const User = mongoose.model("User", userSchema);

module.exports = {
    User,Account
}