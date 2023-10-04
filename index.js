const express = require("express")
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser')
require("dotenv").config()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
})

app.use(cors({
	origin: true,  
	credentials: true, // 크로스 도메인 허용
	methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}))

app.use("/", require("./routes/puppeteer"))

app.get('/', (req, res) => {
    res.send('Hello World!')
})