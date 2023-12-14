const express = require('express');
const router = express.Router();

const { signUp, signIn,
    updateProfile, updatePassword,
    getUser, } = require('../app/controllers/admin')

const { getCustomers, insertCustomer, editCustomer, deleteCustomer, getCounts, getAll, insertAddress, deleteMultipleContacts } = require('../app/controllers/customer')

const { getcompany, insertcompany, editcompany, deletecompany } = require('../app/controllers/company')

const { getSupplier, insertSupplier, editSupplier, deleteSupplier } = require('../app/controllers/supplier')

const { getCategories, insertCategory, editCategory, deleteCategory, editCategoryStatus, deleteMultipleCategory } = require('../app/controllers/category')

const { getBrands, insertBrand, editBrand, deleteBrand, editBrandStatus, deleteMultipleBrand } = require('../app/controllers/brand')

const { getTaxes, insertTax, editTax, deleteTax, allTaxCounts, editTaxStatus, deleteMultipletax } = require('../app/controllers/tax')

const { getHsnCode, insertHsn, editHsn, deleteHsn, deleteMultiplehsn } = require('../app/controllers/hsn')

const { getSacCode, insertSac, editSac, deleteSac, deleteMultiplesac } = require('../app/controllers/sacCode')

const { getProd, insertProd, editProd, deleteProd, allItemCounts, deleteProductVariation, deleteMultipleProd } = require('../app/controllers/product')

const { getService, insertService, editService, deleteService, deleteServiceVariation, deleteMultipleService } = require('../app/controllers/service')

const verifyToken = require('../app/Authentication/authentication');

const { getBank, insertBank, editBank, deleteBank } = require('../app/controllers/bank');
const { getSalesInv, insertSalesInv, editSalesInv, deleteSalesInv, getSalesInvoice, insertSalesInvoice, allInvoicesCounts, deleteMultipleSalesInv } = require('../app/controllers/salesInv');
const { getPurchaseInv, insertPurchaseInv, editPurchaseInv, deletePurchaseInv, getPurchaseInvoice, insertPurchaseInvoice, deleteMultiplepurchaseInv } = require('../app/controllers/purchaseinv');
const { getQuotationInv, insertQuotationInv, editQuotationInv, deleteQuotationInv, getQuotationInvoice, insertQuotationInvoice, deleteMultipleQuotation, editQuotationInvoice } = require('../app/controllers/quotationInv');

router.post("/api/user/detail", getUser);
router.post("/api/signin", signIn);
router.post("/api/signup", signUp);
router.put("/api/profile/update", updateProfile);
router.put("/api/password/update", updatePassword);


router.get("/api/all/contacts", verifyToken, getAll);
router.get("/api/all/counts", verifyToken, getCounts);
router.get("/api/all/item/counts", verifyToken, allItemCounts);
router.get("/api/all/tax/counts", verifyToken, allTaxCounts);


router.get("/api/company", verifyToken, getcompany);
router.post("/api/add/company", verifyToken, insertcompany);
router.put("/api/edit/company", verifyToken, editcompany);
router.delete("/api/delete/company", verifyToken, deletecompany);


router.get("/api/customers", verifyToken, getCustomers);
router.post("/api/add/customer", verifyToken, insertCustomer);
router.post("/api/add/customer/ship-address", verifyToken, insertAddress);
router.put("/api/edit/customers", verifyToken, editCustomer);
router.delete("/api/delete/customer", verifyToken, deleteCustomer);
router.delete("/api/delete/multiple/contacts", verifyToken, deleteMultipleContacts);


router.get("/api/suppliers", verifyToken, getSupplier);
router.post("/api/add/supplier", verifyToken, insertSupplier);
router.put("/api/edit/suppliers", verifyToken, editSupplier);
router.delete("/api/delete/supplier", verifyToken, deleteSupplier);


router.get("/api/categories", verifyToken, getCategories);
router.post("/api/add/category", verifyToken, insertCategory);
router.put("/api/edit/category", verifyToken, editCategory);
router.put("/api/edit/category/status", verifyToken, editCategoryStatus);
router.delete("/api/delete/category", verifyToken, deleteCategory);
router.delete("/api/delete/multiple/categories", verifyToken, deleteMultipleCategory);


