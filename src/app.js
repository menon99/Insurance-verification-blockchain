const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const insert = require('./insertData');
require('./db/connect');

const userRouter = require('./routers/userRouter');

const app = express();

app.set('view engine', 'hbs');
hbs.registerHelper('ifEquals', function(arg1, arg2) {
    return (arg1 == arg2);
});

const SESS_SECRET = process.env.SESS_SECRET;
const SESS_ID = process.env.SESS_ID;
const TWO_HOURS = 1000 * 60 * 60 * 2;

app.use(session({
    name: SESS_ID,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: true,
        secure: false,
    }
}));

app.use(bodyParser.urlencoded({
    extended: false,
}));

app.use(userRouter);

app.get('/insert', async(req, res) => {
    insert();
    res.send('ok');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port:${PORT}`);
});