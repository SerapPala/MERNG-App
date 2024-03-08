

const mongoose = require('mongoose')

const connectDB=async ()=>{
    const conn = await  mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Baglandi: ${conn.connection.host}`.magenta.bold)
}

module.exports = connectDB
