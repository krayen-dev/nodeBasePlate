const HttpStatus = require('http-status-codes');

const userSVC = require('../services/userSVC');
// const customerSVC = require('../services/customerSVC');
// const labelSVC = require('../services/labelSVC');
const utilsSVC = require('../services/utils');

exports.inviteUser = async function (req, res) {
    try {
        const userToken = req.headers.authorization;
        const decodedToken = await utilsSVC.jwtDecoder(userToken);
        // const uniqueUserId = decodedToken.user_id;
        // const userEmail = decodedToken.email;
        const { emailAddress, name, role } = req.body;
        const customerId = decodedToken.customerId;
        console.log('customer Id', customerId);

        const tempPassword = randomString.generate({
            length: 8,
        });

        const inviteUserResult = await utilsSVC.createFirebaseUser(
            emailAddress,
            tempPassword,
            name
        );

        const updatedUserToken = await userSVC.updateUser(
            inviteUserResult.uid,
            customerId,
            role,
            name
        );

        const userDetails = {
            displayName: name,
            emailAddress: emailAddress,
            uuId: inviteUserResult.uid,
            role: role,
            customerId: customerId,
        };

        const user = await userSVC.createUser(userDetails);

        await utilsSVC.sendEmailInvite(emailAddress, tempPassword, name);

        res.status(HttpStatus.StatusCodes.CREATED).send({
            status: 'User invited successfully.',
        });
    } catch (error) {
        console.log(error);
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

exports.getUsersbyCustomer = async function (req, res) {
    try {
        const userToken = req.headers.authorization;

        const { customerId } = await utilsSVC.jwtDecoder(userToken);

        const users = await userSVC.getUsersbyCustomer(customerId);

        res.status(HttpStatus.StatusCodes.OK).send({
            status: 'User Details Fetched Successfully',
            data: users,
        });
    } catch (error) {
        console.log(error.message);
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
