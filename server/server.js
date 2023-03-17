const express = require("express");
const app = express();
const connectDatabase = require('./db/Database')
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
const nodemailer = require('nodemailer');
const server = require("http").createServer(app);
const bodyParser = require('body-parser');
const User = require("./model/users");
const port = process.env.PORT || 5000;
//using body parser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

//connecting db

connectDatabase();

//routes
app.post('/', (req, res) => {
    const { name, dob, email, phone } = req.body;
    const Name = name;
    const age = getAge(dob);
    const Email = email;
    const Phone = phone;
    const Users = {
        name: Name,
        email: Email,
        phone: Phone,
        age: age
    }
    User.create(Users);

    //nodemailer for email sending
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'bloodygeeks6@gmail.com', // your email
            pass: 'kbbdwqaitwuwtdcb' // your email password
        }
    });
    let mailOptions = {
        from: '"StackFusion"', // sender address
        to: Email, // list of receivers
        subject: 'Hello from StackFusion', // Subject line
        text: 'Assignment by Shweta Rathore', // plain text body
        html: `Hello ${Name}` // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
});

app.get('/success', (req, res) => {
    User.find({})
        .then((users) => {
            console.log(users);
            res.send(users);
        })
        .catch((err) => {
            console.error(err);
        });
});
const getAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


// const isValidEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
// };



server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});