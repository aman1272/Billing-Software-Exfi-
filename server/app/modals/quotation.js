const pool = require('./db')
const publicIp = require('ip');


const get_quotationInv = async (req, res) => {
    const { id } = req.headers
    try {
        const sql = `SELECT qi.id, qi.contact_id, qi.date, c.name AS customer_name, s.name AS supplier_name,
		qi.pre_quotation, qi.quotation, qi.quantity, t.percentage AS tax_percentage,
        qi.unit_price, t.name AS tax_name, qi.type, p.name AS product_name, 
        srv.name AS service_name, qi.hsn_code, qi.sac_code
        FROM quotation_item AS qi
        LEFT JOIN customers AS c ON qi.contact_id = c.id 
		LEFT JOIN suppliers AS s ON qi.contact_id = s.id 
        LEFT JOIN product AS p ON qi.product_id = p.id 
        LEFT JOIN item_tax AS t ON qi.tax_id = t.id 
        LEFT JOIN service AS srv ON qi.service_id = srv.id
        WHERE qi.contact_id = 1 ORDER BY qi.created_date DESC `

        const sql2 = `SELECT qi.id, qi.contact_id, qi.date, c.name AS customer_name, s.name AS supplier_name,
		qi.pre_quotation, qi.quotation, qi.quantity, t.percentage AS tax_percentage,
        qi.unit_price, t.name AS tax_name, qi.type, p.name AS product_name, 
        srv.name AS service_name, qi.hsn_code, qi.sac_code
        FROM quotation_item AS qi
        LEFT JOIN customers AS c ON qi.contact_id = c.id 
		LEFT JOIN suppliers AS s ON qi.contact_id = s.id 
        LEFT JOIN product AS p ON qi.product_id = p.id 
        LEFT JOIN item_tax AS t ON qi.tax_id = t.id 
        LEFT JOIN service AS srv ON qi.service_id = srv.id
        WHERE qi.contact_id = "${id}" ORDER BY qi.created_date DESC `


        const query = id ? sql2 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get quotationInv", err);
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


const get_quotationInvoice = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT q.id, q.contact_id, q.date, c.name AS customer_name,
        q.pre_quotation, q.quotation, q.total_sum AS totals_sum, q.created_date, q.shipping_charge,
        q.discount, q.total_tax, q.grand_total, q.contact_name, q.invoice_no, q.is_invoice
       FROM quotation AS q
       LEFT JOIN customers AS c ON q.contact_id = c.id WHERE q.company_id = "${companyid}"
       ORDER BY q.created_date DESC
        LIMIT ${limit} OFFSET ${skip}`

        const sql2 = `SELECT q.id, q.contact_id, q.date, c.name AS customer_name,
        q.pre_quotation, q.quotation, q.total_sum AS totals_sum, q.created_date, q.shipping_charge,
        q.discount, q.total_tax, q.grand_total, q.contact_name, q.invoice_no, q.is_invoice
       FROM quotation AS q
       LEFT JOIN customers AS c ON q.contact_id = c.id 
        WHERE q.contact_id = "${id}" AND q.company_id = "${companyid}" ORDER BY q.created_date DESC `

        const sql3 = `SELECT q.id, q.contact_id, q.date, c.name AS customer_name,
        q.pre_quotation, q.quotation, q.total_sum AS totals_sum, q.created_date, q.shipping_charge,
        q.discount, q.total_tax, q.grand_total, q.contact_name, q.invoice_no, q.is_invoice
       FROM quotation AS q
       LEFT JOIN customers AS c ON q.contact_id = c.id WHERE q.company_id = "${companyid}"
       ORDER BY q.created_date DESC`


        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get quotationInv", err);
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

const insert_quotationInv = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)

        console.log("insertData in quot 1", reqData)


        const { price, quantity, companyid, contacts, hsn_code = "", product = "", tax, type, uom, service = "", sac_code = "" } = reqData

        const currentIp = publicIp.address()

        if (!contacts) return res.send({ message: " contacts Name can not be empty !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (type === "" || type === undefined) return res.send({ message: " Type can not be empty !", error: true })
        else if (!product && !type) return res.send({ message: "Product can not be empty !", error: true })
        else if (!service && type) return res.send({ message: " Service can not be empty !", error: true })
        else {
            const createDate = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.quotation_item (company_id, contact_id,
                unit_price, quantity, hsn_code, product_id, tax_id, type, uom, service_id, sac_code, created_date, ip)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const values = [companyid, contacts, price, quantity, hsn_code, product, tax,
                type, uom, service, sac_code, createDate, currentIp]

            console.log("values", values)

            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting quotation Inv', err)
                }
                else {
                    console.log('quotation Invoice inserted')
                    res.status(200).send({ message: "quotation added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const insert_quotationInvoice = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)

        console.log("reqData", reqData)

        const { contacts = "", is_default_desc = 0, note = "", description = "", discount = "",
            is_discount = 0, totalSum = "", is_default_quotation = "", companyid, invoice = [], shipping_charge = 0,
            totalTax = "", grandTotal = "", quotation_prefix="", quotation_prefix2="", date="" } = reqData

        const currentIp = publicIp.address()

        if (!reqData) return res.send({ message: "empty fields not acceptable!", error: true })
        else {
            const createDate = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.quotation (company_id, contact_id, is_discount, discount, is_default_quot,
                description, is_default_desc, note, created_date, ip, total_sum, total_tax, grand_total, pre_quotation,
                 quotation, date, shipping_charge)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const quotation = quotation_prefix2 ? quotation_prefix2 : createDate

            const values = [companyid, contacts, is_discount, discount, is_default_quotation,
                description, is_default_desc, note, createDate, currentIp, totalSum,
                totalTax, grandTotal, quotation_prefix, quotation, date, shipping_charge]

            console.log("quotation", quotation)

            console.log("values", values)

            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting quotation Inv', err)
                }
                else {
                    console.log(' quotation Invoice inserted step 1')
                    const inv_id = result.insertId

                    if (invoice) {

                        invoice.forEach((data) => {

                            const { serviceid, sac_code, productid, hsn_code, quantity = 0, unit_price = 0, uom = "",
                                tax = 0, type = 0 } = data

                            if (type === "" || type === undefined) return res.send({ message: " Type can not be empty !", error: true })
                            else if (!productid && !type) return res.send({ message: "Product can not be empty !", error: true })
                            else if (!serviceid && type) return res.send({ message: " Service can not be empty !", error: true })
                            else {


                                const query = `INSERT INTO exfi.quotation_item (inv_id, company_id, contact_id, unit_price, quantity,
                                         hsn_code, product_id, tax_id, type, uom, service_id, sac_code, created_date, ip) 
                                         VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                                const values = [inv_id, companyid, contacts, unit_price, quantity,
                                    hsn_code, productid, tax,
                                    type, uom, serviceid, sac_code, createDate, currentIp]

                                console.log("values in invoices", values)

                                pool.execute(query, values, (err, result) => {
                                    if (!result || err) {
                                        console.log('Error in inserting quotation Inv', err)
                                    }
                                })
                            }
                        })
                        console.log("final => invoice item and invoice added")
                        res.status(200).send({ message: "quotation Invoice added successfully", success: true })
                    }
                    // res.status(200).send({ message: "quotation Invoice added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_quotationInv = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { code, code_number, description, gst_rate } = reqData

        const sql = `UPDATE exfi.quotation_item SET code = "${code}", code_number = "${code_number}", description = "${description}", gst_rate = "${gst_rate}" WHERE id = "${id}"`;

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing quotationInv", err)
            }
            else {
                res.status(200).send({ message: "quotationInv successfully updated", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_quotationInvoices = async (req, res) => {

    try {

        const reqData = JSON.parse(req.body.data)
        const { id, invoice_no, companyid } = reqData

        console.log("id and inv no", id, invoice_no)

        const sql = `UPDATE exfi.quotation SET invoice_no = "${invoice_no}", is_invoice = 1 WHERE id = "${id}"`;

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing quotationInvoices", err)
            }
            else {
                console.log("qutation update data successfully", result)
                res.status(200).send({ message: "quotation  successfully updated", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_quotationInv = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.quotation WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting quotationInv", err) }
            else {
                res.status(200).send({ data: result, message: "quotation deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const delete_multiple_quotation = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.quotation WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting quotation", err) }
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
    get_quotationInv, insert_quotationInv, edit_quotationInv, delete_quotationInv, get_quotationInvoice,
    insert_quotationInvoice, delete_multiple_quotation, edit_quotationInvoices
}