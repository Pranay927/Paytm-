const { Router } = require('express');
const router = Router();
const {auth} = require('../middlewares/authentication.js')
const bcrypt = require('bcrypt');
const { User, Account} = require('../db')
const jwt = require('jsonwebtoken')
const secret = "897n092q3ei[-53dy7bb8"

router.get('/up', async (req, res)=>{
    const {username, password} = req.body;
    try {
       const hashP = await bcrypt.hash(password, 5);
       
       const newUser = await User.create({
            username,
            password:hashP
       })
       let balance = Math.floor(Math.random()*100000)
       await Account.create({
            userId:newUser._id,
            balance,
       })
       return res.status(200).json({
        "msg!": "Signed up successfully",
        "randomBalance" : balance,
    })
    } catch (error) {
        return res.status(400).json({
            "Error while signing up!": error.message
        })
    }

})

router.get('/in', async(req, res)=>{
    const {username, password} = req.body;
    try{
        const user  = await User.findOne({
            username
        })
        if(!user) return res.json({Error: "Username is invalid"})
        const isPassword = await bcrypt.compare(password, user.password )
        
        if(!isPassword) return res.json({Error: "Invalid Credentials"})
        
        const authorization =  jwt.sign({id:user._id}, secret)
        
        return res.json({msg:"Signed up", token:authorization})
        
    }
    catch(e){
        return res.status(400).json({
            "Error while signing in!": e.message
        })
    }   

})

router.get('/update',auth, async(req, res)=>{
    // return res.json({userID:req.id})
    const {username, password} = req.body;

    try{
        if(username === undefined && password=== undefined) return res.send("Send username or password to update the corresponding")
        // the username and password if sent by front end is correct after validation<zod> so no need extra checks<only needed in postman>
        let updateFields = {}
        
        if(username) updateFields.username = username;
        
        if(password) {
            let newhash = await bcrypt.hash(password, 5);
            updateFields.password = newhash
        }
        // want to change the username and password
            const user = await User.findByIdAndUpdate(
                req.id,
                updateFields,
                {new:true, runValidators:true}
            )

            return res.json({Updated : user})
    }
    catch(e){
        return res.send(e)
    }

})

router.get('/search',auth, async(req, res)=>{
    const filter = req.query.filter ||""

    try {
        const users = await User.find({
            username: { $regex: new RegExp(filter, "i") }
        }).select("username _id")
        console.log(users)
        return res.json({
            users:users
        })
    } catch (error) {
        return res.status(400).json({
            "Error while signing in!": error.message
        })
    }
})

module.exports = {user:router}