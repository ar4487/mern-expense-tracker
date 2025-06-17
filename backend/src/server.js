const app = require("./app")
const mongoose=require("mongoose")
const dotenv=require('dotenv')
dotenv.config()

const PORT = process.env.PORT||8000

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB Connected")
    app.listen(PORT,()=>{
        console.log(`server running at ${PORT}`)
    })
}).catch(err=>{
    console.error("MongoDB Connection error",err)
})