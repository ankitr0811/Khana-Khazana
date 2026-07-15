const express = require('express')
const User = require('../models/User')
const Order = require('../models/Orders')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const axios = require('axios')
const fetch = require('../middleware/fetchdetails');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET || "HaHa"

//Creating a user and storing data to MongoDB Atlas, No Login Requiered
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.json({ success, authToken })
        })
            .catch(err => {
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        console.error(error.message)
    }
})

// Authentication a User, No login Requiered
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
// Get logged in User details, Login Required.
router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        let location = await axios
            .get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${process.env.OPENCAGE_API_KEY}`)
            .then(async res => {
                let response = res.data.results[0].components;
                let { village, county, state_district, state, postcode } = response
                return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
            })
            .catch(error => {
                console.error(error)
            })
        res.send({ location })

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
router.post('/foodData', async (req, res) => {
    try {
        res.send([global.foodData, global.foodCategory])
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})

    let eId = await Order.findOne({ 'email': req.body.email })    
    if (eId===null) {
        try {
            await Order.create({
                email: req.body.email,
                order_data:[data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            res.send("Server Error", error.message)
        }
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        console.log("Fetching orders for email:", req.body.email);
        let eId = await Order.findOne({ 'email': req.body.email })
        console.log("Found order:", eId);
        if (!eId) {
            console.log("No orders found for this email");
            return res.json({orderData: null})
        }
        res.json({orderData:eId})
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.send("Error",error.message)
    }
    

});

// Forgot Password - Generate reset token
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, error: 'User not found with this email' });
        }

        // Generate a reset token (valid for 1 hour)
        const resetToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        
        // In a real application, you would send this token via email
        // For demo purposes, we'll return it in the response
        console.log("Password reset token:", resetToken);
        
        res.json({ 
            success: true, 
            message: 'Password reset link generated',
            resetToken: resetToken // Remove this in production, send via email instead
        });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.json({ success: false, error: 'Server error' });
    }
});

// Reset Password - Validate token and update password
router.post('/resetpassword', async (req, res) => {
    try {
        const { token, password } = req.body;
        
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(password, salt);
        
        // Update user password
        await User.findByIdAndUpdate(decoded.id, { password: securePass });
        
        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.error("Error in reset password:", error);
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, error: 'Reset link has expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, error: 'Invalid reset link' });
        }
        res.json({ success: false, error: 'Server error' });
    }
});

module.exports = router