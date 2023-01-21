require('dotenv').config();

const express = require('express');
const session = require('express-session');
const JsonStore = require('express-session-json')(session);

const app = express();
const fs = require('fs');

GetVisits = JSON.parse(fs.readFileSync('count.json', 'utf8')).visits;

app.use(session({
    cookie:
    {
        maxAge: 1000 * 60 * 60 * 24 * 365
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new JsonStore(),
}))

app.listen(process.env.SERVER_PORT, () => {
    console.log('Portfolio in ascolto su porta ' + process.env.SERVER_PORT);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    if(!req.session.visited)
    {
        GetVisits++;
        req.session.visited = true;
        fs.writeFileSync('count.json', JSON.stringify({visits: GetVisits}, null, 4))
    }
});

app.get('/visits', (req, res) => {
    res.json({visits: GetVisits});
});

app.use(express.static('.'));