const { get_service, insert_service, edit_service, delete_service, delete_variation, delete_multiple_service } = require('../modals/service')

const insertService = async (req, res) => {
    insert_service(req, res)
};

const getService = async (req, res) => {
    get_service(req, res)
};

const editService = async (req, res) => {
    edit_service(req, res)
};

const deleteService = async (req, res) => {
    delete_service(req, res)
};

const deleteMultipleService = async (req, res) => {
    delete_multiple_service(req, res)
};

const deleteServiceVariation = async (req, res) => {
    delete_variation(req, res)
};

module.exports = {
    getService, insertService, editService, deleteService, deleteServiceVariation, deleteMultipleService
}