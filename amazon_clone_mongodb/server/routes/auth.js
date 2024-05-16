const express = require("express");
const User = require("../modules/user.js")
const authRouter = express.Router();
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const auth = require("../middlewares/auth.js")


//* signup func

authRouter.post("/api/signup", async (req, res) => {

    try {
        const { name, password, email } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exist" });
        }



        const hashedPassword = await bcryptjs.hash(password, 8);

        let user = User({
            email: email,
            password: hashedPassword,
            name: name
        });

        user = await user.save();
        res.json(user);

    } catch (e) {
        res.status(500).json({ error: e.message })
    }


});


//* signin function 

authRouter.post("/api/signin/", async (req, res) => {

    try {
        const { email, password } = req.body;
        const existingUser = User.findOne({ email });

        if (!existingUser) {
            return res.status(500).json({ msg: "There's no acacount with this account" });
        }

        const isMatch = await bcryptjs.compare(password, existingUser.password);

        if (!isMatch) {
            return res.status(500).json({ msg: "Wrong Password" });
        }

        const token = jsonwebtoken.sign({ id: existingUser._id }, "passwordKey");

        return res.json({ token, ...existingUser._doc })
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});


//verify the token

authRouter.post("/api/isVerifiedToken", async (req, res) => {
    try {

        const token = await req.header("x-auth-token");
        if (!token) return res.json(false);
        const verified = jsonwebtoken.verify(token, "passwordKey");
        if (!verified) return res.json(false);
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

});


// get user data
authRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});



