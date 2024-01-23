
const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())


const { sequelize } = require("./config/db")
const {userRouter} = require("./route/userRoute")

require("dotenv").config()

app.get("/", (req, res) => {

    res.send("Welcome to my My Channel App")
})

app.use("/",userRouter)

app.listen(process.env.port, async () => {

    try {
        
        await sequelize.sync();
console.log("All models were synchronized successfully.");
        console.log("connected to db")
    } catch (error) {
        console.log(error)
    }

})