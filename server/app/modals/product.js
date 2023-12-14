const pool = require('./db')
const publicIp = require('ip');


const get_prod = async (req, res) => {
    const { limit, skip, id, companyid } = req.headers

    try {
        const sql = `SELECT p.name AS name, p.mrp_price, p.opening_qty, p.id,
        p.created_date, p.mrp_price, p.uom, c.name AS category,
        b.name AS brand FROM exfi.product AS p 
       LEFT JOIN exfi.item_categories AS c ON p.category = c.id
       LEFT JOIN exfi.item_brand AS b ON p.brand = b.id WHERE p.company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT
    p.id, 
    p.name AS name,
    p.mrp_price,
    p.opening_qty,
    p.varient,
    p.hsn_code,
    p.uom,
    c.name AS category,
    t.name AS tax,
    p.description,
    p.p_price,
    p.p_price_tax_inc,
    p.s_price,
    p.s_price_tax_inc,
    p.category AS categoryId,
    p.tax AS taxId,
    p.brand AS brandId,
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
FROM exfi.product AS p 
LEFT JOIN exfi.item_categories AS c ON p.category = c.id
LEFT JOIN exfi.item_tax AS t ON p.tax = t.id
LEFT JOIN exfi.item_brand AS b ON p.brand = b.id
LEFT JOIN exfi.product_variation AS v ON p.id = v.product_id
WHERE p.id = "${id}" AND p.company_id = "${companyid}"
GROUP BY p.id,
         p.name, p.mrp_price, p.opening_qty, p.varient, p.hsn_code, p.uom,
         c.name, t.name, p.description, p.p_price, p.p_price_tax_inc, p.s_price, p.s_price_tax_inc, b.name; `

        const sql3 = `SELECT * FROM exfi.product WHERE company_id = "${companyid}" ORDER BY created_date DESC`

        const query = id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get products", err);
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


const insert_prod = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        let { description = "", uom, category, brand, hsn, tax, name, varient,
            mrp_price, s_price, s_price_tax_inc, p_price, p_price_tax_inc, opening_qty,
            variations = [], companyid } = reqData

        if (!name) return res.send({ message: " Product Name cannot be empty!", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!s_price) return res.send({ message: " S. Price cannot be empty!", error: true })
        else if (!p_price) return res.send({ message: " P. Price cannot be empty!", error: true })
        else {

            const currentIp = publicIp.address()

            if (!reqData) return res.send({ message: " empty fields not acceptable !", error: true })
            else {
                const date = Math.floor(new Date / 1000)

                const query = `INSERT INTO exfi.product(company_id, name, varient, category, brand, hsn_code, tax, uom, mrp_price,
                description, opening_qty, p_price, p_price_tax_inc, s_price, s_price_tax_inc, created_date, ip)
             VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

                const values = [companyid, name, varient, category, brand, hsn, tax, uom, mrp_price, String(description),
                    opening_qty, p_price, p_price_tax_inc, s_price, s_price_tax_inc, date, currentIp]


                await pool.execute(query, values, (err, result) => {
                    if (!result || err) {
                        console.log('Error in inserting data', err)
                    }
                    else {
                        let id = result.insertId

                        const addVariations = variations?.length ? variations : [{ size: "", colours: "", quantity: "", purchase_price: "", sales_price: "" }]
                        addVariations.forEach((data) => {
                            let { size, colours = "", quantity = opening_qty, purchase_price = p_price, sales_price = s_price } = data;

                            const newQuatity = quantity ? quantity : opening_qty
                            const newPurchasePrice = purchase_price ? purchase_price : p_price
                            const newSalesPrice = sales_price ? sales_price : s_price

                            const query = `INSERT INTO exfi.product_variation (company_id, product_id, ip, created_date, 
                              purchase_price, colours, quantity, sales_price, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

                            const values = [companyid, id, currentIp, date, newPurchasePrice, colours, newQuatity, newSalesPrice, size]

                            pool.execute(query, values, (err, result) => {
                                if (err) {
                                    console.error('Error inserting data of variations:', err);
                                }
                            });
                        });
                        res.status(200).send({ message: "Product added successfully", success: true })
                    }
                })
            }
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const edit_prod = async (req, res) => {

    try {
        const { id } = req.headers

        console.log("id in edit product", id)

        const reqData = JSON.parse(req.body.data)
        const { description, uom, category, brand, hsn, tax, name, varient,
            mrp_price, s_price, s_price_tax_inc, p_price, p_price_tax_inc, opening_qty,
            variations } = reqData

        if (!name) return res.send({ message: " Product Name cannot be empty!", error: true })
        else if (!s_price) return res.send({ message: " S. Price cannot be empty!", error: true })
        else if (!p_price) return res.send({ message: " P. Price cannot be empty!", error: true })
        else {

            const date = Math.floor(new Date / 1000)
            const currentIp = publicIp.address()

            const sql = `UPDATE exfi.product 
        SET name = ?,
        varient = ?,
        hsn_code = ?,
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

            const values = [name, varient, hsn, category, brand, tax, uom, mrp_price,
                description, opening_qty, p_price, p_price_tax_inc, s_price, s_price_tax_inc, id]

            await pool.execute(sql, values, (err, result) => {
                if (!result || err) {
                    console.log("error when updateing Product", err)
                }
                else {

                    const addVariations = variations.length ? variations : [{ size: "", colours: "", quantity: "", purchase_price: "", sales_price: "" }]

                    addVariations.forEach((data) => {
                        let { size = "", colours = "", quantity, purchase_price, sales_price } = data;

                        if (data.newid) {

                            const query = `INSERT INTO exfi.product_variation (product_id, ip, created_date,
                             purchase_price, colours, quantity, sales_price, size) VALUES ("${id}", "${currentIp}", "${date}", "${purchase_price}", "${colours}", "${quantity}", "${sales_price}", "${size}")`

                            pool.execute(query, (err, result) => {
                                if (err) {
                                    console.error('Error inserting data of variations:', err);
                                }
                            });
                        } else {

                            const query = `UPDATE exfi.product_variation SET purchase_price = "${purchase_price}", colours = "${colours}",
                         quantity = "${quantity}", sales_price = "${sales_price}", size = "${size}"  WHERE id = "${data.id}"`

                            pool.execute(query, (err, result) => {
                                if (err) {
                                    console.error('Error updating of variations:', err);
                                }
                            });
                        }
                    });
                    res.status(200).send({ message: "Product successfully updated", error: false, success: true })
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

const delete_prod = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.product WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting product", err) }
            else {
                res.status(200).send({ data: result, message: "Product deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const delete_multiple_product = async (req, res) => {
    try {
        const ids = req.body.data.join()

        const sql = `DELETE FROM exfi.product WHERE id IN (${ids}) `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting product", err) }
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
        const sql = `DELETE FROM exfi.product_variation WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting product", err) }
            else {
                res.status(200).send({ data: result, message: "Product Variation deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

//---------------------------------------------------------------------------------------counts-------------------------------------------------

const all_item_counts = async (req, res) => {
    const { companyid } = req.headers
    try {
        const sql = `SELECT
        'categories' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.item_categories WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'brand' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.item_brand WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'product' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.product WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'service' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.service WHERE company_id = "${companyid}";`

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
    get_prod, insert_prod, edit_prod, delete_prod, all_item_counts, delete_variation, delete_multiple_product
}