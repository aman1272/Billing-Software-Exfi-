const { insert_user, sign_in,
    update_profile, update_password, get_user,
} = require('../modals/user')

const signUp = async (req, res) => {
    insert_user(req, res)
};

const signIn = async (req, res) => {
    sign_in(req, res)
};

const getUser = async (req, res) => {
    get_user(req, res)
};

const updateProfile = async (req, res) => {
    update_profile(req, res)
};

const updatePassword = async (req, res) => {
    update_password(req, res)
};



module.exports = {
    signUp, signIn, updateProfile,
    updatePassword, getUser,
};