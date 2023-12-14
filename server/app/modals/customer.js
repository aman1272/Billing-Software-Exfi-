const pool = require('./db')
const publicIp = require('ip');


const get_customers = async (req, res) => {
    const { limit, skip, id, is_ship_address, companyid } = req.headers
    console.log("isShipping Address", is_ship_address)

    try {
        const sql = `SELECT id, created_date, name, display_name, username, mobile, type, (SELECT COUNT(*) FROM exfi.customers) AS total_counts
         FROM exfi.customers WHERE company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.customers WHERE id = "${id}" AND company_id = "${companyid}"  ORDER BY created_date DESC `

        const sql3 = `SELECT * FROM exfi.customers WHERE company_id = "${companyid}"  ORDER BY created_date DESC;`

        const sql4 = `SELECT id, shipping_address FROM exfi.customer_ship_address WHERE customer_id = "${id}" AND company_id = "${companyid}" ORDER BY created_date DESC;`

        const query = (is_ship_address && id) ? sql4 : id ? sql2 : (!limit || !skip) ? sql3 : sql

        console.log("query", query)
        
        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get customers", err);
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

const get_address = async (req, res) => {
    const { limit, skip, id, is_ship_address, companyid } = req.headers

    try {
        const sql = `SELECT id, created_date, name, display_name, username, mobile, type, (SELECT COUNT(*) FROM exfi.customers) AS total_counts
         FROM exfi.customers WHERE company_id = "${companyid}" ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT * FROM exfi.customers WHERE id = "${id}" AND company_id = "${companyid}"  ORDER BY created_date DESC `

        const sql3 = `SELECT * FROM exfi.customers WHERE company_id = "${companyid}"  ORDER BY created_date DESC;`

        const sql4 = `SELECT id, shipping_address FROM exfi.customer_ship_address WHERE customer_id = "${id}" AND company_id = "${companyid}" ORDER BY created_date DESC; ;`

        const query = (is_ship_address && id) ? sql4 : id ? sql2 : (!limit || !skip) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get customers", err);
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


const insert_address = async (req, res) => {
    try {

        const { companyid, customerId, mobile = "", shiping_address = "", shiping_city = "", shiping_pincode = "", shiping_state = "", shiping_country = "" } = JSON.parse(req.body.data)

        const date = Math.floor(new Date / 1000)
        const currentIp = publicIp.address()

        const query = `INSERT INTO exfi.customer_ship_address (company_id, customer_id, ip, created_date, shipping_address, shipping_city,
             shipping_country, shipping_state, shipping_pin_code, shipping_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const values = [companyid, customerId, currentIp, date, shiping_address, shiping_city, shiping_country, shiping_state, shiping_pincode
            , mobile]

        pool.execute(query, values, (err, result) => {
            if (!result || err) {
                console.log("error in get insert Shipping Address", err);
            }
            else {
                console.log("success data saved in customers Shipping Address")
                res.status(200).send({ message: "Address added successfully", success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const insert_customer = async (req, res) => {
    try {
        const reqData = JSON.parse(req.body.data)
        const { customer_name, display_name, mobile, username, gstin, tin, pan, vatno, dlno,
            billing_country, billing_city, billing_state, billing_pincode, shiping_pincode = "", companyid,
            shiping_city = "", shiping_state = billing_state, shiping_country = billing_country, shiping_address = "", shiping_username = "",
            shiping_mobile = "", display_name_ship = display_name, contact_name_ship = customer_name, address } = reqData

        console.log("reqdata", reqData)

        if (!customer_name) return res.send({ message: " Customer Name cannot be empty!", error: true })
        else if (!companyid) return res.send({ message: "Please check and verify your company !", error: true })
        else if (!display_name) return res.send({ message: " Display Name cannot be empty!", error: true })
        else if (!mobile) return res.send({ message: " Phone Number cannot be empty!.", error: true })
        else if (mobile.length !== 10) return res.send({ message: "Mobile number length shouldbe 10 digit!.", error: true })
        else if (!billing_country) return res.send({ message: " Billing Country cannot be empty!", error: true })
        else if (!contact_name_ship) return res.send({ message: " Contact ship Name cannot be empty!", error: true })
        else if (!shiping_country) return res.send({ message: " Shipping Country cannot be empty!.", error: true })
        else {
            const date = Math.floor(new Date / 1000)
            const currentIp = publicIp.address()



            const query = `INSERT INTO exfi.customers(company_id,name, display_name, created_date, ip, mobile,
                 username, gstin_number, tin_number, pan_number, vat_number, shipping_contact_name, billing_pincode,
                  billing_city, billing_country, billing_address, dl_number, shiping_pincode, shiping_city,
                   shiping_state, shiping_country, shiping_address, shiping_email, shiping_mobile,
                    shipping_display_name, billing_state) VALUES ("${companyid}", "${customer_name}", "${display_name}", "${date}", "${currentIp}", "${mobile}", 
                    "${username}", "${gstin}", "${tin}", "${pan}", "${vatno}", "${contact_name_ship}", "${billing_pincode}", 
                    "${billing_city}", "${billing_country}", "${address}", "${dlno}", "${shiping_pincode}", "${shiping_city}",
                     "${shiping_state}", "${shiping_country}", 
                    "${shiping_address}", "${shiping_username}", "${shiping_mobile}", "${display_name_ship}", "${billing_state}");`

            console.log("step2", query)

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    console.log("step RESULT--", result)
                    if (shiping_address) {

                        let id = result.insertId

                        console.log("step3 id--", id)
                        const query = `INSERT INTO exfi.customer_ship_address (company_id, customer_id, ip, created_date, shipping_address, shipping_city
                            , shipping_country, shipping_state, shipping_pin_code, shipping_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

                        const values = [companyid, id, currentIp, date, shiping_address, shiping_city, shiping_country, shiping_state, shiping_pincode
                            , shiping_mobile]

                        console.log("step 4", values)
                        pool.execute(query, values, (err, result) => {
                            if (err) {
                                console.error('Error inserting data of in Shipping address:', err);
                            }
                            else {
                                console.log("success data saved in customers")
                            }
                        });

                    }
                    res.status(200).send({ message: "Customer added successfully", success: true })
                }
            })

        }
    } catch {
        (err) => {
            console.log("Error  data saved in customers")
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}



const edit_customer = async (req, res) => {

    try {
        const { id } = req.headers

        const reqData = JSON.parse(req.body.data)
        const { customer_name, display_name, mobile, username, gstin, tin, pan, vatno, dlno,
            billing_country, billing_city, billing_state, billing_pincode, shiping_pincode,
            shiping_city, shiping_state, shiping_country, shiping_address, shiping_username,
            shiping_mobile, display_name_ship, contact_name_ship, address } = reqData


        if (!customer_name) return res.send({ message: " Customer cannot be empty!", error: true })
        else if (!display_name) return res.send({ message: " Display Name cannot be empty!", error: true })
        else if (!mobile) return res.send({ message: " Phone Number cannot be empty!.", error: true })
        else if (mobile.length !== 10) return res.send({ message: "Mobile number length shouldbe 10 digit!.", error: true })
        else if (!billing_country) return res.send({ message: " Billing Country cannot be empty!", error: true })
        else if (!contact_name_ship) return res.send({ message: " Contact Name cannot be empty!", error: true })
        else if (!shiping_country) return res.send({ message: " Shipping Country cannot be empty!.", error: true })
        else {

            const sql = `UPDATE exfi.customers SET name = "${customer_name}", display_name = "${display_name}",
     mobile = "${mobile}", username = "${username}",
     gstin_number = "${gstin}",tin_number = "${tin}", pan_number = "${pan}",
     vat_number = "${vatno}",shipping_contact_name = "${contact_name_ship}", billing_pincode = "${billing_pincode}",
     billing_address = "${address}", billing_state = "${billing_state}", billing_country = "${billing_country}", billing_city = "${billing_city}",
      dl_number = "${dlno}",shiping_pincode = "${shiping_pincode}", shiping_city = "${shiping_city}",
     shiping_state = "${shiping_state}",shiping_country = "${shiping_country}", shiping_address = "${shiping_address}",
     shiping_email = "${shiping_username}",shiping_mobile = "${shiping_mobile}", shipping_display_name = "${display_name_ship}"
      WHERE id = "${id}" `

            await pool.execute(sql, (err, result) => {
                if (!result || err) {
                    console.log("error when updateing customer", err)
                }
                else {
                    res.status(200).send({ message: "customer successfully updated", error: false, success: true })
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

const delete_customer = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.customers WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting customer", id) }
            else {
                res.status(200).send({ data: result, message: "Customer deleted successfully", error: false, success: true })
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


const delete_multiple_contacts = async (req, res) => {
    try {

        const customerItem = req.body.data?.customerItem.join()
        const supplierItem = req.body.data?.supplierItem.join()

        if (customerItem && supplierItem) {

            const sql = `DELETE FROM exfi.customers WHERE id IN (${customerItem}) `

            await pool.execute(sql, (err, result) => {
                if (!result || err) { console.log("err when deleting customers", err) }
            })

            const query = `DELETE FROM exfi.suppliers WHERE id IN (${supplierItem}) `

            await pool.execute(query, (err, result) => {
                if (!result || err) { console.log("err when deleting suppliers", err) }
                else {
                    res.status(200).send({ data: result, message: " deleted successfully", error: false, success: true })
                }
            })
        }
        else if (customerItem && !supplierItem) {

            const sql = `DELETE FROM exfi.customers WHERE id IN (${customerItem}) `
            await pool.execute(sql, (err, result) => {
                if (!result || err) { console.log("err when deleting customers", err) }
                else {
                    res.status(200).send({ data: result, message: " deleted successfully", error: false, success: true })
                }
            })
        }
        else {

            const sql = `DELETE FROM exfi.suppliers WHERE id IN (${supplierItem}) `
            await pool.execute(sql, (err, result) => {
                if (!result || err) { console.log("err when deleting supplier", err) }
                else {
                    res.status(200).send({ data: result, message: " deleted successfully", error: false, success: true })
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

//------------------------------------------------------------------------all Contacts--------------------------------------------

const get_all = async (req, res) => {

    try {
        const { limit, skip, companyid } = req.headers

        const sql = `SELECT  id, name, display_name, username, mobile, type, created_date FROM exfi.customers WHERE company_id = "${companyid}"
        UNION ALL
        SELECT id, name, display_name, username, mobile, type, created_date FROM exfi.suppliers WHERE company_id = "${companyid}"
        ORDER BY created_date DESC LIMIT ${limit} OFFSET ${skip}; `

        const sql2 = `SELECT  id, name, display_name, username, mobile, type, created_date FROM exfi.customers WHERE company_id = "${companyid}"
        UNION ALL
        SELECT id, name, display_name, username, mobile, type, created_date FROM exfi.suppliers WHERE company_id = "${companyid}"
        ORDER BY created_date DESC; `

        const query = (!limit || !skip) ? sql2 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get all customers", err);
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


const get_count = async (req, res) => {
    const { companyid } = req.headers
    try {
        const sql = `SELECT
        'customers' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.customers WHERE company_id = "${companyid}"
    UNION ALL
    SELECT
        'suppliers' AS table_name,
        COUNT(*) AS row_count
    FROM exfi.suppliers WHERE company_id = "${companyid}";`

        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error in get user");
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

//----------------------------------------------------------------------------------------------------------------------------------


module.exports = {
    get_customers, insert_customer, get_all, get_count, delete_customer, edit_customer, insert_address, delete_multiple_contacts
}