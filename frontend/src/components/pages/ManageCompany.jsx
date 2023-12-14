import { useState, useEffect } from "react";
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { addCompany_url, editComp_url, getComp_url } from "../assets/apis";
import { Select } from "antd";
import { state } from '../assets/StateList'
import { countryList } from '../assets/countryList'


const ManageCompany = () => {
    const navigate = useNavigate()
    const [company, setCompany] = useState({})
    const [showComponent, setShowComponent] = useState(false);
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')
    const [toggle, setToggle] = useState(false)
    const [dropdown, setDropdown] = useState({})
    const [file, setFile] = useState({})
    const [check, setCheck] = useState({})

    const token = window.sessionStorage.getItem('token')
    const userid = window.sessionStorage.getItem('userid')
    const id = window.sessionStorage.getItem('companyid')

    const closeScreen = () => {
        window.sessionStorage.removeItem("company")
        window.sessionStorage.removeItem('customer')
        window.sessionStorage.removeItem('supplier')
        navigate("/dashboard")
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);


    useEffect(() => {
        if (id && token) { getCompany() }
    }, [id]);

    const d = new Date();
    let year = Number(d.getFullYear());

    const options = [
        {
            label: `1 Apr ${year} to 31 Mar ${year + 1}`,
            value: year,
        },
        {
            label: `1 Apr ${year + 1} to 31 Mar ${year + 2}`,
            value: year + 1,
        },
        {
            label: `1 Apr ${year + 2} to 31 Mar ${year + 3}`,
            value: year + 2,
        },
        {
            label: `1 Apr ${year + 3} to 31 Mar ${year + 4}`,
            value: year + 3,
        },
        {
            label: `1 Apr ${year + 4} to 31 Mar ${year + 5}`,
            value: year + 4,
        },
        {
            label: `1 Apr ${year + 5} to 31 Mar ${year + 6}`,
            value: year + 5,
        },
        {
            label: `1 Apr ${year + 6} to 31 Mar ${year + 7}`,
            value: year + 6,
        },
        {
            label: `1 Apr ${year + 7} to 31 Mar ${year + 8}`,
            value: year + 7,
        },
        {
            label: `1 Apr ${year + 8} to 31 Mar ${year + 9}`,
            value: year + 8,
        },
        {
            label: `1 Apr ${year + 9} to 31 Mar ${year + 10}`,
            value: year + 9,
        },
        {
            label: `1 Apr ${year + 10} to 31 Mar ${year + 11}`,
            value: year + 11,
        },
    ];

    const addCompany = async () => {

        console.log("add company")

        let url = `${addCompany_url}`
        let is_bank_detail = check.is_bank_detail ? 1 : 0
        let is_common_seal = check.is_common_seal ? 1 : 0
        let is_logo_print = check.is_logo_print ? 1 : 0
        let is_sigature = check.is_sigature ? 1 : 0

        const finaldata = JSON.stringify({ ...company, ...dropdown, is_bank_detail, is_common_seal, is_logo_print, is_sigature, ...file, userid })
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
            if (response?.data?.company_id) {
                window.sessionStorage.setItem("companyid", response.data.company_id)
            }
            window.scrollTo(0, 0);
            manageAlert(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getCompany = async () => {

        // console.log("get company")

        let url = `${getComp_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    id,
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                }
            })
            if (response.data.success) {
                const { additional_detail, address, bussiness_type, cin_no, city, color, common_seal, company_name, country, dl_no
                    , e_commerce_gst, email, finacial_year, gst, is_bank_detail_print, is_common_seal, is_logo, is_sign, logo, pan, phone,
                    pin, purchase_inv_prefix, quotation_prefix, running_out_limit, sales_inv_prefix, service_tax, sign, state, tin, upi, website } = response.data.data[0]

                setCompany({
                    ecommerce_gst: e_commerce_gst, typeofbussiness: bussiness_type, serv_tax_no: service_tax, dl_number: dl_no,
                    sales_invoice_prefix: sales_inv_prefix, additional_detail, address, cin_no, city, common_seal, company_name, country, dl_no, email,
                    finacial_year, gst, logo, pan, phone, pin, purchase_inv_prefix, quotation_prefix,
                    running_out_limit, sign, state, tin, upi, website
                })
                let finYear = Number(finacial_year)
                setDropdown({ state, country, finacial_year: finYear })
                setCheck({ is_logo_print: is_logo, is_common_seal, is_bank_detail: is_bank_detail_print, is_sigature: is_sign })
            } else {
                console.log("err when getting company")
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("something went wrong")
        }
    };


    const updateCompany = async () => {

        // console.log("Update company")

        let url = `${editComp_url}`
        const finaldata = JSON.stringify({ ...company })
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
        if (id) {
            updateCompany()
        } else {
            addCompany()
        }
    }

    const handleChange = (props, filename, image) => {
        if (filename) {
            // console.log("image", image.target.value)
            const img = URL.createObjectURL(props)
            setFile({ ...file, [filename]: img })
            setCompany({ ...company, [filename]: img })
        } else {
            setCompany({ ...company, [props.target.name]: props.target.value })
        }
    }

    const handleChangeCheckBox = (isChecked, name) => {
        setCheck({ ...check, [name]: isChecked });
    }

    const handleDropdown = (value, name) => {
        if (value?.length > 1) {
            const newVal = value.length - 1
            setDropdown({ ...dropdown, [name]: value[newVal] })
        } else {
            setDropdown({ ...dropdown, [name]: value[0] })
        }
    }
    // console.log("checkbox", check)
    console.log("company", company)

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
                                                <h3 className="ukhd mb-3">{(id) ? "Edit Company" : "Add Company"}</h3>
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
                                                                            <label> Company Name </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="Company Name"
                                                                                name="company_name"
                                                                                value={company.company_name}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> Email Address </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="Email Address"
                                                                                name="email"
                                                                                value={company.email}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Website </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="Website"
                                                                                readOnly=""
                                                                                defaultValue=""
                                                                                name="website"
                                                                                value={company.website}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Phone</label>
                                                                            <div className="input-group mb-3">
                                                                                <div className="input-group-append">
                                                                                    <span className="input-group-text mdi mdi-phone h-100">
                                                                                    </span>
                                                                                </div>
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control h-100"
                                                                                    placeholder="Phone"
                                                                                    name="phone"
                                                                                    value={company.phone}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <div className="form-group">
                                                                            <label> Address </label>
                                                                            <textarea
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="Address"
                                                                                name="address"
                                                                                value={company.address}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="select-container ">
                                                                            <label className="col-12 margin-bottom-dropdown" > Country
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 height-dropdown"
                                                                                placeholder="Select Country"
                                                                                onChange={(value) => { handleDropdown(value, "country") }}
                                                                                value={dropdown.country}
                                                                            >
                                                                                {countryList.map((item) => (
                                                                                    <Select.Option value={item}>{item}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="select-container ">
                                                                            <label className="col-12 margin-bottom-dropdown" > State
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 height-dropdown"
                                                                                placeholder="Select State"
                                                                                onChange={(value) => { handleDropdown(value, "state") }}
                                                                                value={dropdown.state}
                                                                            >
                                                                                {state.map((item) => (
                                                                                    <Select.Option value={item}>{item}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> City </label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control h-100"
                                                                                    placeholder="City"
                                                                                    name="city"
                                                                                    value={company.city}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> PIN </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="PIN"
                                                                                value={company.pin}
                                                                                name="pin"
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> Logo </label>
                                                                            <input
                                                                                type="file"
                                                                                className="form-control h-100 "
                                                                                name="logo"
                                                                                onChange={(e) => handleChange(e.target.files[0], "logo", e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <img src={company.logo || "https://app.exfi.in/media/media/logos/default.jpg"} style={{ width: "60%" }} className="img-thumbnail img-fluid" />

                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox margin-between"
                                                                            name="is_logo_print"
                                                                            checked={check.is_logo_print}
                                                                            onChange={(e) => handleChangeCheckBox(e.target.checked, "is_logo_print")}
                                                                        />
                                                                        <label className="mb-2"> Is Printed on Invoice </label>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> Invoice Color</label>
                                                                            <div className="input-group">
                                                                                <input type="color"
                                                                                    class="form-control h-100 form-control-color" id="exampleColorInput"
                                                                                    name="color"
                                                                                    value={company.color}
                                                                                    onChange={(e) => handleChange(e)} title="Choose your color"
                                                                                />

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>UPI Id</label>
                                                                            <input
                                                                                className="form-control h-100"
                                                                                name="upi"
                                                                                placeholder="Enter UPI id"
                                                                                value={company.upi}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Sign</label>
                                                                            <input
                                                                                type="file"
                                                                                className="form-control h-100"
                                                                                name="sign"
                                                                                onChange={(e) => handleChange(e.target.files[0], "sign", e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">

                                                                            <img src={company.sign || "https://app.exfi.in/media/media/signatures/sign.png"} style={{ width: "60%" }} class="img-thumbnail img-fluid" />
                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox margin-between"
                                                                            name="is_sigature"
                                                                            checked={check.is_sigature}
                                                                            onChange={(e) => handleChangeCheckBox(e.target.checked, "is_sigature")}
                                                                        />
                                                                        <label>Is Signature Printed on Invoice</label>
                                                                    </div>

                                                                    <div className="col-12  margin-vertical">
                                                                        <div className="border"></div>
                                                                    </div>

                                                                    <div className="col-12  margin-vertical">
                                                                        <div className="form-group m-0 p-0">
                                                                            <label>Company Information</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> TIN </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="TIN"
                                                                                name="tin"
                                                                                value={company.tin}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> GSTIN </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="GSTIN"
                                                                                name="gst"
                                                                                value={company.gst}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Service Tax No.</label>
                                                                            <div className="input-group mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control h-100"
                                                                                    placeholder="Service Tax No."
                                                                                    name="serv_tax_no"
                                                                                    value={company.serv_tax_no}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>PAN</label>
                                                                            <div className="input-group mb-3">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control h-100"
                                                                                    placeholder="PAN"
                                                                                    name="pan"
                                                                                    value={company.pan}
                                                                                    onChange={(e) => handleChange(e)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>D.L.No. </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                placeholder="D.L.No."
                                                                                readOnly=""
                                                                                defaultValue=""
                                                                                name="dl_number"
                                                                                value={company.dl_number}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>CIN No.</label>
                                                                            <input
                                                                                className="form-control h-100"
                                                                                name="cin_no"
                                                                                placeholder="CIN No."
                                                                                defaultValue={""}
                                                                                value={company.cin_no}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Additional Detail</label>
                                                                            <textarea
                                                                                className="form-control h-100"
                                                                                name="additional_detail"
                                                                                placeholder="Additional Details"
                                                                                defaultValue={""}
                                                                                value={company.additional_detail}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Running Out Limit</label>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control h-100"
                                                                                name="running_out_limit"
                                                                                placeholder="Running Out Limit"
                                                                                defaultValue={""}
                                                                                value={company.running_out_limit}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Purchase Invoice Prefix</label>
                                                                            <input
                                                                                className="form-control h-100"
                                                                                name="purchase_inv_prefix"
                                                                                placeholder="Purchase Invoice Prefix"
                                                                                defaultValue={""}
                                                                                value={company.purchase_inv_prefix}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Sales Invoice Prefix</label>
                                                                            <input
                                                                                className="form-control h-100"
                                                                                name="sales_invoice_prefix"
                                                                                placeholder="Sales Invoice Prefix"
                                                                                value={company.sales_invoice_prefix}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Quotation Prefix</label>
                                                                            <input
                                                                                className="form-control h-100"
                                                                                name="quotation_prefix"
                                                                                placeholder="Quotation Prefix"
                                                                                defaultValue={""}
                                                                                value={company.quotation_prefix}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Type of Bussiness</label>
                                                                            <input
                                                                                className="form-control h-100"
                                                                                name="typeofbussiness"
                                                                                placeholder="Type of Bussiness"
                                                                                defaultValue={""}
                                                                                value={company.typeofbussiness}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>Common Seal</label>
                                                                            <input
                                                                                type="file"
                                                                                className="form-control h-100"
                                                                                name="common_seal"
                                                                                placeholder="Common Seal"
                                                                                onChange={(e) => handleChange(e.target.files[0], "common_seal", e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <img src={company.common_seal || "https://app.exfi.in/media/media/signatures/seal.png"} style={{ width: "80%" }} alt="No Image Available" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-3">
                                                                        <div className="form-group mt-4">

                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox margin-between"
                                                                                name="is_common_seal"
                                                                                checked={check.is_common_seal}
                                                                                onChange={(e) => handleChangeCheckBox(e.target.checked, "is_common_seal")}
                                                                            />
                                                                            <label>Is Common Seal Printed on Invoice</label>

                                                                        </div>
                                                                    </div>

                                                                    <div className="col-12  margin-vertical">
                                                                        <div className="border"></div>
                                                                    </div>

                                                                    <div className="col-12  margin-vertical">
                                                                        <div className="form-group m-0 p-0">
                                                                            <label>AGGREGATE TURNOVER</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="select-container ">
                                                                            <label className="col-12 margin-bottom-dropdown" > Financial Year
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 height-dropdown"
                                                                                placeholder="Select Financial Year"
                                                                                onChange={(value) => { handleDropdown(value, "financial_year") }}
                                                                                defaultValue={(!dropdown.finacial_year) ? "Choose Financial Year" : `1 Apr ${dropdown.finacial_year} to 31 Mar ${dropdown.finacial_year + 1}`}
                                                                                value={dropdown.financial_year}
                                                                            >
                                                                                {options.map((item) => (
                                                                                    <Select.Option value={item.value}>{item.label}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label>E Commerce GST</label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control h-100"
                                                                                name="ecommerce_gst"
                                                                                placeholder="E Commerce GST"
                                                                                defaultValue={""}
                                                                                value={company.ecommerce_gst}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="checkbox margin-between"
                                                                                name="is_bank_detail"
                                                                                checked={check.is_bank_detail}
                                                                                onChange={(e) => handleChangeCheckBox(e.target.checked, "is_bank_detail")}
                                                                            />
                                                                            <label>Bank Details</label><br />
                                                                            (Will be Printed on Normal Invoice)
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                            <button type="submit" className="btn btn-warning me-2" onClick={manageSubmit} >
                                                                {(id) ? "Update" : "Submit"}
                                                            </button>
                                                            <button className="btn btn btn-secondary" onClick={closeScreen} >Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </Sidebar >
                    </div >
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default ManageCompany