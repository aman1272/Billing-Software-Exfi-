const { get_brands, insert_brand, edit_brand, delete_brand, edit_brand_status, delete_multiple_brand } = require('../modals/brand')

const insertBrand = async (req, res) => {
    insert_brand(req, res)
};

const getBrands = async (req, res) => {
    get_brands(req, res)
};

const editBrand = async (req, res) => {
    edit_brand(req, res)
};

const editBrandStatus = async (req, res) => {
    edit_brand_status(req, res)
};

const deleteBrand = async (req, res) => {
    delete_brand(req, res)
};

const deleteMultipleBrand = async (req, res) => {
    delete_multiple_brand(req, res)
};

module.exports = {
    getBrands, insertBrand, editBrand, deleteBrand, editBrandStatus, deleteMultipleBrand
}