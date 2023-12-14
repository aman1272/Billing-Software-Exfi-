import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import { Select } from "antd";
import { countryList } from "../assets/countryList";
import { Editor } from '@tinymce/tinymce-react';
import { unitOfMeasurement } from '../assets/UnitOfmeasure'
import { addBrandUrl, addCategoryUrl, addCustomerUrl, addCustomer_ship_address_Url, addHsn_url, addProd_url, addSac_url, addServ_url, addTax_url, add_bank_url, getBrands_url, getCategories_url, getHsnUrl, getSacUrl, getTaxUrl } from "../assets/apis";


const Modal = ({ activeModal, toggle, closeModal, customerId }) => {
    const [tableItem, setTableItem] = useState({})
    const [description, setDescription] = useState({})
    const [category, setCategory] = useState([])
    const [brand, setBrand] = useState([])
    const [tax, setTax] = useState([])
    const [hsn, setHsn] = useState([])
    const [sac, setSac] = useState([])
    const [dropdown, setDropdown] = useState({ uom: "Piece" })

    const companyid = window.sessionStorage.getItem('companyid')
    const token = window.sessionStorage.getItem('token')
    const editorRef = useRef(null);


    useEffect(() => {
        if (token) {
            getCategories()
            getBrands()
            getTaxes()
            getHsn()
            getSac()
        }

    }, []);

    const getCategories = async () => {
        let url = `${getCategories_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response?.data?.success) {

                setCategory(response?.data?.data)
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getBrands = async () => {
        let url = `${getBrands_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response?.data?.success) {

                setBrand(response?.data?.data)
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };

    const getTaxes = async () => {
        let url = `${getTaxUrl}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response?.data?.success) {

                setTax(response?.data?.data)
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getHsn = async () => {
        let url = `${getHsnUrl}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response?.data?.success) {

                setHsn(response?.data?.data)
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };

    const getSac = async () => {
        let url = `${getSacUrl}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response?.data?.success) {

                setSac(response?.data?.data)
            } else {
                alert("Something went wrong")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };



    const addTableItem = async () => {
        let url = (activeModal === "Customer") ? `${addCustomerUrl}` : (activeModal === "Brand") ? `${addBrandUrl}`
            : (activeModal === "Tax") ? `${addTax_url}` : (activeModal === "HSN") ? `${addHsn_url}`
                : (activeModal === "Product") ? `${addProd_url}` : (activeModal === "Service") ? `${addServ_url}`
                    : (activeModal === "Shipping Address") ? `${addCustomer_ship_address_Url}` : (activeModal === "Bank")
                        ? `${add_bank_url}` : `${addSac_url}`

        const p_price_tax_inc = tableItem.p_price_tax_inc ? 1 : 0
        const s_price_tax_inc = tableItem.s_price_tax_inc ? 1 : 0

        const finaldata = JSON.stringify({ ...tableItem, ...dropdown, customerId, name: tableItem.name, p_price_tax_inc, s_price_tax_inc, companyid })
        try {
            const response = await axios({
                url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                data: { data: finaldata }
            })
            // window.scrollTo(0, 0);
            console.log("response==>", response.data)
            if (response.data.success) {
                setTableItem({
                    name: "", tax: "", code_number: "", code: "", description: "", gst_rate: "", dlno: "", gstin: ""
                    , address: "", billing_city: "", billing_pincode: "", billing_state: "", customer_name: "", display_name: "", mobile: "", username: ""
                    , shiping_address: "", shiping_city: "", shiping_state: "", acc_number: "", branch_name: "", ifsc_code: "", name: "",
                    bank_name: "", branch_name: ""
                })
                setDropdown({ billing_country: "", shiping_country: "", })
                closeModals()

                // getCategories()
                // getBrands()
                // getTaxes()
                // getHsn()
                // getSac()
            } else {
                window.alert(response.data.message)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    }


    const closeModals = () => {
        closeModal()
    }
    const handleChangeModal = (props) => {
        setTableItem({ ...tableItem, [props.target.name]: props.target.value })
    }

    const handleDropdowns = (value, name) => {
        if (value?.length > 1) {
            const newVal = value.length - 1
            setDropdown({ ...dropdown, [name]: value[newVal] })
        } else {
            setDropdown({ ...dropdown, [name]: value[0] })
        }
    }

    const handleCheckbox = (check, name) => {
        setTableItem({ ...tableItem, [name]: check })
    }

    // console.log("tableItem", tableItem)
    // console.log("tableItem", dropdown)

    return (
        <div className={toggle ? "modal fade show d-block modal-dropdown-index " : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
            <div className="modal-dialog  modal-dialog-customize" role="document">
                <div className="modal-content">
                    <div className="modal-header pl-2 pr-0 pt-0 pb-0">
                        <h5 className="modal-title ml-2" id="exampleModalLabel">Add {activeModal}</h5>
                        <button type="button" className="close " data-dismiss="modal" aria-label="Close" onClick={() => { closeModals() }} >
                            <span style={{ fontSize: "30px" }} >&times;</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 d-flex justify-content-center" onKeyPress={(event) => (event.key === 'Enter') ? addTableItem() : ''} >


                        {/* //------------------------Customers and Shipping -------------------------------------------------- */}


                        {(activeModal === "Customer" || activeModal === "Shipping Address") && <div className="row m-1">
                            {(activeModal === "Customer") && <div className="col-3">
                                <div className="form-group">
                                    <label>  Customer Name </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Customer Name"
                                            name="customer_name"
                                            value={tableItem.customer_name}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>}
                            {(activeModal === "Customer") && <div className="col-3">
                                <div className="form-group">
                                    <label>  Display name </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Display name"
                                            name="display_name"
                                            value={tableItem.display_name}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>}
                            <div className="col-3">
                                <div className="form-group">
                                    <label>{(activeModal === "Customer") ? "Billing" : "Shipping"}  Phone No. </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Phone"
                                            name="mobile"
                                            value={tableItem.mobile}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {(activeModal === "Customer") && <div className="col-3">
                                <div className="form-group">
                                    <label>  Email </label>
                                    <div className="input-group">
                                        <input
                                            type="email"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Email"
                                            name="username"
                                            value={tableItem.username}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>}
                            {(activeModal === "Customer") && <div className="col-3">
                                <div className="form-group">
                                    <label>  GSTIN </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="GSTIN"
                                            name="gstin"
                                            value={tableItem.gstin}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>}
                            {(activeModal === "Customer") && <div className="col-3">
                                <div className="form-group">
                                    <label>  D.L.No. </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="D.L.No."
                                            name="dlno"
                                            value={tableItem.dlno}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>}
                            <div className="col-3">

                                <div className="form-group">
                                    <div className="select-container ">
                                        <label> {(activeModal === "Customer") ? "Billing" : "Shipping"} Country </label>
                                        <Select mode="multiple" className="form-dropdown col-12 "
                                            placeholder="select Country"

                                            onChange={(value) => { handleDropdowns(value, (activeModal === "Customer") ? "billing_country" : "shiping_country") }}
                                            value={(activeModal === "Customer") ? dropdown.billing_country : dropdown.shiping_country}
                                        >
                                            {countryList.map((option, i) => (
                                                <Select.Option value={option} key={i} >{option}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>{(activeModal === "Customer") ? "Billing" : "Shipping"} State </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Billing State"
                                            name={(activeModal === "Customer") ? "billing_state" : "shiping_state"}
                                            value={(activeModal === "Customer") ? tableItem.billing_state : tableItem.shiping_state}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>{(activeModal === "Customer") ? "Billing" : "Shipping"} City </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder={(activeModal === "Customer") ? "Billing City" : "Shipping City"}
                                            name={(activeModal === "Customer") ? "billing_city" : "shiping_city"}
                                            value={(activeModal === "Customer") ? tableItem.billing_city : tableItem.shiping_city}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>{(activeModal === "Customer") ? "Billing" : "Shipping"} Address </label>
                                    <div className="input-group">
                                        <textarea
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder={(activeModal === "Customer") ? "Billing Address" : "Shipping Address"}
                                            name={(activeModal === "Customer") ? "address" : "shiping_address"}
                                            value={(activeModal === "Customer") ? tableItem.address : tableItem.shiping_address}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>{(activeModal === "Customer") ? "Billing" : "Shipping"} PIN Code </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder={(activeModal === "Customer") ? "Billing Pin Code" : "Shipping Pin Code"}
                                            name={(activeModal === "Customer") ? "billing_pincode" : "shiping_pincode"}
                                            value={(activeModal === "Customer") ? tableItem.billing_pincode : tableItem.shiping_pincode}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {/* //-----------------------------------Product / Service----------------------------------------------------------------  */}

                        {(activeModal === "Product" || activeModal === "Service") && <div className="row m-1">
                            <div className="col-3">
                                <div className="form-group">
                                    <label>  {activeModal} Name </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Customer Name"
                                            name="name"
                                            value={tableItem.name}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>  {activeModal} Varient </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Customer Name"
                                            name="varient"
                                            value={tableItem.varient}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label className="col-12" > Category
                                    </label>
                                    <Select mode="multiple" className="form-dropdown col-12 "
                                        placeholder="Select Category"
                                        onChange={(value) => { handleDropdowns(value, "category") }}
                                        value={dropdown.category}
                                    >
                                        {category.map((option, i) => (
                                            <Select.Option value={option.id} key={i} >{option.name}</Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label className="col-12" > Brand
                                    </label>
                                    <Select mode="multiple" className="form-dropdown col-12 "
                                        placeholder="Select Brand"
                                        onChange={(value) => { handleDropdowns(value, "brand") }}
                                        value={dropdown.brand}
                                    >
                                        {brand.map((item) => (
                                            <Select.Option value={item.id}>{item.name}</Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label> Description </label>
                                    <Editor
                                        apiKey='xmh8jakgwhfnck35x677xd984brc0hacgqpasnzx3g3ddd12'
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        value={description}
                                        onEditorChange={(newText) => setDescription(newText)}
                                        init={{
                                            height: 200,
                                            menubar: ['insert', 'link'],
                                            toolbar: 'image',
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-3">
                                <div className="form-group">
                                    <label className="col-12" > Type
                                    </label>
                                    <Select mode="multiple" className="form-dropdown col-12 "
                                        placeholder="Select Type"
                                        onChange={(value) => { handleDropdowns(value, "type") }}
                                        value={dropdown.type}
                                    >
                                        <Select.Option value={0}  >Product</Select.Option>
                                        <Select.Option value={1}  >Service</Select.Option>
                                    </Select>
                                </div>
                            </div> */}
                            {(activeModal === "Product") ? <div className="col-3">
                                <div className="form-group">
                                    <div className="select-container ">
                                        <label> HSN Code
                                        </label>
                                        <Select
                                            mode="tags"
                                            className="form-dropdown col-12 "
                                            placeholder="Select HSN"
                                            onChange={(value) => { handleDropdowns(value, "hsn") }}
                                            value={dropdown.hsn}
                                        >
                                            {hsn.map((option, i) => (
                                                <Select.Option value={option.code} key={i}
                                                >{option.code} </Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </div>
                                : <div className="col-3">
                                    <div className="form-group">
                                        <div className="select-container ">
                                            <label> SAC Code
                                            </label>
                                            <Select
                                                mode="tags"
                                                className="form-dropdown col-12 "
                                                placeholder="Select SAC"
                                                onChange={(value) => { handleDropdowns(value, "sac") }}
                                                value={dropdown.sac}
                                            >
                                                {sac.map((option, i) => (
                                                    <Select.Option value={option.code} key={i}
                                                    >{option.code} </Select.Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="col-3">
                                <div className="form-group">
                                    <label className="col-12" > Tax
                                    </label>
                                    <Select mode="tags" className="form-dropdown col-12 "
                                        placeholder="Select Tax"
                                        onChange={(value) => { handleDropdowns(value, "tax") }}
                                        value={dropdown.tax}
                                    >
                                        {tax.map((option, i) => (
                                            <Select.Option value={option.id} key={i} >{option.name}</Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>MRP Price </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="MRP Price"
                                            name="mrp_price"
                                            value={tableItem.mrp_price}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label> S.Price(Net) </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-alternative mt-1"
                                        placeholder="S.Price"
                                        name="s_price"
                                        value={tableItem.s_price}
                                        onChange={(e) => handleChangeModal(e)}
                                    />
                                    <input
                                        type="checkbox"
                                        checked={tableItem?.s_price_tax_inc || false}
                                        onChange={((e) => { handleCheckbox(e.target.checked, "s_price_tax_inc") })}
                                    />
                                    <label className="margin-between" >Is Tax Inclusive</label>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label> P.Price </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-alternative mt-1"
                                        placeholder="P.Price"
                                        name="p_price"
                                        value={tableItem.p_price}
                                        onChange={(e) => handleChangeModal(e)}
                                    />
                                    <input
                                        type="checkbox"
                                        checked={tableItem?.p_price_tax_inc || false}
                                        onChange={((e) => { handleCheckbox(e.target.checked, "p_price_tax_inc") })}
                                    />
                                    <label className="margin-between" >Is Tax Inclusive</label>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="select-container ">
                                    <label> UoM </label>
                                    <Select mode="tags" className="form-dropdown col-12 "
                                        placeholder="Select UoM"
                                        onChange={(value) => { handleDropdowns(value, "uom") }}
                                        value={dropdown.uom}
                                    >
                                        {unitOfMeasurement.map((option, i) => (
                                            <Select.Option value={option} key={i} >{option}</Select.Option>
                                        ))}
                                    </Select>
                                    <label>UoM = Unit of Measurement</label>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="form-group">
                                    <label>Opening Quantity </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Opening Quantity"
                                            name="opening_qty"
                                            value={tableItem.opening_qty}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {/* //-----------------------------------------------Tax-------------------------------------------------------------- */}

                        {(activeModal === "Tax") && <div className="row m-1" >
                            <div className="col-6">
                                <div className="form-group">
                                    <label>  Tax Name</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Tax Name"
                                            name="name"
                                            value={tableItem.name}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>  Tax </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Tax Percentage"
                                            name="percentage"
                                            value={tableItem.percentage}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>}

                        {/* //------------------------------------------------Bank ------------------------------------------------------------------------------ */}

                        {(activeModal === "Bank") && <div className="row m-1" >
                            <div className="col-6">
                                <div className="form-group">
                                    <label>  Bank Name</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Tax Name"
                                            name="bank_name"
                                            value={tableItem.bank_name}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>  Account Number </label>
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Account Number"
                                            name="acc_number"
                                            value={tableItem.acc_number}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>  Branch Name</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="Branch Name"
                                            name="branch_name"
                                            value={tableItem.branch_name}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <label>  IFSC Code </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-alternative mt-1"
                                            placeholder="IFSC Code"
                                            name="ifsc_code"
                                            value={tableItem.ifsc_code}
                                            onChange={(e) => handleChangeModal(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>}

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-warning btn-sm margin-between" onClick={() => { addTableItem() }} >Save</button>
                        <button type="button" className="btn btn-secondary btn-sm margin-between" data-dismiss="modal" onClick={() => { closeModals() }} >Cancel</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Modal