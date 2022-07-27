const HttpStatus = require('http-status-codes');
const randomString = require('randomstring');

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
        // const customerId = decodedToken.customerId;
        console.log('customer Id', customerId);

        const tempPassword = randomString.generate({
            length: 8,
        });

        const inviteUserResult = await utilsSVC.createFirebaseUser(
            emailAddress,
            tempPassword,
            name,
            role
        );
        
        // THE BELOW LINE WILL NOT WORK. WILL THROW AN ERROR WHEN EXECUTED. SO COMMENTED
        // await utilsSVC.sendEmailInvite(emailAddress, tempPassword, name);

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

exports.updateUser = async function (req, res){
    try{
        const userToken = req.headers.authorization;
        const decodedToken = await utilsSVC.jwtDecoder(userToken);
        const userId = decodedToken.user_id;
        const userEmail = decodedToken.email;
        const displayName = decodedToken.displayName;
        const userRole = decodedToken.role;
        const updateUser = await userSVC.updateUser(userId, userRole, displayName, userEmail);
        res.status(HttpStatus.StatusCodes.OK).send({
            status: 'User Updated Successfully',
        })
    }catch(error){
        console.log(error);
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Something went wrong. Please try again later!'
        })
    }
};

exports.getUsers = async function(req, res){
    try{
        const getUsers = await userSVC.getAllusers();
        res.status(HttpStatus.StatusCodes.OK).send({
            status: 'Users fetched successfully',
            data: getUsers
        })
    }catch(error){
        console.log(error);
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: 'Something went wrong. Please try again later!'
        })
    }
}