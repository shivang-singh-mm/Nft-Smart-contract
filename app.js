require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./routes/route');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/',router)


app.listen(process.env.PORT_NUMBER,()=>{
    console.log(`Application started at ${process.env.PORT_NUMBER}`)
})