/**
 * render to the admin page
 * @param req
 * @param res
 */
exports.getAdmin = (req, res) => {
    if (!req.session.username)
            res.render('login', { title: 'login',
                logout: (req.session.username), valid: ["", ""],
                hidden: ["d-none","d-none"]});
    else
        res.render('admin', {title: 'admin', logout:  req.session.username});
}