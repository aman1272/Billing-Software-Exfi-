const { get_purchaseInv, insert_purchaseInv, edit_purchaseInv, delete_purchaseInv, get_purchaseInvoice, insert_purchaseInvoice, delete_multiple_purchase_inv } = require('../modals/purchaseInv')

const insertPurchaseInv = async (req, res) => {
    insert_purchaseInv(req, res)
};

const getPurchaseInv = async (req, res) => {
    get_purchaseInv(req, res)
};

const insertPurchaseInvoice = async (req, res) => {
    insert_purchaseInvoice(req, res)
};

const getPurchaseInvoice = async (req, res) => {
    get_purchaseInvoice(req, res)
};

const editPurchaseInv = async (req, res) => {
    edit_purchaseInv(req, res)
};

const deletePurchaseInv = async (req, res) => {
    delete_purchaseInv(req, res)
};


const deleteMultiplepurchaseInv = async (req, res) => {
    delete_multiple_purchase_inv(req, res)
};

module.exports = {
    getPurchaseInv, insertPurchaseInv, editPurchaseInv, deletePurchaseInv, getPurchaseInvoice, insertPurchaseInvoice, deleteMultiplepurchaseInv
}