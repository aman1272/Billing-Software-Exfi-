const pool = require('./db')
const publicIp = require('ip');


const get_purchaseInv = async (req, res) => {
    const { id } = req.headers
    try {
        const sql = `SELECT pi.id, pi.supplier_id, pi.date, slr.name,
        pi.pre_invoice, pi.invoice, pi.quantity, t.percentage AS tax_percentage,
        pi.unit_price, t.name AS tax_name, pi.type, p.name AS product_name, 
        s.name AS service_name, pi.hsn_code, pi.sac_code
        FROM purchase_inv_item AS pi
        LEFT JOIN suppliers AS slr ON pi.supplier_id = slr.id 
        LEFT JOIN product AS p ON pi.product_id = p.id 
        LEFT JOIN item_tax AS t ON pi.tax_id = t.id 
        LEFT JOIN service AS s ON pi.service_id = s.id
     ORDER BY pi.created_date DESC `

        const sql2 = `SELECT pi.id, pi.supplier_id, pi.date, slr.name,
        pi.pre_invoice, pi.invoice, pi.quantity, t.percentage AS tax_percentage,
        pi.unit_price, t.name AS tax_name, pi.type, p.name AS product_name, 
        s.name AS service_name, pi.hsn_code, pi.sac_code
        FROM purchase_inv_item AS pi
        LEFT JOIN suppliers AS slr ON pi.supplier_id = slr.id 
        LEFT JOIN product AS p ON pi.product_id = p.id 
        LEFT JOIN item_tax AS t ON pi.tax_id = t.id 
        LEFT JOIN service AS s ON pi.service_id = s.id
        WHERE pi.supplier_id = "${id}" ORDER BY pi.created_date DESC `



        const query = id ? sql2 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get purchaseInv", err);
                res.status(200).send({ err, error: true, message: "Something went wrong" })
            }
            else {
                res.status(200).send({ data: result, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const get_purchaseInvoice = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT pi.id, pi.supplier_id, pi.date, s.name,
        pi.pre_invoice, pi.invoice, pi.total_sum AS totals_sum, pi.created_date,
        pi.discount, pi.total_tax, pi.grand_total, pi.paid_amount, pi.shipping_charge, pi.due_amount,
       pi.payment_status, pi.paid_amount, pi.due_amount
       FROM purchase_inv AS pi
       LEFT JOIN suppliers AS s ON pi.supplier_id = s.id WHERE pi.company_id = "${companyid}"
       ORDER BY pi.created_date DESC
        LIMIT ${limit} OFFSET ${skip}`

        const sql2 = `SELECT pi.id, pi.supplier_id, pi.date, s.name,
        pi.pre_invoice, pi.invoice, pi.total_sum AS totals_sum, pi.created_date,
        pi.discount, pi.total_tax, pi.grand_total, pi.paid_amount, pi.shipping_charge, pi.due_amount,
       pi.payment_status, pi.paid_amount, pi.due_amount
       FROM purchase_inv AS pi
       LEFT JOIN suppliers AS s ON pi.supplier_id = s.id 
        WHERE pi.supplier_id = "${id}" AND company_id = "${companyid}" ORDER BY pi.created_date DESC `

        const sql3 = `SELECT pi.id, pi.supplier_id, pi.date, s.name,
        pi.pre_invoice, pi.invoice, pi.total_sum AS totals_sum, pi.created_date,
        pi.discount, pi.total_tax, pi.grand_total, pi.paid_amount, pi.shipping_charge, pi.due_amount,
       pi.payment_status, pi.paid_amount, pi.due_amount
       FROM purchase_inv AS pi 
       LEFT JOIN suppliers AS s ON pi.supplier_id = s.id WHERE pi.company_id = "${companyid}"
       ORDER BY pi.created_date DESC`


        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get purchaseInv", err);
                res.status(200).send({ err, error: true, message: "Something went wrong" })
            }
            else {
                res.status(200).send({ data: result, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const insert_purchaseInv = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)

        console.log("insertData", reqData)


        const { date, price, quantity, companyid,
            supplier, hsn_code = "", product = "", tax, type, uom, service = "", sac_code = "" } = reqData

        const currentIp = publicIp.address()

        if (!supplier) return res.send({ message: " supplier Name can not be empty !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (type === "" || type === undefined) return res.send({ message: " Type can not be empty !", error: true })
        else if (!date) return res.send({ message: " Date can not be empty !", error: true })
        else if (!product && !type) return res.send({ message: "Product can not be empty !", error: true })
        else if (!service && type) return res.send({ message: " Service can not be empty !", error: true })
        else {
            const createDate = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.purchase_inv_item (company_id, supplier_id, date,
                unit_price, quantity, hsn_code, product_id, tax_id, type, uom, service_id, sac_code, created_date, ip)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const values = [companyid, supplier, date, price, quantity,
                hsn_code, product, tax,
                type, uom, service, sac_code, createDate, currentIp]
            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting purchase Inv', err)
                }
                else {
                    console.log('purchase Invoice inserted')
                    res.status(200).send({ message: "purchase Invoice added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const insert_purchaseInvoice = async (req, res) => {
    try {
        // const reqData = JSON.parse(req.body.data)

        // console.log("reqData in final inv", reqData)

        // const { supplier = "", bank = "", is_default_desc = 0, note = "", description = "", discount = "",
        //     is_discount = 0, is_shipping_charge = "", shiping_charge = "", totalSum = "",
        //     totalTax = "", grandTotal = "", is_due_amount = "", companyid,
        //     is_paid_amount = "", payment_status = 0, date, invoice_prefix, invoice_prefix2,
        //     shippingCharges, paidAmount, dueAmt } = reqData

        // const currentIp = publicIp.address()

        // if (!reqData) return res.send({ message: "empty fields not acceptable!", error: true })
        // else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        // else {
        //     const createDate = Math.floor(new Date / 1000)

        //     const query = `INSERT INTO exfi.purchase_inv (company_id, supplier_id, is_shipping_charge, shiping_charge, is_discount, discount,
        //         description, is_default_desc, note, bank_id, created_date, ip, total_sum, total_tax, grand_total, is_due_amount, 
        //         is_paid_amount, payment_status, date, pre_invoice, invoice, due_amount, paid_amount, shipping_charge)
        //      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

        //     const invoice = invoice_prefix2 ? invoice_prefix2 : createDate


        //     const values = [companyid, supplier, is_shipping_charge, shiping_charge, is_discount, discount,
        //         description, is_default_desc, note, bank, createDate, currentIp, totalSum,
        //         totalTax, grandTotal, is_due_amount, is_paid_amount, payment_status, date, invoice_prefix, invoice,
        //         dueAmt, paidAmount, shippingCharges]

        //     console.log("values", values)

        //     await pool.execute(query, values, (err, result) => {
        //         if (!result || err) {
        //             console.log('Error in inserting Final purchase Inv', err)
        //         }
        //         else {
        //             console.log('Final purchase Invoice inserted')
        //             res.status(200).send({ message: "purchase Invoice added successfully", success: true })
        //         }
        //     })
        // }

        const reqData = JSON.parse(req.body.data)

        const { supplier = "", bank = "", is_default_desc = 0, note = "", description = "", discount = "",
            is_discount = 0, is_shipping_charge = "", totalSum = "", companyid,
            totalTax = "", grandTotal = "", is_due_amount = "", shiping_address = "", is_default_inv,
            is_paid_amount = "", payment_status = 0, invoice_prefix = "", date = "", invoice_prefix2,
            dueAmt, paidAmount, shipping_charge = null, invoice = [] } = reqData

        const currentIp = publicIp.address()
        if (!supplier) return res.send({ message: " Supplier Name can not be empty !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!date) return res.send({ message: " Date can not be empty !", error: true })
        else if (!invoice.length) return res.send({ message: " Please add some invoices !", error: true })
        else {
            const createDate = Math.floor(new Date / 1000)
            const query = `INSERT INTO exfi.purchase_inv (company_id, supplier_id, is_shipping_charge, shipping_charge, is_discount, discount,
                    description, is_default_desc, note, bank_id, created_date, ip, total_sum, total_tax, grand_total, is_due_amount, 
                    is_paid_amount, payment_status, pre_invoice, shipping_address_id, date, invoice, is_default_inv
                    , due_amount, paid_amount)
                 VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const invoice2 = invoice_prefix2 ? invoice_prefix2 : createDate

            const values = [companyid, supplier, is_shipping_charge, shipping_charge, is_discount, discount,
                description, is_default_desc, note, bank, createDate, currentIp, totalSum,
                totalTax, grandTotal, is_due_amount, is_paid_amount, payment_status, invoice_prefix,
                shiping_address, date, invoice2, is_default_inv, dueAmt, paidAmount]


            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting Final purchase Inv', err)
                }
                else {
                    console.log(' purchase Invoice inserted step 1')
                    const inv_id = result.insertId

                    if (invoice) {

                        invoice.forEach((data) => {

                            const { serviceid, sac_code, productid, hsn_code, quantity = 0, unit_price = 0, uom = "",
                                tax = 0, type = 0 } = data

                            if (type === "" || type === undefined) return res.send({ message: " Type can not be empty !", error: true })
                            else if (!productid && !type) return res.send({ message: "Product can not be empty !", error: true })
                            else if (!serviceid && type) return res.send({ message: " Service can not be empty !", error: true })
                            else {


                                const query = `INSERT INTO exfi.purchase_inv_item (inv_id, company_id, supplier_id, unit_price, quantity,
                                         hsn_code, product_id, tax_id, type, uom, service_id, sac_code, created_date, ip) 
                                         VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                                const values = [inv_id, companyid, supplier, unit_price, quantity,
                                    hsn_code, productid, tax,
                                    type, uom, serviceid, sac_code, createDate, currentIp]

                                console.log("values in invoices", values)

                                pool.execute(query, values, (err, result) => {
                                    if (!result || err) {
                                        console.log('Error in inserting purchase Inv', err)
                                    }
                                })
                            }
                        })
                        console.log("final => invoice item and invoice added")
                        res.status(200).send({ message: "purchase Invoice added successfully", success: true })
                    }
                    // res.status(200).send({ message: "purchase Invoice added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_purchaseInv = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { code, code_number, description, gst_rate } = reqData

        const sql = `UPDATE exfi.purchase_inv_item SET code = "${code}", code_number = "${code_number}", description = "${description}", gst_rate = "${gst_rate}" WHERE id = "${id}"`;

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing purchaseInv", err)
            }
            else {
                res.status(200).send({ message: "purchaseInv successfully updated", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_purchaseInv = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.purchase_inv WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting purchaseInv", err) }
            else {
                res.status(200).send({ data: result, message: "purchaseInv deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const delete_multiple_purchase_inv = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.purchase_inv WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting purchase inv", err) }
            else {
                res.status(200).send({ data: result, message: " deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


module.exports = {
    get_purchaseInv, insert_purchaseInv, edit_purchaseInv, delete_purchaseInv,
    get_purchaseInvoice, insert_purchaseInvoice, delete_multiple_purchase_inv
}