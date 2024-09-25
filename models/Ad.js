'use strict';
const { DataTypes, Model, Op } = require('sequelize');

/**
 * get html syntax of the card
 * @param title - str ad title
 * @param des - str ad des
 * @param price - str ad  price
 * @param phone - str ad phone
 * @param email - str ad email
 * @param date- str ad submitted time
 * @returns {string} - html of the card
 */
function getCard(title, des, price, phone, email, date){
    return   `  <div class="col"> <div class="card h-100">
                <div class="card-body"> <h5 class="card-title">${title}</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"></li>
                        <li class="list-group-item"> <b> Descption:</b>   ${des}  </li>
                        <li class="list-group-item"> <b> Price: </b> ${price} </li>
                        <li class="list-group-item"> <b> Phone Number: </b> ${phone} </li>
                        <li class="list-group-item"> <b> Email: </b> ${email} </li>
                    </ul></div>
                <div class="card-footer">
                    <small class="text-body-secondary"> Submitted In: ${date}</small>
                </div>
            </div>
        </div>`;
}

module.exports = (sequelize) => {
    class Ad extends Model {
        /**
         * count how many approved ads there are in the model
         * @returns {Promise<number>} - int - the length of the approved ads
         */
        static async countRows() {
            try {
                const approved = await this.findAll({
                    where: {approved: true}});
                return  approved.length;
            } catch (error) {
                throw new Error('Error counting rows: ' + error.message);
            }
        }
        /**
         * search for all the ads that have the str in their title
         * return html cards of the ads with the specific str
         * @param str = the string we are searching in title can be empty or null
         * @returns {Promise<string>} - return html cards of the ads with the specific str
         * @constructor
         */
        static async ADsCardsHTML(str) {
            try {
                let card = "";
                const data = (str && str !== "") ? await this.findAll({
                    where: {approved: true,
                        AdTitle:{
                            [Op.like]: `%${str}%`
                        }},
                    order: [['createdAt', 'DESC']]}) :
                    await this.findAll({
                        where: {approved: true},
                    order: [['createdAt', 'DESC']]});

                data.forEach(row => {
                    card += getCard(row.AdTitle, row.longDescription, row.price,
                        row.phoneNumber, row.email, row.createdAt);
                });

                return card;

            } catch (error) {
                throw new Error('Error: ' + error.message);
            }
        }

    }

    Ad.init({
        AdTitle: {
            type: DataTypes.STRING,
            len: {
                args: [0, 20],
                msg: '0Max title length is 20 character.'
            }
        },

        longDescription: {
            type: DataTypes.STRING,
            len: {
                args: [0, 200],
                msg: '1Max Description length is 200 character.'
            }
        },

        price: {
            type: DataTypes.STRING,
            validate: {
                isNumeric: {
                    msg: '2Price should be a number above 0.'
                },
                min: {
                    args: [0],
                    msg: '2Minimum Price is 0.'
                }
            }
        },

        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: {
                    args: /^(?:\d{2,3}-\d{7})?$/,
                    msg: '3Phone format is XXX-XXXXXXX (for example 02-1231212 or 055-1231212).'
                }
            }
        },

        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: '4This is not a valid email.'
                }
            }
        },

        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'Ad',
    });
    return Ad;
};

