const pool = require('./db')
const publicIp = require('ip');


const get_salesInv = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT si.id, si.customer_id, si.date, si.due_date, c.name,
        sa.shipping_address, si.pre_invoice, si.invoice, si.quantity,
        si.unit_price, t.name AS tax_name, si.type, p.name AS product_name, 
        s.name AS service_name
        FROM sales_inv_item AS si
        LEFT JOIN customers AS c ON si.customer_id = c.id 
        LEFT JOIN product AS p ON si.product_id = p.id 
        LEFT JOIN item_tax AS t ON si.tax_id = t.id 
        LEFT JOIN service AS s ON si.service_id = s.id
        LEFT JOIN customer_ship_address AS sa ON si.shipping_address_id = sa.id WHERE si.company_id = "${companyid}" ORDER BY si.created_date DESC; `

        const sql2 = `SELECT si.id, si.customer_id, si.date, si.due_date, c.name,
        sa.shipping_address, si.pre_invoice, si.invoice, si.quantity,
        si.unit_price, t.percentage AS tax_percentage, si.type, p.name AS product_name, 
        s.name AS service_name, si.created_date, si.hsn_code, si.sac_code
        FROM sales_inv_item AS si
        LEFT JOIN customers AS c ON si.customer_id = c.id 
        LEFT JOIN product AS p ON si.product_id = p.id 
        LEFT JOIN item_tax AS t ON si.tax_id = t.id 
        LEFT JOIN service AS s ON si.service_id = s.id
        LEFT JOIN customer_ship_address AS sa ON si.shipping_address_id = sa.id
        WHERE si.customer_id = "${id}" AND si.company_id = "${companyid}" ORDER BY si.created_date DESC `

        const sql3 = `SELECT * FROM exfi.sales_inv_item WHERE   company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get salesInv");
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


