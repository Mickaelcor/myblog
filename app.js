var express = require('express');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var path = require('path');

app.set('view engine', 'ejs');

var Pseudo = require('./models/pseudo');
var Contact = require('./models/Contact');
var Post = require('./models/Post');

var mongoose = require('mongoose');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

require('dotenv').config();

var dbURL = process.env.DATABASE_URL;

mongoose.set('strictQuery', false)
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("MongoDB connected"))
    .catch(err => console.log("Error : " + err));

// app.get('/', function (req, res) {
//     res.send('<html><body><h1>Hello</h1></body></html>');

// });

app.get('/student/', function (req, res) {
    res.send('<html><body><h1>Hello Student</h1></body></html>');

});
app.get('/admin/', function (req, res) {
    res.send('<html><body><h1>Hello Admin</h1></body></html>');

});

app.get('/formulaire', function (req, res) {
    res.sendFile(path.resolve('form.html'));
});

app.get('/contact', function (req, res) {
    res.sendFile(path.resolve('contact.html'));

});

app.get('/home', function (req, res) {
    res.render('Home');

});

app.get('/post', function (req, res) {
    Post.find().then(data => {
        res.render('Blog', { data: data })
    }).catch(err => { console.log(err) });
});

app.get('/acceuil', function (req, res) {
    Post.find().then(data => {
        res.render('Acceuil', { data: data })
    }).catch(err => { console.log(err) });
});

app.get('/', function (req, res) {
    Contact.find().then(data => {
        res.render('Home', { data: data })
    }).catch(err => { console.log(err) });
});

//Edit Data
app.get('/contact/:id', function (req, res) {
    Contact.findOne(
        {
            _id: req.params.id
        }).then(data => {
            res.render('Edit', { data: data });
        }).catch(err => { console.log(err) });
});

app.put('/contact/edit/:id', function (req, res) {
    Contact.findOne(
        {
            _id: req.params.id
        }).then(data => {
            data.nom = req.body.nom;
            data.prenom = req.body.prenom;
            data.email = req.body.email;
            data.age = req.body.age;

            data.save().then(() => {
                console.log("Data changed !");
                res.redirect('/');
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});

app.get('/post/:id', function (req, res) {
    Post.findOne(
        {
            _id: req.params.id
        }).then(data => {
            res.render('EditBlog', { data: data });
        }).catch(err => { console.log(err) });
});

app.put('/post/edit/:id', function (req, res) {
    Post.findOne(
        {
            _id: req.params.id
        }).then(data => {
            data.Titre = req.body.title,
                data.Auteur = req.body.autor,
                data.Description = req.body.desc

            data.save().then(() => {
                console.log("Post changed !");
                res.redirect('/acceuil');
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});

//Delete Data
app.delete('/contact/delete/:id', function (req, res) {
    Contact.findOneAndDelete({
        _id: req.params.id
    }).then(data => {
        res.redirect('/');
    }).catch(err => { console.log(err) });
});

app.delete('/post/delete/:id', function (req, res) {
    Post.findOneAndDelete({
        _id: req.params.id
    }).then(data => {
        res.redirect('/acceuil');
    }).catch(err => { console.log(err) });
});


app.post('/student-post/', function (req, res) {
    // console.log(req.body);
    // var pseudo = req.body.pseudo;
    // var age = req.body.age;

    // res.send("Voici votre pseudo : " + pseudo + ". Vous avez " + age + " ans");
    const Data = new Pseudo({
        pseudo: req.body.pseudo,
        age: req.body.age
    })
    Data.save().then(() =>
        res.send('OK!')
    ).catch(err => console.log(err));
});

app.post('/new-contact', function (req, res) {
    const Data = new Contact({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        age: req.body.age
    })
    Data.save().then(() =>
        res.redirect('/')
    ).catch(err => console.log(err));
});

app.post('/new-post', function (req, res) {
    const Data = new Post({
        Titre: req.body.title,
        Auteur: req.body.autor,
        Description: req.body.desc,
    })
    Data.save().then(() =>
        res.redirect('/acceuil')
    ).catch(err => console.log(err));
});

var server = app.listen(5001, function () {
    console.log('server listening on port 5001')
})