const { get_company, insert_company, delete_company, edit_company } = require('../modals/company')

const insertcompany = async (req, res) => {
    insert_company(req, res)
};

const getcompany = async (req, res) => {
    get_company(req, res)
};

const editcompany = async (req, res) => {
    edit_company(req, res)
};

const deletecompany = async (req, res) => {
    delete_company(req, res)
};


module.exports = {
    getcompany, insertcompany, editcompany, deletecompany
}