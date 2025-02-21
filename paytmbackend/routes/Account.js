const { Router, response } = require('express');
const router = Router();
const {auth} = require('../middlewares/authentication.js')

const { User, Account} = require('../db')
const jwt = require('jsonwebtoken');
const user = require('./user.js');
const mongoose = require('mongoose')
const secret = "897n092q3ei[-53dy7bb8"


router.get('/balance',auth, async (req, res)=>{
    const userId = req.id;
    console.log("The balance of user ID", userId);

    try{
        const userBalance = await Account.findOne({
            userId,
        }).select("balance");
    
        return res.json({Balance:userBalance});
    }
    catch(e){
        return res.status(400).json({Error:e.message});
    }
  
})

router.get('/transfer', auth, async(req, res)=>{
    const userId = req.id;
   
    const session =  await mongoose.startSession();
    session.startTransaction();

    const {to, amt} = req.body;
    
    try{
        // sender
        const user  = await Account.findOne({
            userId,
        }).select("balance").session(session);
        // console.log(user);
        // debit the sender & credit the reciever(to) _id
    
        if(user.balance<amt) {
            await session.abortTransaction();
            return res.status(400).json({msg:"Insufficient balance",
                                            currentBalance:user.balance})
    }

        await Account.updateOne(
            { userId }, 
            { $inc: { balance: -amt } }, 
        ).session(session);

        const reciever = await Account.findOneAndUpdate(
            {userId:to},
            {$inc :{ balance:amt}},
            {view:true}

        ).session(session);

        // console.log(reciever)
   
        await session.commitTransaction();
        
        const user2 = await User.findById(reciever.userId).select("username")
        console.log(user2.username)
        return res.json({
            msg:`Rs ${amt} sent successfully to ${user2.username}`
        })
        
    }
    catch(e){
        return res.status(400).json({Error:e.message});
    }


})
module.exports = {account:router}