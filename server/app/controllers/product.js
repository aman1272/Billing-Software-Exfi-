const { get_prod, insert_prod, edit_prod, delete_prod, all_item_counts, delete_variation, delete_multiple_product } = require('../modals/product')

const insertProd = async (req, res) => {
    insert_prod(req, res)
};

const getProd = async (req, res) => {
    get_prod(req, res)
};

const editProd = async (req, res) => {
    edit_prod(req, res)
};

const deleteProd = async (req, res) => {
    delete_prod(req, res)
};

const deleteMultipleProd = async (req, res) => {
    delete_multiple_product(req, res)
};

const deleteProductVariation = async (req, res) => {
    delete_variation(req, res)
};

const allItemCounts = async (req, res) => {
    all_item_counts(req, res)
};


module.exports = {
    getProd, insertProd, editProd, deleteProd, allItemCounts, deleteProductVariation, deleteMultipleProd
}