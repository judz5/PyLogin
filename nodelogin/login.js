const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { response } = require('express');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'judz',
	password : '',
	database : ''
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/login', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/register', function(request, response){

	return response.sendFile(path.join(__dirname + '/register.html'));

});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.post('/reg', function(request, response) {

	let username = request.body.username;
	let password = request.body.password;

	console.log("Inserted "+username+" "+password);

	if(username && password){

		connection.query("INSERT INTO accounts (username, password) VALUES (?,?)", [username, password], function(err, result) {
			if (err) throw err;
			console.log("Inserted "+username+" "+password);

			response.sendFile(path.join(__dirname + '/login.html'));

		});
	}


});

// INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');
// removed email 

// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		return response.sendFile(path.join(__dirname + '/home.html'));
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
})

app.listen(3000);