const get_salesInvoice = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT si.id, si.customer_id, si.date, si.due_date, c.name,
        si.pre_invoice, si.invoice, si.totals_sum, si.created_date,
        si.discount, si.total_tax, si.grand_total,
       si.payment_status, si.paid_amount, si.due_amount
       FROM sales_inv AS si
       LEFT JOIN customers AS c ON si.customer_id = c.id WHERE si.company_id = "${companyid}"
       ORDER BY si.created_date DESC
        LIMIT ${limit} OFFSET ${skip} `

        const sql2 = `SELECT si.id, si.customer_id, si.date, si.due_date, c.name,
        si.pre_invoice, si.invoice, si.totals_sum, si.created_date,
        si.discount, si.total_tax, si.grand_total,
       si.payment_status, si.paid_amount, si.due_amount
       FROM sales_inv AS si
       LEFT JOIN customers AS c ON si.customer_id = c.id 
        WHERE si.customer_id = "${id}" AND si.company_id = "${companyid}" ORDER BY si.created_date DESC `

        const sql3 = `SELECT si.id, si.customer_id, si.date, si.due_date, c.name,
        si.pre_invoice, si.invoice, si.totals_sum, si.created_date,
        si.discount, si.total_tax, si.grand_total,
       si.payment_status, si.paid_amount, si.due_amount
       FROM sales_inv AS si
       LEFT JOIN customers AS c ON si.customer_id = c.id WHERE si.company_id = "${companyid}"
       ORDER BY si.created_date DESC`


        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get salesInv");
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

const insert_salesInv = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)

        console.log("insertData", reqData)


        const { date, dueDate, price, quantity, companyid,
            customer, hsn_code = "", product = "", shiping_address, tax, type, uom, service = "", sac_code = "" } = reqData

        const currentIp = publicIp.address()

        if (!customer) return res.send({ message: " Customer Name can not be empty !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (type === "" || type === undefined) return res.send({ message: " Type can not be empty !", error: true })
        else if (!date) return res.send({ message: " Date can not be empty !", error: true })
        else if (!dueDate) return res.send({ message: " Due Date can not be empty !", error: true })
        else if (!product && !type) return res.send({ message: "Product can not be empty !", error: true })
        else if (!service && type) return res.send({ message: " Service can not be empty !", error: true })
        else {
            const createDate = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.sales_inv_item (company_id, customer_id, date, due_date, shipping_address_id, 
                unit_price, quantity, hsn_code, product_id, tax_id, type, uom, service_id, sac_code, created_date, ip)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const values = [companyid, customer, date, dueDate, shiping_address, price, quantity,
                hsn_code, product, tax,
                type, uom, service, sac_code, createDate, currentIp]


            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting Sales Inv', err)
                }
                else {
                    console.log(' Sales Invoice inserted')
                    res.status(200).send({ message: "Sales Invoice added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const insert_salesInvoice = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)

        const { customer = "", bank = "", is_default_desc = 0, note = "", description = "", discount = "",
            is_discount = 0, is_shipping_charge = "", shiping_charge = "", totalSum = "", companyid,
            totalTax = "", grandTotal = "", is_due_amount = "", shiping_address = "", is_default_inv,
            is_paid_amount = "", payment_status = 0, invoice_prefix = "", date = "", dueDate = date, invoice_prefix2,
            dueAmt, paidAmount, shipping_charge = null, invoice = [] } = reqData

        const currentIp = publicIp.address()
        if (!customer) return res.send({ message: " Customer Name can not be empty !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!date) return res.send({ message: " Date can not be empty !", error: true })
        // else if (!dueDate) return res.send({ message: " Due Date can not be empty !", error: true })
        // else if (!invoice.length) return res.send({ message: " Please add some invoices !", error: true })
        else {
            const createDate = Math.floor(new Date / 1000)
            const query = `INSERT INTO exfi.sales_inv (company_id, customer_id, is_shipping_charge, shiping_charge, is_discount, discount,
                description, is_default_desc, note, bank_id, created_date, ip, totals_sum, total_tax, grand_total, is_due_amount, 
                is_paid_amount, payment_status, pre_invoice, shipping_address_id, due_date, date, invoice, is_default_inv
                , due_amount, paid_amount, shipping_charge)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const invoice2 = invoice_prefix2 ? invoice_prefix2 : createDate

            const values = [companyid, customer, is_shipping_charge, shiping_charge, is_discount, discount,
                description, is_default_desc, note, bank, createDate, currentIp, totalSum,
                totalTax, grandTotal, is_due_amount, is_paid_amount, payment_status, invoice_prefix,
                shiping_address, dueDate, date, invoice2, is_default_inv, dueAmt, paidAmount, shipping_charge]


            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting Final Sales Inv', err)
                }
                else {
                    console.log(' Sales Invoice inserted step 1')
                    const inv_id = result.insertId

                    if (invoice) {

                        invoice.forEach((data) => {

                            const { serviceid, sac_code, productid, hsn_code, quantity = 0, unit_price = 0, uom = "",
                                tax = 0, type = 0 } = data

                            if (type === "" || type === undefined) return res.send({ message: " Type can not be empty !", error: true })
                            else if (!productid && !type) return res.send({ message: "Product can not be empty !", error: true })
                            else if (!serviceid && type) return res.send({ message: " Service can not be empty !", error: true })
                            else {


                                const query = `INSERT INTO exfi.sales_inv_item (inv_id, company_id, customer_id, unit_price, quantity,
                                     hsn_code, product_id, tax_id, type, uom, service_id, sac_code, created_date, ip) 
                                     VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                                const values = [inv_id, companyid, customer, unit_price, quantity,
                                    hsn_code, productid, tax,
                                    type, uom, serviceid, sac_code, createDate, currentIp]

                                console.log("values in invoices", values)

                                pool.execute(query, values, (err, result) => {
                                    if (!result || err) {
                                        console.log('Error in inserting Sales Inv', err)
                                    }
                                })
                            }
                        })
                        console.log("final => invoice item and invoice added")
                        res.status(200).send({ message: "Sales Invoice added successfully", success: true })
                    }
                    // res.status(200).send({ message: "Sales Invoice added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_salesInv = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { code, code_number, description, gst_rate } = reqData

        const sql = `UPDATE exfi.sales_inv_item SET code = "${code}", code_number = "${code_number}", description = "${description}", gst_rate = "${gst_rate}" WHERE id = "${id}"`;

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing salesInv", err)
            }
            else {
                res.status(200).send({ message: "salesInv successfully updated", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_salesInv = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.sales_inv WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting salesInv", err) }
            else {
                res.status(200).send({ data: result, message: "salesInv deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}



const delete_multiple_sales_invoices = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.sales_inv WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting Sales Invoices", err) }
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

const all_item_counts = async (req, res) => {
    const { companyid } = req.headers
    try {
        const sql = `SELECT
        'sales_invoice' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.sales_inv WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'purchase_invoice' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.purchase_inv WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'quotation_invoice' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.quotation WHERE company_id = "${companyid}";`

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error in get Invoices Items");
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

module.exports = {
    get_salesInv, insert_salesInv, edit_salesInv, delete_salesInv, get_salesInvoice,
    insert_salesInvoice, all_item_counts, delete_multiple_sales_invoices
}