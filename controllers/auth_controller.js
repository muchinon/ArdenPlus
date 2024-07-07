import { UserModel } from "../models/user_model.js";
import jwt from "jsonwebtoken";

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
    })
}

export const signup = async (req, res, next) => {
    try {
        const newUser = await UserModel.create(req.body);

        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_STR, {
            expiresIn: process.env.LOGIN_EXPIRES
        })

        res.status(201).json({
            status: 'success',
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
        const email = req.body.email;
        const password = req.body.password;


        if (!email || !password) {
            return 'Please provide email and password to login'
        }

        // Find if user is in database
        const user = await UserModel.findOne({ email }).select('+password')

        // const isMatch = await user.comparePasswords(password, user.password)

        // if user and password matches
        if (!user || !(await user.comparePasswords(password, user.password))) {
            const error = 'Incorrect email or password'
            return next(error);
        }

        const token = signToken(user.id)



        res.status(200).json({
            status: 'success',
            token
        })

    } catch (error) {
        next(error)
    }

}