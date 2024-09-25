const db = require('../models');
/**
 * update the attribute approved to true in the ad model in the index
 * that the client has sent
 * @param req
 * @param res
 * @returns {Promise<* | void>}
 */
exports.apiPut = (req, res) => {
    let id = '';
    try {
      id = parseInt(req.params.id, 10);
    } catch (err) {
        res.render('error', {
            title: 'error', logout: (req.session.username),
            error: err,
        });
    }
    return db.Ad.findByPk(id)
        .then((ad) => {
            if (!ad)
                return res.status(404).send();
            ad.approved = true;
            return ad.save();
        })
        .then((ad) => res.send(ad))
        .catch((err) => { res.status(400).send(err); });
}
/**
 * return all ads in the ad model
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.apiGet = (req, res) => {
    if ((req.session.username))
    return db.Ad.findAll()
        .then((ad) => res.send(ad))
        .catch((err) => {
            err.error = 1;
            return res.status(400).send(err)
        });
    else {
        const error = new Error('Authorization error: Access forbidden');
        error.status = 403;

        res.render('error', {
            title: 'error', logout: (req.session.username),
            error: error,
        });
    }

}
/**
 * delete ad from the ad model at the index that the user sent
 * @param req
 * @param res
 * @returns {Promise<* | void>}
 */
exports.apiDelete = (req, res) => {
    let id = '';
    try {
         id = parseInt(req.params.id, 10);
    } catch (err) {
        res.render('error', {
            title: 'error', logout: (req.session.username),
            error: err,
        });
    }
    return db.Ad.findByPk(id)
        .then((ad) => ad.destroy({ force: true }))
        .then(() => res.status(204).send())
        .catch((err) => { res.status(400).send(err) });
}
