const pool = require('./db')
const publicIp = require('ip');


const get_categories = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT name, id, status, description, (SELECT COUNT(*) FROM exfi.item_categories) AS total_counts
         FROM exfi.item_categories WHERE company_id = "${companyid}"
         ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT name, id, status, description FROM exfi.item_categories WHERE id = "${id}"
         AND company_id = "${companyid}" `

        const sql3 = `SELECT name, id, status, description, (SELECT COUNT(*) FROM exfi.item_categories) AS total_counts
         FROM exfi.item_categories WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get categories");
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


const insert_category = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        const { name, description = "", status = 0, companyid } = JSON.parse(req.body.data)
        const currentIp = publicIp.address()

        if (!reqData) return res.send({ message: " empty fields not acceptable !", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!name) return res.send({ message: " Name can not be empty !", error: true })
        else {
            const date = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.item_categories(company_id, name, description, status, created_date, ip)
             VALUES ("${companyid}", "${name}", "${description}", "${status}", "${date}", "${currentIp}");`

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    res.status(200).send({ message: "Category added successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_category = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { name, description, status } = reqData

        if (!name) return res.send({ message: "  Name cannot be empty!", error: true })
        else {
            const sql = `UPDATE exfi.item_categories SET name = "${name}", description = "${description}",
            status = "${status}" WHERE id = "${id}"`;


            await pool.execute(sql, (err, result) => {
                if (!result || err) {
                    console.log("error when updateing category", err)
                }
                else {
                    res.status(200).send({ message: "Category successfully updated", error: false, success: true })
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

const edit_cat_status = async (req, res) => {
    try {
        const { id } = req.headers
        const status = req.body.status

        const sql = `UPDATE exfi.item_categories SET status = "${status}" WHERE id = "${id}" `
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


const delete_category = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.item_categories WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting supplier", err) }
            else {
                res.status(200).send({ data: result, message: "category deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_multiple_category = async (req, res) => {
    try {
        const ids = req.body.data.join()
        const sql = `DELETE FROM exfi.item_categories WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting category", err) }
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
    get_categories, insert_category, edit_category, delete_category, edit_cat_status, delete_multiple_category
}