import { useState, useEffect } from "react";
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { addCustomerUrl, addSupplierUrl, getCustomers, getSuppliers, updateCustomerUrl, updateSupplierUrl } from "../assets/apis";


const ManageContact = () => {
    const navigate = useNavigate()
    const [contact, setContact] = useState({})
    const [showComponent, setShowComponent] = useState(false);
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')
    const [toggle, setToggle] = useState(false)

    const token = window.sessionStorage.getItem('token')
    const customerId = window.sessionStorage.getItem('customer')
    const supplierId = window.sessionStorage.getItem('supplier')
    const companyid = window.sessionStorage.getItem('companyid')
    const isCustomer = window.sessionStorage.getItem('iscustomer')


    const closeScreen = () => {
        window.sessionStorage.removeItem("contact")
        window.sessionStorage.removeItem('customer')
        window.sessionStorage.removeItem('supplier')
        window.sessionStorage.removeItem('iscustomer')
        navigate("/contacts")
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);


    useEffect(() => {
        const id = customerId ? customerId : supplierId
        if (id && token) { getContacts({ id }) }
    }, [customerId, supplierId]);


    const addContact = async () => {
        let url = isCustomer ? `${addCustomerUrl}` : `${addSupplierUrl}`

        const finaldata = JSON.stringify({ ...contact, companyid })
        try {
            const response = await axios({
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                data: { data: finaldata }
            })
            window.scrollTo(0, 0);
            manageAlert(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getContacts = async ({ id }) => {
        let url = customerId ? `${getCustomers}` : `${getSuppliers}`
        console.log("url", url, id)
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    id,
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response.data.success) {
                const { name, display_name, mobile,
                    username, gstin_number, tin_number, pan_number, vat_number, shipping_contact_name, billing_pincode,
                    billing_city, billing_country, billing_address, dl_number, shiping_pincode, shiping_city,
                    shiping_state, shiping_country, shiping_address, shiping_email, shiping_mobile,
                    shipping_display_name, billing_state } = response.data.data[0]
                setContact({
                    customer_name: name, display_name: display_name, mobile: mobile, username: username, gstin: gstin_number,
                    tin: tin_number, pan: pan_number, vatno: vat_number, dlno: dl_number,
                    billing_country: billing_country, billing_city: billing_city, billing_state: billing_state,
                    billing_pincode: billing_pincode, shiping_pincode: shiping_pincode,
                    shiping_city: shiping_city, shiping_state: shiping_state, shiping_country: shiping_country,
                    shiping_address: shiping_address, shiping_username: shiping_email,
                    shiping_mobile: shiping_mobile, display_name_ship: shipping_display_name,
                    contact_name_ship: shipping_contact_name, address: billing_address
                })
            } else {
                console.log("err when getting contact")
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("something went wrong")
        }
    };


    const updateContact = async () => {
        const id = customerId ? customerId : supplierId
        let url = customerId ? `${updateCustomerUrl}` : `${updateSupplierUrl}`
        const finaldata = JSON.stringify({ ...contact, companyid })
        try {
            const response = await axios({
                url: url,
                method: "PUT",
                headers: {
                    id,
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                data: { data: finaldata }
            })
            window.scrollTo(0, 0);
            if (response.data.success) {
                manageAlert(response.data)
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("something went wrong")
        }
    };

    const manageAlert = (props) => {
        console.log("manageAlert", props)
        if (props == 'close') {
            if (!err) { closeScreen() }
            setToggle(false)
        }
        else if (props.error) {
            setErr(true)
            setMessage(props?.message)
            setToggle(true)
        }
        else if (props.success) {
            setErr(false)
            setMessage(props.message)
            setToggle(true)
        }

    }


    const manageSubmit = () => {
        if (customerId || supplierId) {
            updateContact()
        } else {
            addContact()
        }
    }

    const handleChange = (props) => {
        setContact({ ...contact, [props.target.name]: props.target.value })
    }

    const handleChangeCheckBox = (isChecked) => {
        if (isChecked) {
            setContact({
                ...contact,
                shiping_pincode: contact.billing_pincode, shiping_city: contact.billing_city,
                shiping_state: contact.billing_state, shiping_country: contact.billing_country,
                shiping_address: contact.address, shiping_username: contact.username, shiping_mobile: contact.mobile,
                display_name_ship: contact.display_name, contact_name_ship: contact.customer_name
            })
        } else {
            setContact({
                ...contact,
                shiping_pincode: "", shiping_city: "",
                shiping_state: "", shiping_country: "",
                shiping_address: "", shiping_username: "", shiping_mobile: "",
                display_name_ship: "", contact_name_ship: ""
            })
        }
    }


    return (
        <>
            {
                showComponent ?
                    <div className="container-scroller body-components-margin" >
                        <Sidebar name={"All Contacts"}>
                            <div className="main-panel">
                                <div className="content-wrapper  ">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex justify-content-between m-1 p-1 align-items-baseline " >
                                                <h3 className="ukhd mb-3">{(customerId || isCustomer) ? "Customer" : "Supplier"}</h3>
                                                <button type="button" class="btn btn-warning btn-sm" onClick={closeScreen}  ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                                            </div>
                                            {toggle ? <div className={`alert ${err ? "alert-warning" : "alert-success"} alert-dismissible fade show`} role="alert">
                                                {message}  <button
                                                    type="button"
                                                    className="btn-close"
                                                    data-bs-dismiss="offcanvas"
                                                    aria-label="Close"
                                                    onClick={() => { manageAlert('close') }}
                                                />
                                            </div> : ""}
                                            <div className="row flex-grow">
                                                <div className="col-12 grid-margin stretch-card">
                                                    <div className="card card-rounded">
                                                        <div className="card-body">
                                                            <form className="forms-sample" onKeyPress={(event) => (event.key === 'Enter') ? manageSubmit() : ''} >
                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> {(customerId || isCustomer) ? "Customer" : "Supplier"} Name </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Customer Name"
                                                                                name="customer_name"
                                                                                value={contact.customer_name}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> Display Name </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Display Name"
                                                                                name="display_name"
                                                                                value={contact.display_name}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Phone</label>
                                                                            <div className="input-group mb-3">
                                                                                <div className="input-group-append">
                                                                                    <span className="input-group-text mdi mdi-phone">
                                                                                    </span>
                                                                                </div>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control"
                                                                                    placeholder="Phone"
                                                                                    name="mobile"
                                                                                    value={contact.mobile}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {(contact?.mobile?.length > 0 && contact?.mobile.length !== 10) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                                                            Mobile number length shouldbe 10 digit
                                                                        </div> : ""}
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> Email </label>
                                                                            <input
                                                                                type="email"
                                                                                className="form-control"
                                                                                placeholder="Email"
                                                                                name="username"
                                                                                value={contact.username}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> GSTIN </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="GSTIN"
                                                                                name="gstin"
                                                                                value={contact.gstin}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> TIN </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="TIN"
                                                                                name="tin"
                                                                                value={contact.tin}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> PAN </label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="PAN"
                                                                                    name="pan"
                                                                                    value={contact.pan}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> VAT NO </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="VAT NO"
                                                                                value={contact.vatno}
                                                                                name="vatno"
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> D.L.No. </label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="D.L.No."
                                                                                    name="dlno"
                                                                                    value={contact.dlno}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <div className="form-group">
                                                                            <label>Billing Address</label>
                                                                            <textarea
                                                                                className="form-control"
                                                                                name="address"
                                                                                placeholder="Enter Address"
                                                                                rows={1}
                                                                                defaultValue={""}
                                                                                value={contact.address}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Billing Country</label>
                                                                            <input
                                                                                className="form-control"
                                                                                name="billing_country"
                                                                                placeholder="Billing Country"
                                                                                defaultValue={""}
                                                                                value={contact.billing_country}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Billing State</label>
                                                                            <input
                                                                                className="form-control"
                                                                                name="billing_state"
                                                                                placeholder="Billing State"
                                                                                defaultValue={""}
                                                                                value={contact.billing_state}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Billing City</label>
                                                                            <input
                                                                                className="form-control"
                                                                                name="billing_city"
                                                                                placeholder="Billing City"
                                                                                defaultValue={""}
                                                                                value={contact.billing_city}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Billing PIN Code</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                name="billing_pincode"
                                                                                placeholder="Billing PIN Code"
                                                                                defaultValue={""}
                                                                                value={contact.billing_pincode}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {(customerId || isCustomer) ? <>

                                                                        <div className="col-12  margin-vertical">
                                                                            <div className="border"></div>
                                                                        </div>

                                                                        <div className="col-12  margin-vertical">
                                                                            <div className="form-group m-0 p-0">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked) })}
                                                                                />
                                                                                <label>IS SHIPPING & BILLING DETAILS ARE SAME</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label> Contact Name </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Shiping Name"
                                                                                    name="contact_name_ship"
                                                                                    value={contact.contact_name_ship}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label> Display Name </label>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control"
                                                                                    placeholder="Display Name"
                                                                                    name="display_name_ship"
                                                                                    value={contact.display_name_ship}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label>Shiping Phone</label>
                                                                                <div className="input-group mb-3">
                                                                                    <div className="input-group-append">
                                                                                        <span className="input-group-text mdi mdi-phone">
                                                                                        </span>
                                                                                    </div>
                                                                                    <input
                                                                                        type="number"
                                                                                        className="form-control"
                                                                                        placeholder="Phone"
                                                                                        name="shiping_mobile"
                                                                                        value={contact.shiping_mobile}
                                                                                        onChange={(e) => handleChange(e)}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            {(contact?.shiping_mobile?.length > 0 && contact?.shiping_mobile.length !== 10) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                                                            Mobile number length shouldbe 10 digit
                                                                        </div> : ""}
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label>Shiping Email </label>
                                                                                <input
                                                                                    type="email"
                                                                                    className="form-control"
                                                                                    placeholder="Email"
                                                                                    readOnly=""
                                                                                    defaultValue=""
                                                                                    name="shiping_username"
                                                                                    value={contact.shiping_username}
                                                                                    onChange={(e) => handleChange(e)}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <div className="form-group">
                                                                                <label>Shiping Address</label>
                                                                                <textarea
                                                                                    className="form-control"
                                                                                    name="shiping_address"
                                                                                    placeholder="Address"
                                                                                    rows={1}
                                                                                    defaultValue={""}
                                                                                    value={contact.shiping_address}
                                                                                    onChange={(e) => handleChange(e)}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label>Shiping Country</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="shiping_country"
                                                                                    placeholder="Shiping Country"
                                                                                    defaultValue={""}
                                                                                    value={contact.shiping_country}
                                                                                    onChange={(e) => handleChange(e)}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label>Shiping State</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="shiping_state"
                                                                                    placeholder="Shiping State"
                                                                                    defaultValue={""}
                                                                                    value={contact.shiping_state}
                                                                                    onChange={(e) => handleChange(e)}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label>Billing City</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="shiping_city"
                                                                                    placeholder="Billing City"
                                                                                    defaultValue={""}
                                                                                    value={contact.shiping_city}
                                                                                    onChange={(e) => handleChange(e)}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="form-group">
                                                                                <label>Shiping PIN Code</label>
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="shiping_pincode"
                                                                                    placeholder="PIN"
                                                                                    defaultValue={""}
                                                                                    value={contact.shiping_pincode}
                                                                                    onChange={(e) => handleChange(e)}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                        : ""
                                                                    }
                                                                </div>
                                                            </form>
                                                            <button type="submit" className="btn btn-warning me-2" onClick={manageSubmit} >
                                                                {(customerId || supplierId) ? "Update" : "Submit"}
                                                            </button>
                                                            <button className="btn btn btn-secondary" onClick={closeScreen} >Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Sidebar>
                    </div>
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default ManageContact