/**
 * destroy session (do log out) and render to home page
 * @param req
 * @param res
 */
exports.logoutPost = (req, res) =>{
    req.session.destroy();
    res.redirect('/');
}