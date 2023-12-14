const pool = require('./db')
const publicIp = require('ip');


const get_bank = async (req, res) => {
    const { limit, skip, id } = req.headers
    try {
        const sql = `SELECT * FROM exfi.bank_details ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.bank_details WHERE customer_id = "${id}" `

        const sql3 = `SELECT * FROM exfi.bank_details ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get bank");
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


const insert_bank = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)

        const { acc_number, branch_name, ifsc_code, bank_name, customerId = 0, companyid } = reqData
        const currentIp = publicIp.address()

        if (!reqData) return res.send({ message: " empty fields not acceptable !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!bank_name) return res.send({ message: " Bank Name can not be empty !", error: true })
        else if (!ifsc_code) return res.send({ message: " IFSC code can not be empty !", error: true })
        else if (!branch_name) return res.send({ message: " Branch Name can not be empty !", error: true })
        else if (!acc_number) return res.send({ message: " Account Number can not be empty !", error: true })
        else {
            const date = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.bank_details (company_id, account_no, branch, ifsc_code, bank_name, customer_id, created_date, ip)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);`

            const values = [companyid, acc_number, branch_name, ifsc_code, bank_name, customerId, date, currentIp]


            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting Bank data', err)
                }
                else {

                    res.status(200).send({ message: "bank added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_bank = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { code, code_number, description, gst_rate } = reqData

        const sql = `UPDATE exfi.bank_details SET code = "${code}", code_number = "${code_number}", description = "${description}", gst_rate = "${gst_rate}" WHERE id = "${id}"`;

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing bank", err)
            }
            else {
                res.status(200).send({ message: "bank successfully updated", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_bank = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.bank_details WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting bank", err) }
            else {
                res.status(200).send({ data: result, message: "bank deleted successfully", error: false, success: true })
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
    get_bank, insert_bank, edit_bank, delete_bank
}