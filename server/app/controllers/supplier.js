const { get_supplier, insert_supplier, edit_supplier, delete_supplier } = require('../modals/supplier')

const insertSupplier = async (req, res) => {
    insert_supplier(req, res)
};

const getSupplier = async (req, res) => {
    get_supplier(req, res)
};

const editSupplier = async (req, res) => {
    edit_supplier(req, res)
};

const deleteSupplier = async (req, res) => {
    delete_supplier(req, res)
};

module.exports = {
    getSupplier, insertSupplier, editSupplier, deleteSupplier
}