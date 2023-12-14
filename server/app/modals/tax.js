const pool = require('./db')
const publicIp = require('ip');


const get_Taxes = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT name, id, percentage, status, created_date FROM exfi.item_tax WHERE company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.item_tax WHERE id = "${id}" AND company_id = "${companyid}" `

        const sql3 = `SELECT name, id, percentage, status, created_date FROM exfi.item_tax WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get taxes");
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


const insert_Tax = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        const { name, tax = 0, percentage, status = 0, companyid } = reqData
        const currentIp = publicIp.address()
        const taxPercentage = percentage ? percentage : tax

        if (!reqData) return res.send({ message: " empty fields not acceptable !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!name) return res.send({ message: " Tax Name can not be empty !", error: true })
        else if (!taxPercentage) return res.send({ message: "Tax percentage can not be empty !", error: true })
        else {
            const date = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.item_tax(company_id, name, percentage, status, created_date, ip)
             VALUES ("${companyid}", "${name}", "${taxPercentage}", "${status}", "${date}", "${currentIp}");`

            console.log("req data and values", reqData, query)

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    res.status(200).send({ message: "Tax added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_tax = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { name, percentage, status } = reqData

        const sql = `UPDATE exfi.item_tax SET name = "${name}", percentage = "${percentage}", status = "${status}" WHERE id = "${id}"`;


        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing Tax", err)
            }
            else {
                res.status(200).send({ message: "Tax updated successfully ", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_tax_status = async (req, res) => {
    try {
        const { id } = req.headers
        const status = req.body.status

        const sql = `UPDATE exfi.item_tax SET status = "${status}" WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("err", err)
            }
            else {
                res.status(200).send({ success: true, message: "Status Update Successfully", error: false })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_tax = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.item_tax WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting supplier", err) }
            else {
                res.status(200).send({ data: result, message: "Tax deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_multiple_tax = async (req, res) => {
    try {
        const ids = req.body.data
        const sql = `DELETE FROM exfi.item_tax WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting tax", err) }
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


const all_tax_counts = async (req, res) => {
    const {  companyid } = req.headers
    try {
        const sql = `SELECT
        'tax' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.item_tax WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'hsn' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.hsn_code WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'sac' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.sac_code WHERE company_id = "${companyid}";`

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error in get Items");
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
    get_Taxes, insert_Tax, edit_tax, delete_tax, all_tax_counts, edit_tax_status, delete_multiple_tax
}