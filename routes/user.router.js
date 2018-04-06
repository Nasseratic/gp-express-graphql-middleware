const express = require('express');
const router = express.Router();
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const role = require('../models/Role');
const fs = require('fs')

// -------------------------------------------- get ----------------------------------
router.get('/', (req, res, next) => {
    User
        .find({})
        .exec((err, users) => {
            if (err) {
                next(err);
            }
            res.json({
                data: users,
                status: 'success'
            });
        });
});


// ---------------------------------- update -------------------------------------
router.put('/:id', (req, res, next) => {
    let {id} = req.params,
        user = req.body;
    let type = user.img.split(';')[0].split('/')[1];
    let types = /jpg|png|jpeg/;

    if (!types.test(type)) {
        next(type);
    } else {
        user.img = Buffer.from(user.img.replace(/^data:([A-Za-z-+/]+);base64,/, ''), 'base64');
        fs.writeFile("./uploads/" + Math.random().toString(36).substring(7) + "profile." + type, user.img, (err) => {
            if (err) console.log(err);
            role
                .findOne({
                    name: user.role
                })
                .exec((err, role) => {
                    if (err) {
                        next(err);
                    }
                    user.img = "./uploads/" + id + "profile." + type;
                    user.role = role._id;
                    User.updateUser(id, user, (err) => {
                        if (err) {
                            next(err);
                        } else {
                            res.json({
                                data: user,
                                status: 'success'
                            });
                        }
                    });
                });

        });

    }

});

// ------------------------ add ---------------------------------------
router.post('/', function (req, res, next) {
    let {id} = req.params,
        user = req.body;
    let type = user.img.split(';')[0].split('/')[1];
    let types = /jpg|png|jpeg/;

    if (!types.test(type)) {
        next(type);
    } else {
        // I think its better to use populate here instead of nested execs :"D
        user.img = Buffer.from(user.img.replace(/^data:([A-Za-z-+/]+);base64,/, ''), 'base64');
        fs.writeFile("./uploads/" + Math.random().toString(36).substring(7) + "profile." + type, user.img, (err) =>{
            if (err) console.log(err);
            role
                .findOne({
                    name: user.role
                })
                .exec((err, role) => {

                    if (err) {
                        next(err);
                    } else {
                        user.role = role._id;
                        User.createUser(new User(user), (err, saved) => {
                            if (err) {
                                next(err);
                            } else {
                                res.json({
                                    data: saved,
                                    status: 'success'
                                });
                            }
                        });
                    }

                });
        });
    }
});



// ----------------------- delete -------------------
router.delete('/:id', (req, res, next) => {
    let {id} = req.params;
    User
        .remove({
            _id: id
        })
        .exec((err, user) => {
            if (err) {
                next(err);
            } else {
                res.json({
                    data: user,
                    status: 'success'
                });
            }
        });
});

module.exports = router