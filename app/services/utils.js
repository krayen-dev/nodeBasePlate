const { getAuth } = require("firebase-admin/auth");
const jwtDecode = require("jwt-decode");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");


const jwtDecoder = function (userToken) {
    return new Promise((resolve, reject) => {
        try {
            resolve(jwtDecode(userToken));
        } catch (error) {
            reject(error)
        }
    })
}

const createFirebaseUser = async function (email, password, displayName) {
    return new Promise((resolve, reject) => {
        try {
            const inviteUserResult = getAuth().createUser({
                email: email,
                emailVerified: false,
                password: password,
                displayName: displayName,
                disabled: false
            })
            resolve(inviteUserResult)
        } catch (error) {
            reject(error)
        }
    })
}

const sendEmailInvite = async function (toEmail, password, name) {
    return new Promise((resolve, reject) => {
        try {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const fromEmail = process.env.SENDGRID_FROM_EMAIL
            const emailMessage = {
                to: toEmail,
                from: fromEmail,
                templateId: 'd-d36db4ce8e204f03a04fe36d18a6562e',
                dynamic_template_data: {
                    "name": name,
                    "tempPassword": password
                }
            };
            resolve(sgMail.send(emailMessage))
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { jwtDecoder, createFirebaseUser, sendEmailInvite }