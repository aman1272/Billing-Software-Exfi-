const { get_Taxes, insert_Tax, edit_tax, delete_tax, all_tax_counts, edit_tax_status, delete_multiple_tax } = require('../modals/tax')

const insertTax = async (req, res) => {
    insert_Tax(req, res)
};

const getTaxes = async (req, res) => {
    get_Taxes(req, res)
};

const editTax = async (req, res) => {
    edit_tax(req, res)
};

const editTaxStatus = async (req, res) => {
    edit_tax_status(req, res)
};

const deleteTax = async (req, res) => {
    delete_tax(req, res)
};

const deleteMultipletax = async (req, res) => {
    delete_multiple_tax(req, res)
};

const allTaxCounts = async (req, res) => {
    all_tax_counts(req, res)
};


module.exports = {
    getTaxes, insertTax, editTax, deleteTax, allTaxCounts, editTaxStatus, deleteMultipletax
}