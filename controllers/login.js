const db = require('../models');
const bcrypt = require('bcrypt');
/**
 * get user input check if there is a login and password with
 * the same input if not show specific errors under each input.
 * if the login and the password exist render to the admin page
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.loginPost = (req, res)  => {
    const {login, password} = req.body;
    return db.User.findOne({ where: { login: login.trim() }})
        .then((user) => {
            if(user === null) {
                res.render('login', { title: 'login', logout: "d-none",
                    valid: ["is-invalid","is-invalid"],
                    hidden: ["","d-none"]});
            }
            else {
                if (password === user.password){
                    req.session.username = true;
                    res.render('admin', {title: 'admin', logout:  req.session.username});
                }
                else {
                    res.render('login', { title: 'login', logout:  req.session.username,
                        valid: ["","is-invalid"], hidden: ["d-none",""]});
                }
            }
        })
        .catch((err) => {
            res.render('error', {title: 'error',
                logout: req.session.username, error: err,});
        });
}
/**
 * if there was a session (already logged in) render to admin page
 * else render to login page
 * @param req
 * @param res
 */
exports.loginGet = (req,res)=> {
    if (!req.session.username)
        res.render('login', { title: 'login',
            logout: (req.session.username), valid: ["", ""],
            hidden: ["d-none","d-none"]});
    else
        res.render('admin', {title: 'admin', logout:  req.session.username});
}