router.get("/api/brands", verifyToken, getBrands);
router.post("/api/add/brand", verifyToken, insertBrand);
router.put("/api/edit/brand", verifyToken, editBrand);
router.put("/api/edit/brand/status", verifyToken, editBrandStatus);
router.delete("/api/delete/brand", verifyToken, deleteBrand);
router.delete("/api/delete/multiple/brand", verifyToken, deleteMultipleBrand);


router.get("/api/taxes", verifyToken, getTaxes);
router.post("/api/add/tax", verifyToken, insertTax);
router.put("/api/edit/tax", verifyToken, editTax);
router.put("/api/edit/tax/status", verifyToken, editTaxStatus);
router.delete("/api/delete/tax", verifyToken, deleteTax);
router.delete("/api/delete/multiple/tax", verifyToken, deleteMultipletax);


router.get("/api/hsn-codes", verifyToken, getHsnCode);
router.post("/api/add/hsn-code", verifyToken, insertHsn);
router.put("/api/edit/hsn-code", verifyToken, editHsn);
router.delete("/api/delete/hsn-code", verifyToken, deleteHsn);
router.delete("/api/delete/multiple/hsn", verifyToken, deleteMultiplehsn);


router.get("/api/sac-codes", verifyToken, getSacCode);
router.post("/api/add/sac-code", verifyToken, insertSac);
router.put("/api/edit/sac-code", verifyToken, editSac);
router.delete("/api/delete/sac-code", verifyToken, deleteSac);
router.delete("/api/delete/multiple/sac", verifyToken, deleteMultiplesac);


router.get("/api/products", verifyToken, getProd);
router.post("/api/add/product", verifyToken, insertProd);
router.put("/api/edit/product", verifyToken, editProd);
router.delete("/api/delete/product", verifyToken, deleteProd);
router.delete("/api/delete/product/variation", verifyToken, deleteProductVariation);
router.delete("/api/delete/multiple/product", verifyToken, deleteMultipleProd);


router.get("/api/services", verifyToken, getService);
router.post("/api/add/service", verifyToken, insertService);
router.put("/api/edit/service", verifyToken, editService);
router.delete("/api/delete/service", verifyToken, deleteService);
router.delete("/api/delete/service/variation", verifyToken, deleteServiceVariation);
router.delete("/api/delete/multiple/service", verifyToken, deleteMultipleService);


router.get("/api/bank", verifyToken, getBank);
router.post("/api/add/bank", verifyToken, insertBank);
router.put("/api/edit/bank", verifyToken, editBank);
router.delete("/api/delete/bank", verifyToken, deleteBank);

router.get("/api/sales-inv", verifyToken, getSalesInv);
router.post("/api/add/sales-inv", verifyToken, insertSalesInv);
router.put("/api/edit/sales-inv", verifyToken, editSalesInv);
router.delete("/api/delete/sales-inv", verifyToken, deleteSalesInv);
router.delete("/api/delete/multiple/sales-inv", verifyToken, deleteMultipleSalesInv);


router.get("/api/sales-invoice", verifyToken, getSalesInvoice);
router.post("/api/add/sales-invoice", verifyToken, insertSalesInvoice);

router.get("/api/purchase-inv", verifyToken, getPurchaseInv);
router.post("/api/add/purchase-inv", verifyToken, insertPurchaseInv);
router.put("/api/edit/purchase-inv", verifyToken, editPurchaseInv);
router.delete("/api/delete/purchase-inv", verifyToken, deletePurchaseInv);
router.delete("/api/delete/multiple/purchase-inv", verifyToken, deleteMultiplepurchaseInv);


router.get("/api/purchase-invoice", verifyToken, getPurchaseInvoice);
router.post("/api/add/purchase-invoice", verifyToken, insertPurchaseInvoice);

router.get("/api/quotation-inv", verifyToken, getQuotationInv);
router.post("/api/add/quotation-inv", verifyToken, insertQuotationInv);
router.put("/api/edit/quotation-inv", verifyToken, editQuotationInv);
router.put("/api/edit/quotation-invoice", verifyToken, editQuotationInvoice);

router.delete("/api/delete/quotation-inv", verifyToken, deleteQuotationInv);
router.delete("/api/delete/multiple/quotation", verifyToken, deleteMultipleQuotation);


router.get("/api/quotation-invoice", verifyToken, getQuotationInvoice);
router.post("/api/add/quotation-invoice", verifyToken, insertQuotationInvoice);
router.get("/api/all/invoices/counts", verifyToken, allInvoicesCounts);


module.exports = router;