const express = require("express");
const app = express();
const mongoose = require('mongoose');

app.use(express.json())

const {user} = require('./routes/user.js') 
const {account}= require('./routes/Account.js')

app.use("/user", user )
app.use("/account", account)

const main = async () => {
    try {
        await mongoose.connect("mongodb+srv://Limitless:123123123@appledb.yhy8h.mongodb.net/Paytm?retryWrites=true&w=majority");
        app.listen(3000, console.log("Server up!"))

    } catch (error) {
        console.log(error);
    }
}
main();
