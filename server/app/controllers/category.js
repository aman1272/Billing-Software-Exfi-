const { get_categories, insert_category, edit_category, delete_category, edit_cat_status, delete_multiple_category } = require('../modals/category')

const insertCategory = async (req, res) => {
    insert_category(req, res)
};

const getCategories = async (req, res) => {
    get_categories(req, res)
};

const editCategory = async (req, res) => {
    edit_category(req, res)
};

const editCategoryStatus = async (req, res) => {
    edit_cat_status(req, res)
};

const deleteCategory = async (req, res) => {
    delete_category(req, res)
};

const deleteMultipleCategory = async (req, res) => {
    delete_multiple_category(req, res)
};

module.exports = {
    getCategories, insertCategory, editCategory, deleteCategory, editCategoryStatus, deleteMultipleCategory
}