const { get_Hsn, insert_Hsn, edit_hsn, delete_hsn, delete_multiple_hsn } = require('../modals/hsnCode')

const insertHsn = async (req, res) => {
    insert_Hsn(req, res)
};

const getHsnCode = async (req, res) => {
    get_Hsn(req, res)
};

const editHsn = async (req, res) => {
    edit_hsn(req, res)
};

const deleteHsn = async (req, res) => {
    delete_hsn(req, res)
};


const deleteMultiplehsn = async (req, res) => {
    delete_multiple_hsn(req, res)
};

module.exports = {
    getHsnCode, insertHsn, editHsn, deleteHsn, deleteMultiplehsn
}