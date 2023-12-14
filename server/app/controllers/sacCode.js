const { get_sac, insert_sac, edit_sac, delete_sac, delete_multiple_sac_code } = require('../modals/sacCode')

const insertSac = async (req, res) => {
    insert_sac(req, res)
};

const getSacCode = async (req, res) => {
    get_sac(req, res)
};

const editSac = async (req, res) => {
    edit_sac(req, res)
};

const deleteSac = async (req, res) => {
    delete_sac(req, res)
};

const deleteMultiplesac = async (req, res) => {
    delete_multiple_sac_code(req, res)
};

module.exports = {
    getSacCode, insertSac, editSac, deleteSac, deleteMultiplesac
}