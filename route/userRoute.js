

const express = require("express")

const userRouter = express.Router()

const {register,login,resetpassword,changePassword} = require("../controller/userController")
const {auth} = require("../middleware/auth")


userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.patch("/resetpassword",resetpassword)
userRouter.patch("/changepassword",auth,changePassword)


module.exports = {userRouter}