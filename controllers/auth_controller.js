import { UserModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const newUser = await UserModel.create(req.body);

        // Creating token that is sent to client, which is made with the header (authomatically added), payload and the secret string (jwt.sign is the syntax in creating a token with jwt)
        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_STR, {
            // more options to add to your token payload but is not used in creating the token
            expiresIn: process.env.LOGIN_EXPIRES
        })

        res.status(201).json({
            status: 'success',
            // send the created token to client
            token,
            data: {
                user: newUser
            }
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        // We want to read the email and password the user sends
        const email = req.body.email;
        const password = req.body.password;

        // Make sure user has provided email or password
        if (!email || !password) {
            return 'Please provide email and password to login'
        }

        // Since they have provided the email and password, we need to Find if user is in database
        // we used the select function to add the password so we can also have it to do our checks
        const user = await UserModel.findOne({ email }).select('+password')

        // const isMatch = await user.comparePasswords(password, user.password)

        // if user and password matches
        // password - one sent by the use, user.password - one in the database
        if (!user || !(await user.comparePasswords(password, user.password))) {
            const error = 'Incorrect email or password'
            return next(error);
        }


        // 
        const token = jwt.sign({ id: user.id }, process.env.SECRET_STR, {
            expiresIn: process.env.LOGIN_EXPIRES
        })



        res.status(200).json({
            status: 'success',
            token
        })

    } catch (error) {
        next(error)
    }

}