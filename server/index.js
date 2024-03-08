
const express = require('express')
require('dotenv').config();
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema')
const colors=require('colors')
const connectDB = require('./config/db')


const port = process.env.PORT || 5000

const app = express()

connectDB()

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:process.env.NODE_ENV === 'development'
}))

app.listen(port, console.log(`Server ${port}. postta çalışıyor`.blue.underline))

