require('dotenv').config();

const express = require('express');
const session = require('express-session');
const JsonStore = require('express-session-json')(session);

const app = express();
const fs = require('fs');

const crypto = require('crypto');

const captchas = [];

GetVisits = JSON.parse(fs.readFileSync('count.json', 'utf8')).visits;

app.use(express.json());

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

app.get('/captcha', (req, res) => {
    // generate two random numbers m and q, the division -q/m must be an integer
    const m = Math.floor(Math.random() * 10) + 1;
    const q = (Math.floor(Math.random() * 10) + 1) * m;
    const question = `${m}x - ${q} = 0`;
    const answer = q/m;
    const id = crypto.randomBytes(8).toString('hex');
    const creationTime = Date.now();
    captchas.push({id, answer, creationTime});

    setTimeout(() => {
        const index = captchas.findIndex(c => c.id === id);
        if(index !== -1)
            captchas.splice(index, 1);
    }, 1000 * 60 * 5);

    return res.json({id, text: question});
});

setInterval(() => {
    const now = Date.now();
    captchas.forEach((captcha, index) => {
        if(now - captcha.creationTime > 1000 * 60 * 5)
            captchas.splice(index, 1);
    });
}, 1000 * 60 * 10);

app.post('/contact', (req, res) => {
    const captcha = captchas.find(c => c.id === req.body.captcha_id);
    var is_captcha_valid = false;

    if(captcha)
    {
        if(captcha.answer === parseInt(req.body.captcha_solution))
        {
            is_captcha_valid = true;
        }
    }

    if(!is_captcha_valid)
    {
        const index = captchas.findIndex(c => c.id === req.body.captcha_id);
        if(index !== -1)
            captchas.splice(index, 1);
            
        return res.status(400).json({message: 'Invalid captcha'});
    }

    const name = req.body.name.trim();
    const email = req.body.email.trim();
    const message = req.body.message.trim().replace(/\. /g, '.\n').replace(/\! /g, '!\n').replace(/\? /g, '?\n');

    if(name.length < 3 || name.length > 50 || !isNaN(name))
        return res.status(400).json({message: 'Invalid name', success: false});

    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
        return res.status(400).json({message: 'Invalid email', success: false});

    if(message.length < 10 || message.length > 1000 || !isNaN(message))
        return res.status(400).json({message: 'Invalid message', success: false});

    sendMail({
        from: "Portfolio <" + process.env.MAIL_USER + ">",
        to: process.env.MAIL_USER,
        subject: 'Nuovo messaggio da ' + email + ' - Portfolio',
        text: "Nome mittente: " + name + "\n" + "Email mittente: " + email + "\n" + "Messaggio:\n" + message
    })

    return res.json({message: 'Message sent successfully', success: true});
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify().then(console.log ? console.log("Autenticazione email effettuata correttamente") : false).catch(console.error);

const sendMail = (options) => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(options, (error, info) => {
            if (error) {
                reject(error);
            }
            resolve(info);
        });
    });
};

app.use(express.static('.'));