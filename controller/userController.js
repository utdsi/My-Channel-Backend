

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const nodemailer = require("nodemailer")

const { UserModel } = require("../model/userModel")

require("dotenv").config()


//--------------------------Signup-----------------------------

const register = async (req, res) => {

    const id = uuidv4()
    const { email, password, username } = req.body


    try {
        const user = await UserModel.findAll({ where: { email: email } })

        if (user.length > 0) {
            res.status(400).send({ "status": 2, "message": "user already present,please login", "data": [] })
        }

        bcrypt.hash(password, 6, async function (err, hash) {

            if (err) {
                res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
            } else {
                await UserModel.create({ User_Id: id, user_name: username, email: email, password: hash })
                res.status(200).send({ "status": 1, "message": "You have signed up successfully", "data": [] })
            }
        });
    } catch (error) {
        res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
    }
}


//-------------------------------Login----------------------------

const login = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await UserModel.findAll({ where: { email: email } })

        if (user.length == 0) {
            res.status(400).send({ "status": 2, "message": "Unregistered user, please register first.", "data": [] })
        }

        bcrypt.compare(password, user[0].password, function (err, result) {
            if (err) {
                res.status(400).send({ "status": 2, "message": err.message, "data": user })
            }

            if (result) {
                var token = jwt.sign({ User_Id: user[0].User_Id }, process.env.secret_key);

                res.status(200).send({ "status": 1, "message": "you have successfully logged in.", "token": token, "data": omitPassword(user[0]) })
            } else {
                res.status(400).send({ "status": 2, "message": "Invalid password.", "data": omitPassword(user[0]) });
            }

        });
    } catch (error) {
        res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
    }
}

//-------------------------------forgot/reset Password--------------------------


const resetpassword = async (req, res) => {
    const { email } = req.body

    const user = await UserModel.findAll({ where: { email: email } })

    if (user.length == 0) {
        res.status(200).send({ "status": 2, "message": "user not found", "data": [] })
    }
    function generateRandomAlphabetString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    const randomAlphabetString = generateRandomAlphabetString(8);
    //---------------nodemailer-----------------------------------------------------------



    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {

            user: "utkarshsinha852@gmail.com",
            pass: process.env.APP_PASSWORD
        }

    })
    const mailOptions = {
        from: "utkarshsinha852@gmail.com",
        to: `${email}`,
        subject: "Reset Password",
        text: `Your new password is ${randomAlphabetString}`,
        html: `  <!DOCTYPE html>
             <html>
               <head>
                 <title>Example Email Template</title>
                 <meta charset="utf-8" />
                 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
               </head>
               <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.5; color: #333; padding: 20px;">
                 
               <b>Your new password is ${randomAlphabetString}</b>
                 
               </body>
             </html>`,
    }

    try {

        transporter
            .sendMail(mailOptions)
            .then((info) => {
                bcrypt.hash(randomAlphabetString, 6, async function (err, hash) {
                    // Store hash in your password DB.
                    if (err) {
                        res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
                    }
                    await UserModel.update({ password: hash }, { where: { email: email } })

                    res.status(200).send({ "status": 1, "message": "updated password has been sent to your email", "data": [] })
                });

            })
            .catch((e) => {
                res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })

            });


    } catch (error) {
        res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
    }















}

//---------------------------------ChangePassword------------------------------------------

const changePassword = async (req, res) => {


    const { old_password, new_password, email } = req.body

    try {

        const user = await UserModel.findAll({ where: { email: email } })
        bcrypt.compare(old_password, user[0].password, async function (err, result) {
            if (err) {
                res.status(400).send({ "status": 2, "message": err.message, "data": user })
            }

            if (result) {
                bcrypt.hash(new_password, 6, async function (err, hash) {
                    if (err) {
                        res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
                    }

                    await UserModel.update({ password: hash }, { where: { email: email } })

                    res.status(200).send({ "status": 1, "message": "your password has been updated", "data": [] })

                });
            } else {
                res.status(400).send({ "status": 2, "message": "Incorrect password.", "data": omitPassword(user[0]) });
            }

        });



    } catch (error) {
        res.status(400).send({ "status": 2, "message": "Some error occured, please try again.", "data": [] })
    }
}


function omitPassword(user) {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
}


module.exports = { register, login, resetpassword, changePassword }