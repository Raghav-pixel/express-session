const session = require('express-session');

//Dummy users

const users = [
{id: 1, name: 'Alex', email: 'alex@gmail.com', password: 'secret'},
{id: 2, name: 'Max', email: 'max@gmail.com', password: 'secret'},
{id: 3, name: 'Hagard', email: 'hagard@gmail.com', password: 'secret'}
];

const TWO_HOURS = 1000*60*60*2

const {
	SESS_LIFETIME = TWO_HOURS,

	SESS_NAME = 'RAGHAV',
	SESS_SECRET = 'KHANNA',
	NODE_ENV = 'development'
} = process.env

const IN_PROD = NODE_ENV === 'production'


module.exports = function(app){
	app.use(session({
	name: SESS_NAME,
	resave: false,
	saveUninitialized: false,
	secret: SESS_SECRET,
	cookie :{
		maxAge : SESS_LIFETIME,
		samesite: true,
		secure: IN_PROD
	}
}));



//Redirect to the login page
const redirectLogin = (req,res,next) =>{
	if(!req.session.userId){
		res.redirect('/login');
	} else{
		next()
	}
}

//Redirect to the Home page
const redirectHome = (req,res,next) => {
	if(req.session.userId){
		res.redirect('/home');
	} else{
		next()
	}
}


//GET requests

app.get('/',(req,res) => {
		const{userId} = req.session
		res.render('main', {userId:userId});
})

app.get('/home',redirectLogin,(req,res) => {
	const user = users.find(user => user.id === req.session.userId);
	res.render('home', {name:user.name, email:user.email});
})

app.get('/login',redirectHome,(req,res) => {
	res.render('login');
})

app.get('/register',redirectHome,(req,res) => {
	res.render('register');
})


//POST requests

app.post('/login',redirectHome, (req,res) => {
	const {email, password} = req.body

	if(email && password){
		const user = users.find(user => user.email === email && 
			user.password === password)

	if(user){
		req.session.userId = user.id;
		return res.redirect('/home');
	}
}
	res.redirect('/login');
})

app.post('/register',redirectHome, (req,res) => {
	const{name, email, password} = req.body;
	if(name && email && password){
		const exists = users.some(user => user.email === email)
	if(!exists){
		const user = {
			id: users.length + 1,
			name,
			email,
			password
		}
		users.push(user);
		req.session.userId = user.id
		return res.redirect('/home');
	}
}
res.redirect('/register');
})

app.post('/logout',redirectLogin,(req,res) => {
	req.session.destroy(err =>{
	if(err){
	return res.redirect('/home');
	}
	res.clearCookie(SESS_NAME);
	res.redirect('/login');
	})
})
}

