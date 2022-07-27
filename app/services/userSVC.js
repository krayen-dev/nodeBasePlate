// const jwtDecode = require("jwt-decode");
const { auth } = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
require("dotenv").config();

const updateUser = (async (userId, customerId, userRole, displayName) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await getAuth().setCustomUserClaims(userId, {
                customerId: customerId,
                role: userRole,
                displayName: displayName
            }));
        } catch (error) {
            console.log(error)
            reject(error);
        }
    })
})


const getAllusers = (async () => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(await auth.listUsers().then((userRecords) => {
                userRecords.users.forEach((user) => console.log(user.toJSON()));
            }));
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
})

module.exports = { updateUser, getAllusers }