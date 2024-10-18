require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');

const connectDB = require('./server/config/db');
const {isActiveRoute} = require('./server/helpers/routeHelpers');

const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const app = express();
const PORT = 7001 || process.env.PORT;

//!conn db
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(express.static('public'));

//!temp
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
});
