const MongoClient = require("mongodb").MongoClient
require("dotenv").config()


const mongodbUrl = process.env.MONGODBURL
const client = new MongoClient(mongodbUrl)

const db = async () => {
    await client.connect()
    const database = client.db("crawling")
    
    return database
}

module.exports = {db}