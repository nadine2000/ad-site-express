const Cookies = require('cookies')
const Sequelize = require('sequelize');
const db = require('../models');

/**
 * handle cookie get mail and date uf existed make the message
 * @param req
 * @param res
 * @returns {(string|Cookies|boolean)[]}
 */
const handleCookie = (req, res)=>{
    let newAdSameUser = "";
    const cookies = new Cookies(req, res, { keys: ['keyboard cat'] });
    const cookiesEmail = cookies.get('email', { signed: true });
    const lastPost = cookies.get('lastPost', { signed: true })

    if (cookiesEmail)
        newAdSameUser = `welcome back ${cookiesEmail}, your previous ad was posted on ${lastPost}`;

    return [newAdSameUser, cookies, !cookiesEmail];
}
/**
 * show specific errors in form.
 * @param err  - errors of validation
 * @returns {[string[][],any[]]|[*[],*[]]}
 */
const handleErrors = (err)=>{

    let validationRegex = err.message.match(/Validation error: ([^,]+)/g);

    if (validationRegex!==null) {

        let errors = validationRegex.map(match => match.slice(match.indexOf(':') + 2).trim());
        let errorIndex = new Array(5).fill("");
        for (let i = 0; i < errors.length; i++)
            errorIndex[parseInt(errors[i].charAt(0))] = errors[i].substring(1);

        const showError = errorIndex.map(str => {
            if (str === '') {
                return ['', 'd-none'];
            }
            return ['is-invalid', ''];
        });

        return [showError, errorIndex];
    }

    return [[], []];
}

/**
 * create new ad in model according to the form input.
 *  make cookie foe the new visitor and show welcome message every time he
 *  gets to the page. check input validation show specific errors.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @constructor
 */
exports.AdPost = (req, res) =>  {
    const { adTitle, price, phone, email, description } = req.body;

    let [newAdSameUser, cookies, existEmail] = handleCookie(req, res);

    let u = db.Ad.build({ AdTitle: adTitle.trim(), longDescription: description.trim(),
        price: price.trim(), phoneNumber: phone.trim(), email:email.trim() });

    return u.save().then(() => {
            if (existEmail) {
                cookies.set('email', email, {signed: true, maxAge: 1000 * 60 * 60});
            }

            cookies.set('lastPost',
                new Date().toLocaleString(), {signed: true,
                maxAge: 1000 * 60 * 60});

            res.render('index', {
                title: 'home', logout: (req.session.username),
                card: "", message: "-" }); })

        .catch((err) => {

            if (err instanceof Sequelize.ValidationError) {

                let [showError, errorIndex] = handleErrors(err);

                res.render('newAd', {
                    title: 'new Ad',
                    logout: (req.session.username),
                    error: errorIndex, show: showError, user: newAdSameUser
                });

            } else {
                res.render('error', { title: 'error',
                    logout: (req.session.username), error: err,
                });
            }
        })
}
/**
 * get form page of create new ad. do not show any errors
 * @param req
 * @param res
 * @constructor
 */
exports.AdGet = (req,res) => {
    res.render('newAd', { title: 'new Ad', logout: (req.session.username),
        error: new Array(5).fill(""),
        show: Array.from({length: 5}, () => ['', 'd-none']),
        user: handleCookie(req, res)[0]
    });
}
