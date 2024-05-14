const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const multer = require('multer');
const path = require("path") 

// Muter config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/img/savedimgs')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// File upload settings
const maxsize = 2 * 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxsize },
    fileFilter: function (req, file, cb) {
                // Set the filetypes, it is optional 
                var filetypes = /jpeg|jpg|png/; 
                var mimetype = filetypes.test(file.mimetype); 
          
                var extname = filetypes.test(path.extname( 
                            file.originalname).toLowerCase()); 
                
                if (mimetype && extname) { 
                    return cb(null, true); 
                } 
              
                cb("Error: File upload only supports the "
                        + "following filetypes - " + filetypes); 
    }
}).single('profilepic');

// Mysql config
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'EditorApp'
});

// mysql session store config
const sessions = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'sessions'
};
const sessionStore = new MySQLStore(sessions);
connection.connect();
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 6000000
    }
}));

// login check middleware
let logedincheck = (req, res, next) => {
    if (req.session.logedin == "true") {
        next();
    } else {
        res.redirect('/login');
    }
};

// routes
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/Login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/src/Register.html');
});

app.post('/api/register', (req, res) => {
    if (req.body.username == '' || req.body.password == '' || req.body.email == '') {
        res.status(400).send({ error: 'Please fill in all fields.' });
    } else {
        // lager bruker i database
        connection.query(`INSERT INTO Kunder (brukernavn, passord, epost) VALUES (${connection.escape(req.body.username)}, ${connection.escape(req.body.password)}, ${connection.escape(req.body.email)})`, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: 'Username or email alreddy in use' });
            } else {    
                res.status(200).send({ message: 'User created' });
                req.session.logedin = "true";
                req.session.username = req.body.username;
                req.session.save();
            }
        });

    }
});

app.post('/api/login', (req, res) => {
    if (req.body.username == '' || req.body.password == '') {
        res.status(400).send({ error: 'Please fill in all fields.' });
    } else {
        // sjekker creds opp mot bruker database
        connection.query(`SELECT * FROM Kunder WHERE brukernavn = ${connection.escape(req.body.username)} AND passord = ${connection.escape(req.body.password)}`, function (error, results, fields) {
            if (error) {
                res.status(500).send({ error: 'Something went wrong' });
            } else {
                if (results.length > 0) {
                    res.status(200).send({ message: 'Login success' });
                    req.session.logedin = "true";
                    req.session.username = req.body.username;
                    req.session.save();

                } else {
                    res.status(401).send({ error: 'Username or password is wrong' });
                }
            }
        });
    }
})

app.post('/api/newproject', logedincheck, (req, res) => {
    // lager nyt prosjekt i database
    connection.query(`INSERT INTO Prosjekter (KundeId, Laget) VALUES ((SELECT KundeId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)}), NOW())`, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'Something went wrong' });
        } else {
            // select last insert id
            connection.query(`SELECT * FROM Prosjekter WHERE KundeId = (SELECT KundeId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)}) ORDER BY ProsjektId DESC LIMIT 1`, function (error, results, fields) {
                let ProsjektId = results[0].ProsjektId;
                if (error) {
                    console.log(error);
                    res.status(500).send({ error: 'Something went wrong' });
                } else {
                    connection.query(`INSERT INTO ProsjektInnhold (ProsjektId, html, css, js) VALUES (${connection.escape(ProsjektId)}, '', '', '')`, function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            res.status(500).send({ error: 'Something went wrong' });
                        } else {
                            res.status(200).send({ message: 'Project created', id: ProsjektId });
                        }
                    });
                }
            });
        }
    });
});

app.post('/api/loadproject', logedincheck, (req, res) => {
    // laster inn prosjekt fra database
    connection.query(`SELECT * FROM Prosjekter WHERE ProsjektId = ${connection.escape(req.body.id)} AND KundeId = (SELECT KundeId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)})`, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'Something went wrong' });
        } else {
            if (results.length > 0) {
                connection.query(`SELECT * FROM ProsjektInnhold WHERE ProsjektId = ${connection.escape(req.body.id)}`, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ error: 'Something went wrong' });
                    } else {
                        res.status(200).send({ message: 'Project loaded', html: results[0].html, css: results[0].css, js: results[0].js });
                    }
                });
            } else {
                res.status(401).send({ error: 'You dont have access to this project' });
            }
        }
    });
});

