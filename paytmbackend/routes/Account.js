const { Router, response } = require('express');
const router = Router();
const {auth} = require('../middlewares/authentication.js')

const { User, Account} = require('../db')
const jwt = require('jsonwebtoken');
const user = require('./user.js');
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
    let {to, amt} = req.body;
    amt = parseInt(amt);
    try{
        // sender
        const user  = await Account.findOne({
            userId,
        }).select("balance");
        // console.log(user);
        // debit the sender & credit the reciever(to) _id
    
        if(user.balance<amt) return res.status(400).json({msg:"Insufficient balance",
            currentBalance:user.balance
        })

        // await Account.findByIdAndUpdate({
        //     userId,
        //     {$inc,
        //         balance: -amt
        //     }
        // })
        await Account.updateOne(
            { userId }, 
            { $inc: { balance: -amt } }, 
        );

        const reciever = await Account.findOneAndUpdate(
            {userId:to},
            {$inc :{ balance:amt}},
            {view:true}

        )
        console.log(reciever)
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