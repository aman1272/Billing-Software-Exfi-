const { get_quotationInv, insert_quotationInv, edit_quotationInv, delete_quotationInv, get_quotationInvoice, insert_quotationInvoice, delete_multiple_quotation, edit_quotationInvoices
} = require('../modals/quotation')

const insertQuotationInv = async (req, res) => {
    insert_quotationInv(req, res)
};

const getQuotationInv = async (req, res) => {
    get_quotationInv(req, res)
};

const insertQuotationInvoice = async (req, res) => {
    insert_quotationInvoice(req, res)
};

const getQuotationInvoice = async (req, res) => {
    get_quotationInvoice(req, res)
};

const editQuotationInv = async (req, res) => {
    edit_quotationInv(req, res)
};

const editQuotationInvoice = async (req, res) => {
    edit_quotationInvoices(req, res)
};

const deleteQuotationInv = async (req, res) => {
    delete_quotationInv(req, res)
};

const deleteMultipleQuotation = async (req, res) => {
    delete_multiple_quotation(req, res)
};

module.exports = {
    getQuotationInv, insertQuotationInv, editQuotationInv, deleteQuotationInv, getQuotationInvoice, insertQuotationInvoice,
    deleteMultipleQuotation, editQuotationInvoice
}