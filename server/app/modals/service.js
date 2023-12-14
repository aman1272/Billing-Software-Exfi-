const pool = require('./db')
const publicIp = require('ip');


const get_service = async (req, res) => {
    const { limit, skip, id,companyid } = req.headers
    try {
        const sql = `SELECT s.name AS name, s.id, s.mrp_price, s.opening_qty,
        s.created_date, s.mrp_price, s.uom, c.name AS category,
        b.name AS brand FROM exfi.service AS s 
       LEFT JOIN exfi.item_categories AS c ON s.category = c.id
       LEFT JOIN exfi.item_brand AS b ON s.brand = b.id WHERE s.company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT
       s.id, 
       s.name AS name,
       s.mrp_price,
       s.opening_qty,
       s.varient,
       s.sac_code,
       s.uom,
       s.category AS categoryId,
       s.tax AS taxId,
       s.brand AS brandId,
       c.name AS category,
       t.name AS tax,
       s.description,
       s.p_price,
       s.p_price_tax_inc,
       s.s_price,
       s.s_price_tax_inc,
       b.name AS brand,
       JSON_ARRAYAGG(
           JSON_OBJECT(
               'purchase_price', v.purchase_price, 
               'colours', v.colours,
               'quantity', v.quantity, 
               'sales_price', v.sales_price,
               'size', v.size,
               'id',v.id
           )
       ) AS variations
   FROM exfi.service AS s 
   LEFT JOIN exfi.item_categories AS c ON s.category = c.id
   LEFT JOIN exfi.item_tax AS t ON s.tax = t.id
   LEFT JOIN exfi.item_brand AS b ON s.brand = b.id
   LEFT JOIN exfi.service_variation AS v ON s.id = v.service_id
   WHERE s.id = "${id}" AND s.company_id = "${companyid}"
   GROUP BY s.id,
            s.name, s.mrp_price, s.opening_qty, s.varient, s.sac_code, s.uom,
            c.name, t.name, s.description, s.p_price, s.p_price_tax_inc, s.s_price, s.s_price_tax_inc, b.name; 
`

        const sql3 = `SELECT * FROM exfi.service WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get servicees", err);
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


const insert_service = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        let { description, uom, category, brand = "", sac = "", tax = "", name = "", varient = "",
            mrp_price = "", s_price = "", s_price_tax_inc = "", p_price = "", p_price_tax_inc = "", opening_qty = "",
            variations = [], companyid } = reqData
        const currentIp = publicIp.address()


        if (!name) return res.send({ message: " Service Name cannot be empty!", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!s_price) return res.send({ message: " S. Price cannot be empty!", error: true })
        else if (!p_price) return res.send({ message: " P. Price cannot be empty!", error: true })
        else {
            const date = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.service(company_id, name, varient, category, brand, sac_code, tax, uom, mrp_price,
                description, opening_qty, p_price, p_price_tax_inc, s_price, s_price_tax_inc, created_date, ip)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

            const values = [companyid, name, varient, category, brand, sac, tax, uom, mrp_price, String(description),
                opening_qty, p_price, p_price_tax_inc, s_price, s_price_tax_inc, date, currentIp]

            console.log(" reqdata in service", reqData)
            console.log("values in service", values)

            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data in Service', err)
                }
                else {
                    let id = result.insertId

                    const addVariations = variations?.length ? variations : [{ size: "", colours: "", quantity: "", purchase_price: "", sales_price: "" }]
                    addVariations?.forEach((data) => {
                        let { size, colours = "", quantity = opening_qty, purchase_price = p_price, sales_price = s_price } = data;

                        const newQuatity = quantity ? quantity : opening_qty
                        const newPurchasePrice = purchase_price ? purchase_price : p_price
                        const newSalesPrice = sales_price ? sales_price : s_price

                        const query = `INSERT INTO exfi.service_variation (company_id, service_id, ip, created_date, purchase_price, colours,
                                                quantity, sales_price, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

                        const values = [companyid, id, currentIp, date, newPurchasePrice, colours, newQuatity, newSalesPrice, size]

                        pool.execute(query, values, (err, result) => {
                            if (err) {
                                console.error('Error inserting data of variations:', err);
                            }
                        });
                    });
                    res.status(200).send({ message: "Service added successfully", success: true })
                }
            });
        }
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_service = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        let { description, uom, category, brand, sac, tax, name, varient,
            mrp_price, s_price, s_price_tax_inc, p_price, p_price_tax_inc, opening_qty,
            variations } = reqData

        const date = Math.floor(new Date / 1000)
        const currentIp = publicIp.address()

        if (!name) return res.send({ message: " Service Name cannot be empty!", error: true })
        else if (!s_price) return res.send({ message: " S. Price cannot be empty!", error: true })
        else if (!p_price) return res.send({ message: " P. Price cannot be empty!", error: true })
        else {

            const sql = `UPDATE exfi.service
        SET name = ?,
            varient = ?,
            sac_code = ?,
            category = ?,
            brand = ?,
            tax = ?,
            uom = ?,
            mrp_price = ?,
            description = ?,
            opening_qty = ?,
            p_price = ?,
            p_price_tax_inc = ?,
            s_price = ?,
            s_price_tax_inc = ?
        WHERE id = ?`;

            const values = [name, varient, sac, category, brand, tax, uom, mrp_price,
                description, opening_qty, p_price, p_price_tax_inc, s_price, s_price_tax_inc, id]

            await pool.execute(sql, values, (err, result) => {
                if (!result || err) {
                    console.log("error when updateing service", err)
                }
                else {

                    const addVariations = variations.length ? variations : [{ size: "", colours: "", quantity: "", purchase_price: "", sales_price: "" }]
                    addVariations.forEach((data) => {
                        let { size = "", colours = "", quantity, purchase_price, sales_price } = data;

                        if (data.newid) {

                            const query = `INSERT INTO exfi.service_variation (service_id, ip, created_date,
                             purchase_price, colours, quantity, sales_price, size) VALUES ("${id}", "${currentIp}", "${date}", "${purchase_price}", "${colours}", "${quantity}", "${sales_price}", "${size}")`

                            pool.execute(query, (err, result) => {
                                if (err) {
                                    console.error('Error inserting data of variations:', err);
                                }
                            });
                        } else {
                            const query = `UPDATE exfi.service_variation SET purchase_price = "${purchase_price}", colours = "${colours}",
                         quantity = "${quantity}", sales_price = "${sales_price}", size = "${size}"  WHERE id = "${data.id}"`

                            pool.execute(query, (err, result) => {
                                if (err) {
                                    console.error('Error updating of variations:', err);
                                }
                            });
                        }
                    });
                    res.status(200).send({ message: "service successfully updated", error: false, success: true })
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

const delete_service = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.service WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting Service", err) }
            else {
                res.status(200).send({ data: result, message: "service deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_multiple_service = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.service WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting service", err) }
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

const delete_variation = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.service_variation WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting product", err) }
            else {
                res.status(200).send({ data: result, message: "Service Variation deleted successfully", error: false, success: true })
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
    get_service, insert_service, edit_service, delete_service, delete_variation, delete_multiple_service
}