const pool = require('./db')
const publicIp = require('ip');


const get_company = async (req, res) => {

    const { id, fy } = req.headers
    try {
        const sql = `SELECT * FROM exfi.company `

        const sql2 = `SELECT * FROM exfi.company WHERE id = "${id}" `

        const sql3 = `SELECT finacial_year FROM exfi.company WHERE id = "${id}";`

        const query = id ? sql2 : (!fy) ? sql3 : sql

        await pool.execute(query, (err, result) => {
            if (!result || err) {
                console.log("error in get company", err);
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

const insert_company = async (req, res) => {

    try {
        const reqData = JSON.parse(req.body.data)
        const { userid, company_name, email, website, phone, city, pin, color, upi, tin,
            gst, serv_tax_no, pan, dl_number, cin_no, running_out_limit, logo, sign, common_seal, is_logo_print,
            purchase_inv_prefix, sales_invoice_prefix, quotation_prefix, typeofbussiness, ecommerce_gst,
            address, additional_detail, country, state, financial_year, is_sigature, is_bank_detail, is_common_seal } = reqData

        console.log("Add Company", reqData)

        if (!company_name) return res.send({ message: " company Name cannot be empty!", error: true })
        else if (!email) return res.send({ message: " Email cannot be empty!", error: true })
        else if (!financial_year) return res.send({ message: " Please Select Financial Year!", error: true })
        else if (!address) return res.send({ message: " Address cannot be empty!.", error: true })
        else if (!country) return res.send({ message: " Country cannot be empty!", error: true })
        else if (!state) return res.send({ message: " State cannot be empty!", error: true })
        else if (!city) return res.send({ message: " City cannot be empty!.", error: true })
        else {

            const date = Math.floor(new Date / 1000)
            const currentIp = publicIp.address()


            const query = `INSERT INTO exfi.company(company_name, email, website, phone, city,
                pin, color, upi, tin, gst, service_tax, pan, dl_no, cin_no, running_out_limit,
                  logo, sign, common_seal, purchase_inv_prefix, sales_inv_prefix, quotation_prefix,
                   bussiness_type, e_commerce_gst, address, additional_detail, country, state, is_logo, 
                   finacial_year, is_sign, is_bank_detail_print, is_common_seal, created_date, ip)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`


            const values = [company_name, email, website, phone, city, pin, color, upi, tin, gst, serv_tax_no, pan, dl_number,
                cin_no, running_out_limit, "logo.png", "sign.png", "commonseal.png", purchase_inv_prefix,
                sales_invoice_prefix, quotation_prefix, typeofbussiness, ecommerce_gst, address, additional_detail,
                country, state, is_logo_print, financial_year, is_sigature, is_bank_detail, is_common_seal, date, currentIp]

            console.log("values", values)

            await pool.execute(query, values, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    let id = result.insertId

                    const query = `UPDATE exfi.user_details SET company_id = "${id}" WHERE id = "${userid}"`

                    pool.execute(query, (err, result) => {
                        if (err) {
                            console.error('Error inserting data of in user Details:', err);
                        }
                    });
                    console.log("success data saved in company")
                    res.status(200).send({ message: "Congratulation Company added successfully", id, companyid: id, success: true })
                }
            })
        }
    } catch {
        (err) => {
            console.log("Error  inserting Company Data")
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}



const edit_company = async (req, res) => {
    console.log("edit-company")
    try {
        const { id, fy } = req.headers
        const reqData = JSON.parse(req.body.data)

        const { userid, company_name, email, website, phone, city, pin, color, upi, tin,
            gst, serv_tax_no, pan, dl_number, cin_no, running_out_limit, logo, sign, common_seal,
            purchase_inv_prefix, sales_invoice_prefix, quotation_prefix, typeofbussiness, ecommerce_gst,
            address, additional_detail, country, state, financial_year, is_sigature, is_bank_detail, is_common_seal } = reqData

        if (fy && id > 0) {
            if (!reqData) {
                return res.send({ message: " Financial year cannot be empty!", error: true })
            } else {
                const sql = `UPDATE exfi.company SET finacial_year = "${reqData}" WHERE id = "${id}" `
                await pool.execute(sql, (err, result) => {
                    if (!result || err) {
                        console.log("error when updateing company fy", err)
                    }
                    else {
                        console.log("fy updated")
                        res.status(200).send({ message: "Finance Year successfully updated", error: false, success: true })
                    }
                })
            }
        }
        else if (!company_name) return res.send({ message: " company Name cannot be empty!", error: true })
        else if (!email) return res.send({ message: " Email cannot be empty!", error: true })
        else if (!address) return res.send({ message: " Address cannot be empty!.", error: true })
        else if (!country) return res.send({ message: " Country cannot be empty!", error: true })
        else if (!state) return res.send({ message: " State cannot be empty!", error: true })
        else if (!city) return res.send({ message: " City cannot be empty!.", error: true })
        else {

            const sql = `UPDATE exfi.company SET name = "${company_name}", display_name = "${display_name}",
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
                    console.log("error when updating company", err)
                }
                else {
                    console.log("company updated")
                    res.status(200).send({ message: "company successfully updated", error: false, success: true })
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

const delete_company = async (req, res) => {
    try {
        const { id } = req.headers
        const sql = `DELETE FROM exfi.company WHERE id = "${id}" `
        await pool.execute(sql, (err, result) => {
            if (!result || err) { console.log("err when deleting company", id) }
            else {
                res.status(200).send({ data: result, message: "company deleted successfully", error: false, success: true })
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
    get_company, insert_company, delete_company, edit_company
}