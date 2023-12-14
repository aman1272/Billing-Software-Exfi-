const pool = require('./db')
const Password = require("node-php-password");
const jwt = require('jsonwebtoken');

const get_user = async (req, res) => {
    try {
        const userId = req.body.data
        const sql = `SELECT email, name FROM user_details WHERE id = "${userId}"`
        await pool.execute(sql, (err, result) => {
            if (!result || err) {
                console.log("error in get user", err);
                //  res.status(200).send({ err, error: true, message: "Something went wrong" })
            }
            else {
                res.status(200).send(result)
            }
        })
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

const insert_user = async (req, res) => {

    try {
        const reqData = JSON.parse(req.body.data)

        if (!reqData.email) return res.send({ message: " Username cannot be empty!", error: true })
        else if (!reqData.password) return res.send({ message: " Password cannot be empty!.", error: true })
        else if (!reqData.mobile) return res.send({ message: " mobile number cannot be empty!.", error: true })
        else {
            const { email, name, mobile } = reqData
            const password = Password.hash(reqData.password);
            const date = Math.floor(new Date / 1000)

            const query = `INSERT INTO exfi.user_details(name, username, password, number, created_date) VALUES ("${name}", "${email}", "${password}", "${mobile}", "${date}");`

            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in inserting data', err)
                }
                else {
                    res.status(200).send({ message: "Signup successfully", success: true })
                }
            })
        }
    } catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}
const sign_in = async (req, res) => {
    try {
        if (!req.body) return res.send({ message: " username cannot be empty!", error: true })
        else if (!req.body.email) return res.send({ message: " Username cannot be empty!", error: true })
        else if (!req.body.password) return res.send({ message: " Password cannot be empty!.", error: true })
        else {
            const sql = `SELECT * FROM exfi.user_details WHERE username = "${req.body.email}"`
            await pool.execute(sql, (err, result) => {
                if (!result || err) { res.status(200).send({ message: "User not Found", error: true, }) }
                const isUser = result[0]?.username == req.body.email

                if (isUser) {
                    const hash = result[0].password

                    if (Password.verify(req.body.password, hash)) {
                        const { name, username, id, company_id } = result[0]
                        const token = jwt.sign({
                            expiresIn: 86400,
                            data: username
                        }, '1291999aman');
                        res.status(200).send({ message: "Sign in Successfully", error: false, user: { name, username, id, company_id, token }, success: true })
                    } else {
                        res.status(200).send({ message: "Your password is incorrect", error: true })
                    }
                } else {
                    res.status(200).send({ message: "User not Found", error: true, })
                }

            })
        }

    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
};

const update_profile = async (req, res) => {

    try {
        if (!reqData.email) return res.send({ message: " Email not found", error: true })
        else if (!reqData) return res.send({ message: " empty fields not acceptable" })
        else {
            const { userId, email, name, editprofile, status, mobile_num } = reqData

            const sql = `UPDATE admin_users SET name = "${name}", email = "${email}" WHERE userId = ${userId} ;`
            const sql2 = `UPDATE admin_users SET name = "${name}", email = "${email}", status = "${status}",
        mobile_num = "${mobile_num}" WHERE userId = ${userId} ;`

            const query = editprofile ? sql2 : sql
            await pool.execute(query, (err, result) => {
                if (!result || err) {
                    console.log('Error in update profile')
                    res.status(200).send({ err, error: true, message: "Something went wrong" })
                }
                else {
                    console.log("result", result)
                    res.status(200).send({ message: " Profile  updated successfully", error: false, success: true, })
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

const update_password = async (req, res) => {

    try {
        const reqData = JSON.parse(req.body.data)
        if (!reqData.email) return res.send({ message: "username cannot be empty !", error: true })
        else if (!reqData.password) return res.send({ message: " password cannot be empy !", error: true })
        else {
            const { email, password } = reqData

            const newPassword = Password.hash(password);
            const sql = `UPDATE exfi.user_details SET password = "${newPassword}" WHERE username = "${email}" ;`
            await pool.execute(sql, (err, result) => {
                if (result?.affectedRows) {
                    res.status(200).send({ message: "password updated successfully", error: false, success: true })
                }
                else { res.status(200).send({ err, error: true, message: "username not found !" }) }
            })
        }
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}


module.exports = {
    insert_user, sign_in, get_user,
    update_profile, update_password,
}
