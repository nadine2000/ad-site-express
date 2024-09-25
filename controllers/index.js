const db = require('../models');

/**
 * if there was an approved ads show them in the home page in cards
 * (every card has an ad )
 * else show card that tell there is no ads and post your add
 * @param req
 * @param res
 */
exports.homeGet = (req, res) => {
    db.Ad.countRows()
        .then(count => {
            if (count && count !== 0) {
                db.Ad.ADsCardsHTML('')
                    .then(html => {
                        res.render('index', { title: 'home',
                            logout: req.session.username,
                            card: html, message: "" }); })
                    .catch(error => {
                        res.render('error', {title: 'error',
                            logout: req.session.username, error: error,});
                    });
            }
            else {
                res.render('index', {title: 'home',
                    logout: req.session.username, card: "-", message: ""});
            }

        })
        .catch(error => {
            res.render('error', {title: 'error',
                logout: req.session.username, error: error,});
        });
}
