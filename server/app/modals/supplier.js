const pool = require('./db')
const publicIp = require('ip');

const get_supplier = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        // const userId = req.body.data
        const sql = `SELECT id, name, created_date, display_name, username, mobile, type, (SELECT COUNT(*) FROM exfi.suppliers) AS total_counts
         FROM exfi.suppliers WHERE company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.suppliers WHERE id = "${id}" AND company_id = "${companyid}" `

        const sql3 = `SELECT id, name, created_date, display_name, username, mobile, type, (SELECT COUNT(*) FROM exfi.suppliers) AS total_counts
        FROM exfi.suppliers WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get supplier", err);
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

const insert_supplier = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        const { customer_name, display_name, mobile, username, gstin, tin, pan, vatno, dlno,
            billing_country, billing_city, billing_state, billing_pincode, address, companyid } = JSON.parse(req.body.data)

        if (!customer_name) return res.send({ message: " Supplier Name cannot be empty!", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!display_name) return res.send({ message: " Display Name cannot be empty!", error: true })
        else if (!mobile) return res.send({ message: " Phone cannot be empty!.", error: true })
        else if (mobile.length !==10) return res.send({ message: "Mobile number length shouldbe 10 digit!.", error: true })
        else if (!billing_country) return res.send({ message: " Billing Country cannot be empty!", error: true })
        else {
            const date = Math.floor(new Date / 1000)
            const currentIp = publicIp.address()

            const query = `INSERT INTO exfi.suppliers(company_id, name, display_name, created_date, ip, mobile,
                 username, gstin_number, tin_number, pan_number, vat_number, billing_pincode,
                  billing_city, billing_country, billing_address, dl_number, 
                  billing_state) VALUES ("${companyid}", "${customer_name}", "${display_name}", "${date}", "${currentIp}", "${mobile}", 
                    "${username}", "${gstin}", "${tin}", "${pan}", "${vatno}", "${billing_pincode}", 
                    "${billing_city}", "${billing_country}", "${address}", "${dlno}", "${billing_state}");`

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    res.status(200).send({ message: "Supplier added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_supplier = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { customer_name, display_name, mobile, username, gstin, tin, pan, vatno, dlno,
            billing_country, billing_city, billing_state, billing_pincode, address } = reqData

        if (!customer_name) return res.send({ message: " Supplier Name cannot be empty!", error: true })
        else if (!display_name) return res.send({ message: " Display Name cannot be empty!", error: true })
        else if (!mobile) return res.send({ message: " Phone cannot be empty!.", error: true })
        else if (mobile.length !==10) return res.send({ message: "Mobile number length shouldbe 10 digit!.", error: true })
        else if (!billing_country) return res.send({ message: " Billing Country cannot be empty!", error: true })
        else {

            const sql = `UPDATE exfi.suppliers SET name = "${customer_name}", display_name = "${display_name}",
            mobile = "${mobile}", username = "${username}", gstin_number = "${gstin}", tin_number = "${tin}",
            pan_number = "${pan}", vat_number = "${vatno}", billing_pincode = "${billing_pincode}",
            billing_address = "${address}", billing_state = "${billing_state}", billing_country = "${billing_country}",
            billing_city = "${billing_city}", dl_number = "${dlno}" WHERE id = "${id}"`;


            await pool.execute(sql, (err, result) => {
                if (!result || err) {
                    console.log("error when updateing customer", err)
                }
                else {
                    res.status(200).send({ message: "Supplier successfully updated", error: false, success: true })
                }
            })
        }
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_supplier = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.suppliers WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting supplier", err) }
            else {
                res.status(200).send({ data: result, message: "Supplier deleted successfully", error: false, success: true })
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
    get_supplier, insert_supplier, edit_supplier, delete_supplier
}