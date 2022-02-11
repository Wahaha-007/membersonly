#! /usr/bin/env node

console.log('This script populates some date to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async')

var User = require('./models/user')
var Message = require('./models/message')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var messages = []

function userCreate(first_name, last_name, username, password, status, avatar, cb) {
    let userdetail = {
        first_name: first_name,
        last_name: last_name,
        username: username,
        password: password,
        status: status,
        avatar: avatar
    }

    var user = new User(userdetail);
    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        users.push(user);
        cb(null, user);
    });
}

function messageCreate(title, text, owner, cb) {
    let messagedetail = { title: title, text: text, owner: owner };

    const message = new Message(messagedetail);

    message.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Message: ' + message);
        messages.push(message);
        cb(null, message);
    });
}

function createUsers(cb) {
    async.series([
        function (callback) {
            userCreate('Peter', 'Parker', 'Spiderman', 'Spiderman', 'Regular', 0, callback);
        },
        function (callback) {
            userCreate('John', 'Doe', 'Joe', 'Joe', 'Regular', 1, callback);
        },
        function (callback) {
            userCreate('Clark', 'Kent', 'Superman', 'Superman', 'Member', 2, callback);
        },
        function (callback) {
            userCreate('Nobita', 'Nobi', 'Nobita', 'Nobita', 'Admin', 3, callback);
        },
    ],
        // optional callback
        cb);
}

// function itemCreate(name, description, category, vendor, price, stock, pic_url, cb) 

function createMessages(cb) {
    async.parallel([
        function (callback) {
            messageCreate('Test00 - Topic', 'Test00 - Message', users[2], callback);
        },
        function (callback) {
            messageCreate('Test01 - Topic', 'Test01 - Message', users[3], callback);
        },
    ],
        // optional callback
        cb);
}


async.series([
    createUsers,
    createMessages
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });
