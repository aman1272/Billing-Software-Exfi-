const pool = require('./db')
const publicIp = require('ip');


const get_Hsn = async (req, res) => {
    const { limit, skip, id, companyid } = req.headers
    try {
        const sql = `SELECT code, code_number, code_number, gst_rate, id, created_date, description FROM exfi.hsn_code WHERE company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.hsn_code WHERE id = "${id}" AND company_id = "${companyid}" `

        const sql3 = `SELECT code, code_number, code_number, gst_rate, id, created_date, description FROM exfi.hsn_code WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get Hsn",err);
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


const insert_Hsn = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        const { code, code_number, description = "", gst_rate, companyid } = reqData
        const currentIp = publicIp.address()

        if (!reqData) return res.send({ message: " empty fields not acceptable !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!code_number) return res.send({ message: " code number can not be empty !", error: true })
        else if (!code) return res.send({ message: " code can not be empty !", error: true })
        else if (!gst_rate) return res.send({ message: " GST rate can not be empty !", error: true })
        else {
            const sql = `SELECT * FROM exfi.hsn_code  WHERE code = "${code}"`

            await pool.execute(sql, async (err, result) => {
                if (!result || err) {
                    console.log('Error in finding hsn code', err)
                }
                else {
                    if (result.length) {
                        res.send({ message: " HSN Code already exist !", error: true })
                    } else {

                        const date = Math.floor(new Date / 1000)
                        const query = `INSERT INTO exfi.hsn_code (company_id, code, gst_rate, description, code_number, created_date, ip)
                         VALUES ( ?, ?, ?, ?, ?, ?, ?);`

                        const values = [companyid, code, gst_rate, description, code_number, date, currentIp]

                        await pool.execute(query, values, (err, result) => {
                            if (!result || err) {
                                console.log('Error in inserting data', err)
                            }
                            else {
                                res.status(200).send({ message: "Hsn added successfully", success: true })
                            }
                        })
                    }
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_hsn = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { code, code_number, description, gst_rate } = reqData

        const sql = `UPDATE exfi.hsn_code SET code = "${code}", code_number = "${code_number}", description = "${description}", gst_rate = "${gst_rate}" WHERE id = "${id}"`;

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error when updateing Hsn", err)
            }
            else {
                res.status(200).send({ message: "Hsn successfully updated", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_hsn = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.hsn_code WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting hsn", err) }
            else {
                res.status(200).send({ data: result, message: "Hsn deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_multiple_hsn = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.hsn_code WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting hsn", err) }
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
    get_Hsn, insert_Hsn, edit_hsn, delete_hsn, delete_multiple_hsn
}