import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema({
    name: { type: String, required: [true, 'Please enter your name'] },
    email: { type: String, required: [true, 'Please enter your email'] },
    password: { type: String, required: [true, 'Please enter your password'], select: false },
    confirmPassword: { type: String, required: [true, 'Please confirm password'], select: false }
})

userSchema.methods.comparePasswords = async function (pass, dbPass) {
    return await pass === dbPass
}

userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);


// select property prevents password from being shown when you login