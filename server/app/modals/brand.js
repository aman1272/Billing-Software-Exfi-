const pool = require('./db')
const publicIp = require('ip');


const get_brands = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT name, id, status, description FROM exfi.item_brand WHERE company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.item_brand WHERE id = "${id}" AND company_id = "${companyid}" `

        const sql3 = `SELECT name, id, status, description FROM exfi.item_brand WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get brand");
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


const insert_brand = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        const { name, description = "", status=0, companyid } = reqData

        const currentIp = publicIp.address()

        if (!reqData) return res.send({ message: " empty fields not acceptable !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!name) return res.send({ message: " Name can not be empty !", error: true })
        else {
            const date = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.item_brand(company_id, name, description, status, created_date, ip)
             VALUES ("${companyid}", "${name}", "${description}", "${status}", "${date}", "${currentIp}");`

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    res.status(200).send({ message: "Brand added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_brand = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { name, description, status } = reqData

        if (!name) return res.send({ message: "  Name cannot be empty!", error: true })
        else {
            const sql = `UPDATE exfi.item_brand SET name = "${name}", description = "${description}", status = "${status}" WHERE id = "${id}"`;

            await pool.execute(sql, (err, result) => {
                if (!result || err) {
                    console.log("error when updateing brand", err)
                }
                else {
                    res.status(200).send({ message: "Brand successfully updated", error: false, success: true })
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

const edit_brand_status = async (req, res) => {
    try {
        const { id } = req.headers
        const status = req.body.status

        const sql = `UPDATE exfi.item_brand SET status = "${status}" WHERE id = "${id}" `
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


const delete_brand = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.item_brand WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting brand", err) }
            else {
                res.status(200).send({ data: result, message: "Brand deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_multiple_brand = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.item_brand WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting brand", err) }
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
    get_brands, insert_brand, edit_brand, delete_brand, edit_brand_status, delete_multiple_brand
}