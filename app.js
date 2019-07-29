const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
var session_controller = require('./controllers/session_controller');


const app = express();

app.use(bodyParser.urlencoded({
	extended: false
}));

//set view engine
app.set('view engine', 'ejs');

//fire controller
session_controller(app);

const {
	PORT = 3000
	} = process.env

app.listen(PORT, () => console.log(`listening to ${PORT}`));