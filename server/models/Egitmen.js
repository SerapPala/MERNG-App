

const mongoose = require('mongoose')

const EgitmenSchema = new mongoose.Schema({
    isim:{
        type: String
    },
    email:{
        type:String
    }
})
module.exports = mongoose.model('Egitmen', EgitmenSchema)
