const userModel = require("../models/user.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist.model");

async function registerUserController(req, res){
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message:'Username, email, and password are required'});
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{username}, {email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:'Account is already registered with this username or email'
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    });

    const token = jwt.sign({
        id:user._id,
        username:user.username,
    }, process.env.JWT_SECRET,
    {expiresIn:'1d'}
)

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions)

    res.status(201).json({
        message:'user registerd successfully',
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function loginUserController(req, res){
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:'Invalid email or password'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:'Invalid email or password'
        })
    }

    const token = jwt.sign({
        id:user._id,
        username:user.username,},
        process.env.JWT_SECRET,
        {expiresIn:'1d'})

        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,
        };

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message:'login successfully',
            user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
        })

}

async function logoutUserController(req, res){
    const token = req.cookies.token;

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        path: '/',
    };

    if(token){
        await tokenBlacklistModel.create({token});
    }

    res.clearCookie('token', cookieOptions);
    
    res.status(200).json({
        message:'logout successfully',
    })
}

async function getMeController(req, res){
    const user = await userModel.findById(req.user.id);

    if(!user){
        return res.status(404).json({
            message:'user not found'
        })
    }

    res.status(200).json({
        message:'user details fetched successfully',
        user:{
            id: user._id,
            username: user.username,
            email:user.email
        }
    })
}
module.exports={registerUserController, loginUserController, logoutUserController, getMeController};