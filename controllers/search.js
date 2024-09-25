const db = require("../models");
/**
 * if the search input is not empty then search for the input
 * in the titles of the adds then show them as cards.
 * else if it is empty go to home page
 * @param req
 * @param res
 */
exports.searchGet = (req, res) =>{
    const search = req.query.search.trim();
    if (search !== '') {
        db.Ad.ADsCardsHTML(search)
            .then(html => {
                res.render('search', { title: 'search',
                    logout: req.session.username,
                    card: html
                });
            })
            .catch(err => {
                res.render('error', {
                    title: 'error', logout: (req.session.username), error: err,});
            });
    }
    else {
        res.redirect('/');
    }
}