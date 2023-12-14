const { get_bank, insert_bank, edit_bank, delete_bank } = require('../modals/bank')

const insertBank = async (req, res) => {
    insert_bank(req, res)
};

const getBank = async (req, res) => {
    get_bank(req, res)
};

const editBank = async (req, res) => {
    edit_bank(req, res)
};

const deleteBank = async (req, res) => {
    delete_bank(req, res)
};


module.exports = {
    getBank, insertBank, editBank, deleteBank
}