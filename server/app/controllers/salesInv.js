const { get_salesInv, insert_salesInv, edit_salesInv, delete_salesInv, insert_salesInvoice, get_salesInvoice, all_item_counts, delete_multiple_sales_invoices } = require('../modals/salesInv')

const insertSalesInv = async (req, res) => {
    insert_salesInv(req, res)
};

const getSalesInv = async (req, res) => {
    get_salesInv(req, res)
};

const insertSalesInvoice = async (req, res) => {
    insert_salesInvoice(req, res)
};

const getSalesInvoice = async (req, res) => {
    get_salesInvoice(req, res)
};

const editSalesInv = async (req, res) => {
    edit_salesInv(req, res)
};

const deleteSalesInv = async (req, res) => {
    delete_salesInv(req, res)
};

const deleteMultipleSalesInv = async (req, res) => {
    delete_multiple_sales_invoices(req, res)
};

const allInvoicesCounts = async (req, res) => {
    all_item_counts(req, res)
};

module.exports = {
    getSalesInv, insertSalesInv, editSalesInv, deleteSalesInv, getSalesInvoice,
    insertSalesInvoice, allInvoicesCounts, deleteMultipleSalesInv
}