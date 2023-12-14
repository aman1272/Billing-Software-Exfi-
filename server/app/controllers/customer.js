const { get_customers, insert_customer, get_all, get_count, delete_customer, edit_customer, insert_address, delete_multiple_contacts } = require('../modals/customer')

const insertCustomer = async (req, res) => {
    insert_customer(req, res)
};

const insertAddress = async (req, res) => {
    insert_address(req, res)
};


const getCustomers = async (req, res) => {
    get_customers(req, res)
};

const editCustomer = async (req, res) => {
    edit_customer(req, res)
};

const deleteCustomer = async (req, res) => {
    delete_customer(req, res)
};

const deleteMultipleContacts = async (req, res) => {
    delete_multiple_contacts(req, res)
};

//-------------------------------------------------------all contact--------------------------------------------------
const getAll = async (req, res) => {
    get_all(req, res)
}
const getCounts = async (req, res) => {
    get_count(req, res)
};
//--------------------------------------------------------------------------------------------------------------------
module.exports = {
    getCustomers, insertCustomer, getAll, getCounts, editCustomer, deleteCustomer, insertAddress, deleteMultipleContacts
}