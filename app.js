require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');

const app = express();
const PORT = 7001 || process.env.PORT;

//!conn db
connectDB();

app.use(express.static('public'));

//!temp
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.use('/', require('./server/routes/main'));

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});