app.post('/api/deleteproject', logedincheck, (req, res) => {
    // sletter prosjekt fra database
    connection.query(`SELECT * FROM Prosjekter WHERE ProsjektId = ${connection.escape(req.body.id)} AND KundeId = (SELECT KundeId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)})`, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'Something went wrong' });
        } else {
            if (results.length > 0) {
                connection.query(`DELETE FROM ProsjektInnhold WHERE ProsjektId = ${connection.escape(req.body.id)}`, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ error: 'Something went wrong' });
                    } else {
                        connection.query(`DELETE FROM Prosjekter WHERE ProsjektId = ${connection.escape(req.body.id)}`, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                                res.status(500).send({ error: 'Something went wrong' });
                            } else {
                                res.status(200).send({ message: 'Project deleted' });
                            }
                        });
                    }
                });
            } else {
                res.status(401).send({ error: 'You dont have access to this project' });
            }
        }
    });
})

app.post('/api/saveproject', logedincheck, (req, res) => {
    // lagrer prosjekt i database
    connection.query(`SELECT * FROM Prosjekter WHERE ProsjektId = ${connection.escape(req.body.id)} AND KundeId = (SELECT KundeId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)})`, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'Something went wrong' });
        } else {
            if (results.length > 0) {
                connection.query(`UPDATE ProsjektInnhold SET html = ${connection.escape(req.body.html)}, css = ${connection.escape(req.body.css)}, js = ${connection.escape(req.body.js)} WHERE ProsjektId = ${connection.escape(req.body.id)}`, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        res.status(500).send({ error: 'Something went wrong' });
                    } else {
                        res.status(200).send({ message: 'Project saved' });
                    }
                });
            } else {
                res.status(401).send({ error: 'You dont have access to this project' });
            }
        }
    });
});

app.get('/api/getprojects', logedincheck, (req, res) =>  {
    // henter prosjekter fra database
    connection.query(`SELECT * FROM Prosjekter WHERE KundeId = (SELECT KundeId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)})`, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'Something went wrong' });
        } else {
            res.status(200).send({ message: 'Projects loaded', projects: results });
        }
    });
});

app.post("/uploadProfilePicture",function (req, res, next) {
    // laster opp profilbilde til server
    upload(req,res,function(err) { 
        if(err) { 
            res.status(500).send({ error: err.code });
            console.log(err);
        } else {
            connection.query(`UPDATE Kunder SET profilepicId = ${connection.escape(req.file.filename)} WHERE brukernavn = ${connection.escape(req.session.username)}`, function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Profile picture updated');
                    res.redirect('/profile');
                }
            });
        }
        
    }) 
}) 
// dash rute
app.get('/dashboard', logedincheck, (req, res) => {
    res.sendFile(__dirname + '/locked/dash.html');
});

app.get('/profile', logedincheck, (req, res) => {
    res.sendFile(__dirname + '/locked/profile.html');
});

app.get('/api/getuserinfo', logedincheck, (req, res) => {
    // henter bruker info fra database
    connection.query(`SELECT epost, brukernavn,profilepicId FROM Kunder WHERE brukernavn = ${connection.escape(req.session.username)}`, function (error, results, fields) {
        if (error) {
            console.log(error);
            res.status(500).send({ error: 'Something went wrong' });
        } else {
            res.status(200).send({ message: 'User info loaded', userinfo: results[0] });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.get('/editor', logedincheck, (req, res) => {
    res.sendFile(__dirname + '/locked/editor.html');
});

// start server
let port = 3000;

app.listen(3000, () => {
    console.log('Server running on port ' + port);
});
app.use(express.static('src'));