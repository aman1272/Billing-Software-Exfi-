import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Select } from "antd";
import { unitOfMeasurement } from '../assets/UnitOfmeasure'
import { addBrandUrl, addCategoryUrl, addHsn_url, addProd_url, addSac_url, addServ_url, addTax_url, deleteProdVar_Url, deleteServ_var_Url, editProd_url, editServ_url, getBrands_url, getCategories_url, getHsnUrl, getProd_url, getSacUrl, getServ_url, getTaxUrl } from "../assets/apis";

const ManageProdAndService = () => {
    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [tableItem, setTableItem] = useState({})
    const [showComponent, setShowComponent] = useState(false);
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')
    const [toggle, setToggle] = useState(false)
    const [alert, setAlert] = useState(false)
    const [activeModal, setActiveModal] = useState("")
    const [check, setCheck] = useState(false)
    const [category, setCategory] = useState([])
    const [brand, setBrand] = useState([])
    const [tax, setTax] = useState([])
    const [hsn, setHsn] = useState([])
    const [sac, setSac] = useState([])
    const [dropdown, setDropdown] = useState({ uom: "Piece" })
    const [variations, setVariations] = useState([{ id: 0, size: '', colours: "", quantity: "", purchase_price: "", sales_price: "", }])
    const [description, setDescription] = useState({})


    const token = window.sessionStorage.getItem('token')
    const productId = window.sessionStorage.getItem('productId')
    const serviceId = window.sessionStorage.getItem('serviceId')
    const isProduct = window.sessionStorage.getItem('product')
    const companyid = window.sessionStorage.getItem('companyid')

    const id = productId ? productId : serviceId


    const editorRef = useRef(null);

    const closeScreen = () => {
        window.sessionStorage.removeItem('productId')
        window.sessionStorage.removeItem('serviceId')
        window.sessionStorage.removeItem('product')
        navigate("/products-services-category")
    }

    useEffect(() => {
            getCategories()
            getBrands()
            getTaxes()
            getHsn()
            getSac()
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);


    useEffect(() => {
        if (id && token) {
            getItems()
        }
    }, [id]);


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
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
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
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
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
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
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
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
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
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };

    const addItem = async () => {
        let url = isProduct ? `${addProd_url}` : `${addServ_url}`
        let p_price_tax_inc = item.p_price_tax_inc ? 1 : 0
        let s_price_tax_inc = item.s_price_tax_inc ? 1 : 0
        const finaldata = JSON.stringify({ variations, ...dropdown, description, ...item, p_price_tax_inc, s_price_tax_inc, companyid })
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
            window.alert("Something went wrong")
        }
    };


    const getItems = async () => {
        let url = productId ? `${getProd_url}` : `${getServ_url}`
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
                const { name, mrp_price, opening_qty,
                    varient, hsn_code, uom, category, tax, description, p_price,
                    p_price_tax_inc, s_price, s_price_tax_inc, brand, variations,
                    categoryId, taxId, brandId, sac_code } = response.data.data[0]
                setItem({
                    name, varient,
                    mrp_price, s_price, s_price_tax_inc, p_price, p_price_tax_inc, opening_qty, categoryId, taxId, brandId
                })

                setDescription(description)
                setDropdown({ category, brand, tax, hsn: hsn_code, uom, sac: sac_code })
                setVariations([...variations])

                if (variations.length) {
                    setCheck(true)
                }
            } else {
                console.log("err when getting item")
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("something went wrong")
        }
    };

    const updateItem = async () => {
        const id = productId ? productId : serviceId
        let url = productId ? `${editProd_url}` : `${editServ_url}`

        let p_price_tax_inc = item.p_price_tax_inc ? 1 : 0
        let s_price_tax_inc = item.s_price_tax_inc ? 1 : 0
        const newBrandId = typeof (dropdown.brand) === "string" ? item.brandId : dropdown.brand
        const newCatId = typeof (dropdown.category) === "string" ? item.categoryId : dropdown.category
        const newTaxId = typeof (dropdown.tax) === "string" ? item.taxId : dropdown.tax
        const finaldata = JSON.stringify({
            variations, hsn: dropdown.hsn, uom: dropdown.uom, brand: newBrandId, sac: dropdown.sac,
            tax: newTaxId, category: newCatId, description, ...item, p_price_tax_inc, s_price_tax_inc, companyid
        })

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
            window.alert("something went wrong")
        }
    };


    const addTableItem = async () => {

        let url = (activeModal === "Category") ? `${addCategoryUrl}` : (activeModal === "Brand") ? `${addBrandUrl}` : (activeModal === "Tax") ? `${addTax_url}` : (activeModal === "HSN") ? `${addHsn_url}` : `${addSac_url}`
        const finaldata = JSON.stringify({ ...tableItem, companyid })
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
            window.scrollTo(0, 0);
            console.log("response==>", response.data)
            if (response.data.success) {
                setTableItem({ name: "", tax: "", code_number: "", code: "", description: "", gst_rate: "" })
                getCategories()
                getBrands()
                getTaxes()
                getHsn()
                getSac()
            } else {
                manageAlert(response.data)
            }

            setToggle({ ...toggle, modal: false })
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    }

    const deleteVariation = async () => {
        let url = (isProduct) ? `${deleteProdVar_Url}` : `${deleteServ_var_Url}`
        try {
            const response = await axios({
                url,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: toggle.id,
                    companyid
                }
            })
            // window.scrollTo(0, 0);
            getItems()
            setToggle({ ...toggle, delete: false, id: "" })
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    }

    const manageAlert = (props) => {
        if (props == 'close') {
            if (!err) { closeScreen() }
            setAlert(false)
        }
        else if (props.error) {
            console.log("manageAlert", props)
            setErr(true)
            setMessage(props?.message)
            setAlert(true)
        }
        else if (props.success) {
            setErr(false)
            setMessage(props.message)
            setAlert(true)
        }

    }

    const openModal = (type) => {
        setActiveModal(type)
        setToggle({ ...toggle, modal: true })
    }

    const closeModal = () => {
        setToggle({ ...toggle, modal: false })
    }

    const manageSubmit = () => {
        if (id) {
            updateItem()
        } else {
            addItem()
        }
    }

    const handleChange = (props) => {
        setItem({ ...item, [props.target.name]: props.target.value })
    }

    const handleVariations = (e, index) => {
        const { name, value } = e.target
        console.log("variation", e.target.value, e.target.name, index)
        const updatedVariations = variations.map((item, i) => {
            if (i === index) {
                return { ...item, [name]: value };
            }
            return item;
        });
        setVariations(updatedVariations)
    }

    const addNewRow = (e) => {
        e.preventDefault()
        const newid = variations.length;
        const newRow = { newid, size: '', colours: "", quantity: "", purchase_price: "", sales_price: "", };
        setVariations([...variations, newRow]);
    };


    const removeRow = (id, index) => {
        if (id) {
            setToggle({ ...toggle, delete: true, id });
        } else {
            if (variations.length === 1) {
                return
            } else {
                const updatedData = variations.filter((item, i) => i !== index);
                setVariations(updatedData);
            }
        }
    };

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
        setItem({ ...item, [name]: check })
    }

    console.log("toggle alert", toggle)
    // console.log("mesage", message)
    // console.log("hsn dropdown", dropdown)
    // console.log("prod--ser", isProduct)

    return (
        <>
            {
                showComponent ?
                    <div className="container-scroller body-components-margin" >
                        <Sidebar name={"Products/Services"}>
                            <div className="main-panel">
                                <div className="content-wrapper  ">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex justify-content-between m-1 p-1 align-items-baseline " >
                                                <h3 className="ukhd mb-3">{(isProduct) ? "Product" : "Service"}</h3>
                                                <button type="button" class="btn btn-warning btn-sm" onClick={closeScreen}  ><div className="d-flex justify-content-center" ><i class="mdi mdi mdi-keyboard-backspace"></i><span>Go Back</span></div></button>
                                            </div>
                                            {alert ? <div className={`alert ${err ? "alert-warning" : "alert-success"} alert-dismissible fade show`} role="alert">
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
                                                                            <label> {(isProduct) ? "Product" : "Service"} Name </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-alternative mt-1"
                                                                                placeholder={`${(isProduct) ? "Product" : "Service"} Name `}
                                                                                name="name"
                                                                                value={item.name}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> {(isProduct) ? "Product" : "Service"} Varient </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control form-control-alternative mt-1"
                                                                                placeholder={`${(isProduct) ? "Product" : "Service"} Varient `}
                                                                                name="varient"
                                                                                value={item.varient}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label className="col-12" > Category
                                                                                    <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Category")} ></i>
                                                                                </label>
                                                                                <Select mode="multiple" className="form-dropdown col-12 "
                                                                                    // defaultActiveFirstOption="true" defaultValue={category[0].name}
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
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label className="col-12" > Brand
                                                                                    <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Brand")} ></i>
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
                                                                    </div>
                                                                    <div className="col-12 mb-4" >
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
                                                                            <div className="select-container ">
                                                                                <label > Type </label>
                                                                                <Select mode="multiple"
                                                                                    className="form-dropdown col-12 "
                                                                                    placeholder="Select Type"
                                                                                    defaultActiveFirstOption="true" defaultValue={isProduct ? "product" : "service"}
                                                                                    value={dropdown.type}
                                                                                >
                                                                                    <Select.Option value={isProduct ? "product" : "service"} >{isProduct ? "product" : "service"}</Select.Option>
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    </div> */}
                                                                    {(isProduct) ? <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label> HSN Code
                                                                                    <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("HSN")} ></i>
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
                                                                                        <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("SAC")} ></i>
                                                                                    </label>
                                                                                    <Select
                                                                                        mode="tags"
                                                                                        className="form-dropdown col-12 "
                                                                                        placeholder="Select SAC"
                                                                                        // defaultActiveFirstOption="true" defaultValue={hsn[0]?.code}
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
                                                                            <div className="select-container ">
                                                                                <label> Tax
                                                                                    <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Tax")} ></i>
                                                                                </label>
                                                                                <Select mode="tags" className="form-dropdown col-12 "
                                                                                    placeholder={(dropdown.tax) ? dropdown.tax : "Select Tax"}
                                                                                    onChange={(value) => { handleDropdowns(value, "tax") }}
                                                                                    value={dropdown.tax}
                                                                                >
                                                                                    {tax.map((option, i) => (
                                                                                        <Select.Option value={option.id} key={i} >{option.name}</Select.Option>
                                                                                    ))}
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> MRP Price </label>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control form-control-alternative mt-1"
                                                                                placeholder="MRP Price"
                                                                                name="mrp_price"
                                                                                value={item.mrp_price}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <label> Opening Qty per </label>
                                                                            <div className="input-group">
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control form-control-alternative mt-1"
                                                                                    placeholder="Opening Qty per"
                                                                                    name="opening_qty"
                                                                                    value={item.opening_qty}
                                                                                    onChange={(e) => handleChange(e)}
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
                                                                                value={item.s_price}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={item?.s_price_tax_inc || false}
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
                                                                                value={item.p_price}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={item?.p_price_tax_inc || false}
                                                                                onChange={((e) => { handleCheckbox(e.target.checked, "p_price_tax_inc") })}
                                                                            />
                                                                            <label className="margin-between" >Is Tax Inclusive</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label> UoM </label>
                                                                                <Select mode="tags" className="form-dropdown col-12 "
                                                                                    placeholder="Select UoM"
                                                                                    defaultActiveFirstOption="true" defaultValue={unitOfMeasurement[0]}
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
                                                                    </div>

                                                                    <div className="col-12">
                                                                        <div className="form-group d-flex ">
                                                                            <div className="form-group togglecss margin-vertical p-0">
                                                                                <div
                                                                                    className={`button r ${(check) ? "active" : ""
                                                                                        }`}
                                                                                    id="button-1"
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="checkbox"
                                                                                        name="status"
                                                                                        checked={check}
                                                                                        onChange={((e) => { setCheck((prev) => !prev) })} />
                                                                                    <div className="knobs"></div>
                                                                                    <div className="layer"></div>
                                                                                </div>
                                                                            </div>
                                                                            <label className="m-2" >Add Variation</label>
                                                                        </div>
                                                                    </div>
                                                                    {(check) && <div className="col-12">
                                                                        <button className="btn btn-sm btn-info" onClick={(e) => { addNewRow(e) }} >
                                                                            <i className="font-size-icon margin-between fa fa-plus-circle text-success add-modal" ></i>Add Row
                                                                        </button>
                                                                        <div className="table-responsive table-alone mt-1 ">
                                                                            <table className="table select-table ">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>Size/Capacity/Weight</th>
                                                                                        <th>Colour</th>
                                                                                        <th>Quantity</th>
                                                                                        <th>Pucrchase Price</th>
                                                                                        <th>Sales Price</th>
                                                                                        <th>Action</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>

                                                                                    {

                                                                                        variations.map((item, i) => {
                                                                                            return (
                                                                                                <>
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                value={item.size}
                                                                                                                name="size"
                                                                                                                onChange={(e) => { handleVariations(e, i) }}
                                                                                                                className="form-control" />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input
                                                                                                                type="text"
                                                                                                                value={item.colours}
                                                                                                                name="colours"
                                                                                                                onChange={(e) => { handleVariations(e, i) }}
                                                                                                                className="form-control" />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                value={item.quantity}
                                                                                                                name="quantity"
                                                                                                                onChange={(e) => { handleVariations(e, i) }}
                                                                                                                className="form-control" />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                value={item.purchase_price}
                                                                                                                name="purchase_price"
                                                                                                                onChange={(e) => { handleVariations(e, i) }}
                                                                                                                className="form-control" />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <input
                                                                                                                type="number"
                                                                                                                value={item.sales_price}
                                                                                                                name="sales_price"
                                                                                                                onChange={(e) => { handleVariations(e, i) }}
                                                                                                                className="form-control" />
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <div className="" >
                                                                                                                {(i !== 0) && <i class="fs-20 mdi mdi-archive text-danger" onClick={() => { removeRow(item.id, i) }}  ></i>}
                                                                                                            </div>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                    }


                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>}
                                                                </div>
                                                            </form>

                                                            <button type="submit" className="btn btn-warning me-2" onClick={manageSubmit} >
                                                                {(id) ? "Update" : "Save"}
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


                            <div className={toggle.delete ? "modal fade show d-block" : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content w-100">

                                        <div className="delete-modal">
                                            <div className=" d-flex flex-column"  >
                                                <h4 className=" d-flex flex-row justify-content-center mt-2" >Are you sure ? You want to delete this.</h4>
                                            </div>
                                            <div>
                                                <button type="button" className="btn btn-warning margin-between" onClick={() => deleteVariation()} >Yes</button>
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { setToggle({ ...toggle, delete: false }) }} >No</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={toggle.modal ? "modal fade show d-block" : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content w-100">
                                        <div className="modal-header pl-2 pr-0 pt-0 pb-0">
                                            <h5 className="modal-title ml-2" id="exampleModalLabel">Add {activeModal}</h5>
                                            <button type="button" className="close " data-dismiss="modal" aria-label="Close" onClick={() => { closeModal() }} >
                                                <span style={{ fontSize: "30px" }} >&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body p-0 d-flex justify-content-center" onKeyPress={(event) => (event.key === 'Enter') ? addTableItem() : ''} >


                                            <div className="">

                                                {(activeModal !== "HSN" && activeModal !== "SAC") && <div className="m-2">
                                                    <label className="" >{(activeModal == "Tax") && "Tax"} Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-alternative mt-1"
                                                        name="name"
                                                        value={tableItem.name}
                                                        onChange={(e) => handleChangeModal(e)}
                                                    />
                                                </div>}

                                                {
                                                    (activeModal == "Tax") && <div className="m-2">
                                                        <label className="" > Tax</label>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-alternative mt-1"
                                                            name="tax"
                                                            value={tableItem.tax}
                                                            onChange={(e) => handleChangeModal(e)}
                                                        />
                                                    </div>}

                                                {
                                                    (activeModal == "HSN" || activeModal === "SAC") &&
                                                    <>
                                                        <div className="m-2">
                                                            <label className="col-4" >Code No.</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Code No."
                                                                className="col-8 form-control form-control-alternative mt-1"
                                                                name="code_number"
                                                                value={tableItem.code_number}
                                                                onChange={(e) => handleChangeModal(e)}
                                                            />
                                                        </div>
                                                        <div className="m-2">
                                                            <label className="col-4" > Code</label>
                                                            <input
                                                                type="text"
                                                                className="col-8 form-control form-control-alternative mt-1"
                                                                placeholder="Enter 4 digit Code"
                                                                name="code"
                                                                value={tableItem.code}
                                                                onChange={(e) => handleChangeModal(e)}
                                                            />
                                                        </div>
                                                        <div className="m-2">
                                                            <label className="col-4" > Description</label>
                                                            <input
                                                                type="text"
                                                                className="col-8 form-control form-control-alternative mt-1"
                                                                placeholder="Description"
                                                                name="description"
                                                                value={tableItem.description}
                                                                onChange={(e) => handleChangeModal(e)}
                                                            />
                                                        </div>
                                                        <div className="m-2">
                                                            <label className="col-4" > GST Rate</label>
                                                            <input
                                                                type="text"
                                                                className="col-8 form-control form-control-alternative mt-1"
                                                                placeholder="GST Rate"
                                                                name="gst_rate"
                                                                value={tableItem.gst_rate}
                                                                onChange={(e) => handleChangeModal(e)}
                                                            />
                                                        </div>
                                                    </>
                                                }

                                            </div>

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-warning btn-sm margin-between" onClick={() => { addTableItem() }} >Save</button>
                                            <button type="button" className="btn btn-secondary btn-sm margin-between" data-dismiss="modal" onClick={() => { closeModal() }} >Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </Sidebar >
                    </div >
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default ManageProdAndService