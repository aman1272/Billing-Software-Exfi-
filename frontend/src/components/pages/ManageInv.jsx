import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Select } from "antd";
import Modal from './Modal';
import { unitOfMeasurement } from "../assets/UnitOfmeasure"
import DeleteModal from "./DeleteModal";
import { addProd_url, addServ_url, add_purchase_inv_url, add_purchase_invoice_url, add_quotation_inv_url, add_quotation_invoice_url, add_sales_inv_url, add_sales_invoice_url, editProd_url, editServ_url, getBrands_url, getComp_url, getContact, getCustomers, getHsnUrl, getProd_url, getSacUrl, getServ_url, getSuppliers, getTaxUrl, get_Bank_url, get_purchase_inv_url, get_quotation_inv_url, get_sales_inv_url } from "../assets/apis";
import Preview from "./Preview";


const ManageInv = () => {
    const navigate = useNavigate()
    const [item, setItem] = useState([])
    const [showComponent, setShowComponent] = useState(false);
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')
    const [toggle, setToggle] = useState(false)
    const [alert, setAlert] = useState(false)
    const [activeModal, setActiveModal] = useState("")
    const [check, setCheck] = useState(false)
    const [customer, setCustomers] = useState([])
    const [brand, setBrand] = useState([])
    const [address, setAddress] = useState([])
    const [services, setServices] = useState([])
    const [products, setProducts] = useState([])
    const [tax, setTax] = useState([])
    const [hsn, setHsn] = useState([])
    const [sac, setSac] = useState([])
    const [dropdown, setDropdown] = useState({ uom: "Piece" })
    const [variations, setVariations] = useState([{ id: 0, size: '', colours: "", quantity: "", purchase_price: "", sales_price: "", }])
    const [description, setDescription] = useState({})
    const [company, setCompany] = useState([])
    const [contacts, setContacts] = useState([])
    const [bank, setBank] = useState([])
    const [invoice, setInvoice] = useState([])
    const [calculation, setCalculation] = useState({})
    const [supplier, setSupplier] = useState([])

    const currency = " ₹"

    const token = window.sessionStorage.getItem('token')
    const productId = window.sessionStorage.getItem('productId')
    const serviceId = window.sessionStorage.getItem('serviceId')
    const isActive = window.sessionStorage.getItem('active')
    const companyid = window.sessionStorage.getItem('companyid')
    const salesId = window.sessionStorage.getItem('salesId')
    const purchaseId = window.sessionStorage.getItem('purchaseId')
    const quotationId = window.sessionStorage.getItem('quotationId')


    const id = productId ? productId : serviceId
    let contactid = (isActive === "sales") ? dropdown.customer : (isActive === "purchase") ? dropdown.supplier : dropdown.contacts

    const editorRef = useRef(null);


    const closeScreen = () => {
        window.sessionStorage.removeItem('productId')
        window.sessionStorage.removeItem('serviceId')
        window.sessionStorage.removeItem('product')
        window.sessionStorage.removeItem('challanId')
        window.sessionStorage.removeItem('purchaseId')
        window.sessionStorage.removeItem("quotationId")
        window.sessionStorage.removeItem('salesId')
        window.sessionStorage.removeItem('active')
        navigate("/invoices")
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (token) {
            getCustomer()
            getBrands()
            taxes()
            getHsn()
            getSac()
            getCompany()
            // getContacts()
            getSupplier()
            getBank()
        }

    }, [!toggle.modal]);

    useEffect(() => {
        if (id && token) {
            getItems()
        }
    }, [id]);


    useEffect(() => {
        if (token && contactid) {
            getAddress()
            getBank()
            manageCalculation()
            // getContacts()
            getSupplier()
        } else {
            setAddress([])
        }
    }, [contactid, !toggle.modal]);


    useEffect(() => {
        if (token) {
            getProdServ()
        }
    }, [dropdown.type]);


    const getCustomer = async () => {
        let url = `${getCustomers}`
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

                setCustomers(response?.data?.data)
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };


    const getCompany = async () => {
        let url = `${getComp_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: companyid
                }
            })
            if (response?.data?.success) {

                const invice_prefix = (isActive === "purchase") ? response?.data?.data[0].purchase_inv_prefix :
                    (isActive === "sales") ? response?.data?.data[0].sales_inv_prefix : response?.data?.data[0]?.quotation_prefix

                setCompany(response?.data?.data[0])
                setItem({
                    ...item,
                    invoice_prefix: invice_prefix,
                    quotation_prefix: invice_prefix,
                })
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };


    // const getContacts = async () => {
    //     let url = `${getCustomer}`
    //     try {
    //         const response = await axios({
    //             url,
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 authorization: `Bearer ${token}`,
    //                 companyid
    //             }
    //         })
    //         if (response?.data?.success) {
    //             setContacts(response.data.data)
    //         } else {
    //             manageAlert(response.data)
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         window.alert("Something went wrong")
    //     }
    // };

    const getSupplier = async () => {
        let url = `${getSuppliers}`
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
                setSupplier(response.data.data)
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };


    const getBank = async () => {
        let url = `${get_Bank_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: contactid
                }
            })
            if (response?.data?.success) {

                setBank(response?.data?.data)
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };


    const getAddress = async () => {
        let url = `${getCustomers}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: contactid,
                    is_ship_address: true,
                    companyid
                }
            })
            if (response?.data?.success) {
                console.log("address in data", response.data)
                setAddress(response?.data?.data)
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };

    const getProdServ = async () => {
        let url = (!dropdown.type) ? `${getProd_url}` : `${getServ_url}`
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
                (dropdown.type) ? setServices(response.data.data) : setProducts(response.data.data)

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

    const taxes = async () => {
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

    const addItem = async (e, type) => {
        e.preventDefault()

        const url = (isActive === "sales") ? `${add_sales_invoice_url}` : (isActive === "quotation") ? `${add_quotation_invoice_url}` : ` ${add_purchase_invoice_url}`

        const is_default_desc = item.is_default_desc ? 1 : 0
        const is_discount = item.is_discount ? 1 : 0
        const is_shipping_charge = item.is_shipping_charge ? 1 : 0
        const is_due_amount = item.is_due_amount ? 1 : 0
        const is_paid_amount = item.is_paid_amount ? 1 : 0
        const totalSum = manageCalculation().totalSum
        const totalTax = manageCalculation().totalTax
        const grandTotal = manageCalculation().grandTotal
        const shippingCharges = manageCalculation().shippingCharges
        const dueAmt = manageCalculation().due_amount
        const paidAmount = manageCalculation().paidAmount
        const payment_status = manageCalculation().payment_type
        const is_default_inv = item.is_default_inv ? 1 : 0
        const is_default_quotation = item.is_default_quotation ? 1 : 0

        const finaldata = JSON.stringify({
            customer: dropdown.customer, bank: dropdown.bank, shiping_address: dropdown.shiping_address,
            date: item.date, dueDate: item.dueDate, invoice_prefix: item.invoice_prefix, invoice_prefix2: item.invoice_prefix2,
            ...dropdown, ...item, is_default_inv, is_default_desc,
            is_discount, is_shipping_charge, description, ...calculation, totalTax,
            totalSum, grandTotal, is_paid_amount, is_due_amount, payment_status, is_default_quotation,
            shippingCharges, paidAmount, dueAmt, companyid, invoice
        })

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
            setCalculation({ discount: "", shiping_charge: "" })
            setDropdown({ service: "", product: "", sac_code: "", hsn_code: "", tax: "", customer: "", })
            setItem({ quantity: "", price: "", date: "", dueDate: "" })
            setInvoice([])
            // getTableData()
            window.scrollTo(0, 0);
            manageAlert(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };

    const addInvoices = (e) => {
        e.preventDefault()

        const rowData = {
            serviceid: dropdown.service, service_name: dropdown.service_name, sac_code: dropdown.sac_code,
            productid: dropdown.product, product_name: dropdown.product_name, hsn_code: dropdown.hsn_code,
            quantity: item.quantity, unit_price: item.price, uom: dropdown.uom, tax: dropdown.tax,
            taxName: dropdown.taxName, tax_percentage: dropdown.tax_percentage, type: dropdown.type
        }
        setInvoice([...invoice, rowData])
        setDropdown({
            ...dropdown,
            service: "", service_name: "", sac_code: "",
            product: "", product_name: "", hsn_code: "",
            uom: "", tax: "",
            taxName: "", tax_percentage: "", type: ""
        })
        setItem({ ...item, quantity: "", price: "", })
    }

    const removeItem = (index) => {
        const filteredData = invoice.filter((ele, i) => i !== index);
        setInvoice(filteredData)
    }


    const getTableData = async () => {
        let url = (isActive === "sales") ? `${get_sales_inv_url}` : (isActive === "purchase") ? `${get_purchase_inv_url}` : `${get_quotation_inv_url}`

        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    id: contactid,
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid
                }
            })
            if (response.data.success) {
                setInvoice(response.data.data)
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("something went wrong")
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
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("something went wrong")
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
            tax: newTaxId, category: newCatId, description, ...item, p_price_tax_inc, s_price_tax_inc,
            companyid
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
            alert("something went wrong")
        }
    };


    const manageAlert = (props) => {
        if (props == 'close') {
            // if (!err) { closeScreen() }
            setAlert(false)
        }
        else if (props.error) {
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
        if (!dropdown.customer && type === "Shipping Address") {
            window.alert("Please select customer")
        }
        else {
            setActiveModal(type)
            setToggle({ ...toggle, modal: true })
        }
    }

    const closeModal = () => {
        setToggle({ ...toggle, modal: false })
    }

    const manageSubmit = (e, type) => {
        if (id) {
            updateItem(e, type)
        } else {
            addItem(e, type)
        }
    }

    const handleChange = (props) => {
        setItem({ ...item, [props.target.name]: props.target.value })
    }

    const handleCalculation = (props) => {
        setCalculation({ ...calculation, [props.target.name]: props.target.value })
    }

    function isNegative(num) {
        if (typeof num === 'number' && Math.sign(num) === -1) {
            return true;
        }
        return false;
    }

    function isStatus({ grandTotal, paidAmount }) {
        const grandtotal = grandTotal.toFixed(2)
        const paidamount = paidAmount.toFixed(2)
        const difference = positiveAbsoluteDifference(grandtotal, paidamount)

        let type
        if (paidamount > grandtotal) {
            type = 3;  //  overpaid
        } else if (!difference) {
            type = 2;   //paid
        } else if (difference < 1 && 0 < difference) {
            type = 1;  //partially
        } else {
            type = 0  //  Dues
        }
        return type;
    }

    const manageCalculation = () => {
        const totalSum = invoice.reduce((acc, inv) => Number(acc) + Number(inv.unit_price * inv.quantity), 0);
        const totalTax = invoice.reduce((acc, inv) => Number(acc) + Number(inv.tax_percentage * inv.unit_price * inv.quantity / 100), 0);
        const shippingCharges = calculation.shiping_charge ? calculation?.shiping_charge : 0
        const discount = calculation?.discount ? calculation?.discount : 0
        const grandTotalWithoutDisc = Number(totalSum) + Number(totalTax) + Number(shippingCharges)
        const grandTotal = grandTotalWithoutDisc - Number(grandTotalWithoutDisc * discount / 100)
        const paidAmount = Number(calculation?.paid_amount) || 0
        const dueAmt = grandTotal - paidAmount

        const due_amount = (grandTotal && paidAmount) ? (isNegative(dueAmt) ? 0 : dueAmt) : grandTotal
        const payment_type = (grandTotal && paidAmount) ? isStatus({ grandTotal, paidAmount }) : 0

        return { totalSum, totalTax, grandTotal, due_amount, payment_type, paidAmount, shippingCharges }
    }


    function positiveAbsoluteDifference(value1, value2) {
        const diff = Math.abs(value1 - value2);
        return diff;
    }

    const handleDropdowns = (value, name, allprops) => {

        if (name === "contacts") {
            const newType = allprops?.length - 1
            const newLabel = allprops[newType]?.label ? allprops[newType]?.label : ""

            if (value?.length > 1) {
                const newVal = value?.length - 1
                setDropdown({ ...dropdown, contacts: value[newVal], name: newLabel })
            } else {
                setDropdown({ ...dropdown, contacts: value[0], name: newLabel })
            }
        }
        if (name === "customer") {
            const newType = allprops?.length - 1
            const customerName = allprops[newType]?.label ? allprops[newType]?.label : ""
            dropdown.customerName = customerName

            if (value?.length > 1) {
                const newVal = value?.length - 1
                setDropdown({ ...dropdown, contacts: value[newVal] })
            } else {
                setDropdown({ ...dropdown, contacts: value[0] })
            }
        }
        if (name === "supplier") {
            const newType = allprops?.length - 1
            const supplier = allprops[newType]?.label ? allprops[newType]?.label : ""
            dropdown.supplier = supplier

            if (value?.length > 1) {
                const newVal = value?.length - 1
                setDropdown({ ...dropdown, supplier: value[newVal] })
            } else {
                setDropdown({ ...dropdown, supplier: value[0] })
            }
        }
        if (name === "service") {
            const newType = allprops?.length - 1
            const service_name = allprops[newType]?.label ? allprops[newType]?.label : ""
            dropdown.service_name = service_name

            if (value?.length > 1) {
                const newVal = value?.length - 1
                setDropdown({ ...dropdown, contacts: value[newVal] })
            } else {
                setDropdown({ ...dropdown, contacts: value[0] })
            }
        }
        if (name === "product") {
            const newType = allprops?.length - 1
            const product_name = allprops[newType]?.label ? allprops[newType]?.label : ""
            dropdown.product_name = product_name

            if (value?.length > 1) {
                const newVal = value?.length - 1
                setDropdown({ ...dropdown, contacts: value[newVal] })
            } else {
                setDropdown({ ...dropdown, contacts: value[0] })
            }
        }
        if (name === "tax") {
            const newType = allprops?.length - 1
            const taxName = allprops[newType]?.label ? allprops[newType]?.label : ""
            const tax_percentage = allprops[newType]?.percent ? allprops[newType]?.percent : 0

            dropdown.taxName = taxName
            dropdown.tax_percentage = tax_percentage

            if (value?.length > 1) {
                const newVal = value?.length - 1
                setDropdown({ ...dropdown, contacts: value[newVal] })
            } else {
                setDropdown({ ...dropdown, contacts: value[0] })
            }
        }
        if (name === "type") {
            if (value?.length > 1) {
                const newVal = value.length - 1
                setDropdown({ ...dropdown, [name]: value[newVal], service: "", product: "", sac_code: "", hsn_code: "", tax: "" })
            } else {
                setDropdown({ ...dropdown, [name]: value[0], service: "", product: "", sac_code: "", hsn_code: "", tax: "" })
            }
        }
        else if (value?.length > 1) {
            const newVal = value.length - 1
            setDropdown({ ...dropdown, [name]: value[newVal] })
        } else {
            setDropdown({ ...dropdown, [name]: value[0] })
        }
    }


    const handleCheckbox = (check, name) => {
        if (name === "is_discount") {
            setCalculation({ ...calculation, discount: null })
        } else if (name === "is_shipping_charge") {
            setCalculation({ ...calculation, shiping_charge: null })
        }
        else if (name === "is_due_amount") {
            setCalculation({ ...calculation, due_amount: null })
        } else if (name === "is_paid_amount") {
            setCalculation({ ...calculation, paid_amount: null })
        }
        setItem({ ...item, [name]: check })
    }

    const today = new Date().toISOString().split('T')[0];


    return (
        <>
            {
                showComponent ?
                    <div className={`container-scroller body-components-margin `} >
                        <Sidebar name={"Invoices"}>
                            <div className={`main-panel ${toggle.modal && "opacity-50"}`}>
                                <div className="content-wrapper  ">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex justify-content-between m-1 p-1 align-items-baseline " >
                                                <h3 className="ukhd mb-3"> Add {(isActive === "sales") ? "Sales Invoice" : (isActive === "purchase") ? "Purchase Invoice" : (isActive === "quotation") ? "Quotation" : "Delivery Challan"}</h3>
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
                                                            <form className="row" onKeyPress={(event) => (event.key === 'Enter') ? "" : ''} >
                                                                {(isActive === "sales") && <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label className="col-12" > Customer
                                                                                <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Customer")} ></i>
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 "
                                                                                placeholder="Select Customer"
                                                                                onChange={(value, label) => { handleDropdowns(value, "customer", label) }}
                                                                                value={dropdown.customer}
                                                                            >
                                                                                {customer.map((option, i) => (
                                                                                    <Select.Option
                                                                                        value={option.id}
                                                                                        label={option.name}
                                                                                        key={i}
                                                                                    >{option.name}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                                {(isActive === "purchase") && <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label className="col-12" > Supplier
                                                                                {/* <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Supplier")} ></i> */}
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 "
                                                                                placeholder="Select Supplier"
                                                                                onChange={(value, label) => { handleDropdowns(value, "supplier", label) }}
                                                                                value={dropdown.supplier}
                                                                            >
                                                                                {supplier.map((option, i) => (
                                                                                    <Select.Option
                                                                                        value={option.id}
                                                                                        label={option.name}
                                                                                        key={i}
                                                                                    >{option.name}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                                {(isActive === "quotation") && <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label className="col-12" > Contact
                                                                                {/* <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Quotation")} ></i> */}
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 "
                                                                                placeholder="Select Contacts"
                                                                                onChange={(value, label) => { handleDropdowns(value, "contacts", label) }}
                                                                                value={dropdown.contacts}
                                                                            >
                                                                                {customer.map((option, i) => (
                                                                                    <Select.Option
                                                                                        // onClick={(value) => { handleDropdowns(option, "contacts", value) }}
                                                                                        value={option.id}
                                                                                        label={option.name}
                                                                                        key={i} >{option.name}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label className="col-12" > Type
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 "
                                                                                placeholder="Select Type"
                                                                                onChange={(value) => { handleDropdowns(value, "type") }}
                                                                                value={dropdown.type}

                                                                            >
                                                                                <Select.Option value={0}  >Goods</Select.Option>
                                                                                <Select.Option value={1}  >Services</Select.Option>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {(isActive === "sales") && <div className="col-6">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label className="col-12" > Shipping Address
                                                                                <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Shipping Address", dropdown.customer)} ></i>
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 "
                                                                                placeholder="Select Address"
                                                                                onChange={(value) => { handleDropdowns(value, "shiping_address") }}
                                                                                value={dropdown.shiping_address}
                                                                            >
                                                                                {address.map((option, i) => (
                                                                                    <Select.Option value={option.id} key={i} >{option.shipping_address}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                                {(isActive !== "quotation") && < div className="col-3">
                                                                    <div className="form-group mt-1">
                                                                        <label> Invoice </label>
                                                                        <div className="input-group">
                                                                            <input type="text" className="form-control form-control-alternative " id="invoice_prefix"
                                                                                name="invoice_prefix"
                                                                                onChange={(e) => handleChange(e)}
                                                                                value={item.invoice_prefix} />

                                                                            <input type="number"
                                                                                name="invoice_prefix2"
                                                                                onChange={(e) => handleChange(e)}
                                                                                value={item.invoice_prefix2}
                                                                                placeholder="" className="form-control form-control-alternative w-50" min="1" required="" id="id_invoice_number" />
                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item?.is_default_inv || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_default_inv") })}
                                                                        />
                                                                        <label className="margin-between" >Select this default</label>
                                                                    </div>
                                                                </div>}
                                                                {(isActive === "quotation") && < div className="col-3">
                                                                    <div className="form-group mt-1">
                                                                        <label> Quotation </label>
                                                                        <div className="input-group">
                                                                            <input type="text" className="form-control form-control-alternative " id="invoice_prefix"
                                                                                name="quotation_prefix"
                                                                                onChange={(e) => handleChange(e)}
                                                                                value={item.quotation_prefix} />

                                                                            <input type="number"
                                                                                name="quotation_prefix2"
                                                                                onChange={(e) => handleChange(e)}
                                                                                value={item.quotation_prefix2}
                                                                                placeholder="" className="form-control form-control-alternative w-50" min="1" required="" id="id_invoice_number" />
                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item?.is_default_quotation || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_default_quotation") })}
                                                                        />
                                                                        <label className="margin-between" >Select this default</label>
                                                                    </div>
                                                                </div>}
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <label>Date</label>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control form-control-alternative"
                                                                            name="date"
                                                                            value={item.date}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {(isActive === "sales") && <div className="col-3">
                                                                    <div className="form-group">
                                                                        <label>  Due Date </label>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control form-control-alternative"

                                                                            name="dueDate"
                                                                            value={item.dueDate}
                                                                            min={item.date}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>}
                                                                {(dropdown.type === 1) && <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label className="col-12" > Service
                                                                                <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => {
                                                                                    openModal("Service")
                                                                                }} ></i>
                                                                            </label>
                                                                            <Select mode="multiple" className="form-dropdown col-12 "
                                                                                placeholder="Service"
                                                                                onChange={(value, label) => { handleDropdowns(value, "service", label) }}
                                                                                value={dropdown.service}
                                                                            >
                                                                                {services.map((option, i) => (
                                                                                    <Select.Option
                                                                                        value={option.id}
                                                                                        label={option.name}
                                                                                        key={i}
                                                                                    >{option.name}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                                {
                                                                    (dropdown.type === 0) &&
                                                                    <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label className="col-12" >Product
                                                                                    <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => {
                                                                                        openModal("Product")
                                                                                    }} ></i>
                                                                                </label>
                                                                                <Select mode="multiple" className="form-dropdown col-12 "
                                                                                    placeholder="Product"
                                                                                    onChange={(value, label) => { handleDropdowns(value, "product", label) }}
                                                                                    value={dropdown.product}
                                                                                >
                                                                                    {products.map((option, i) => (
                                                                                        <Select.Option
                                                                                            value={option.id}
                                                                                            label={option.name}
                                                                                            key={i}
                                                                                        >{option.name}</Select.Option>
                                                                                    ))}
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    </div>}
                                                                {
                                                                    (dropdown.type === 1) && <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label className="col-12" > SAC Code
                                                                                    {/* <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => {
                                                                                        openModal("SAC")
                                                                                    }} ></i> */}
                                                                                </label>
                                                                                <Select mode="multiple" className="form-dropdown col-12 "
                                                                                    placeholder="SAC Code"
                                                                                    onChange={(value) => { handleDropdowns(value, "sac_code") }}
                                                                                    value={dropdown.sac_code}
                                                                                >
                                                                                    {sac.map((option, i) => (
                                                                                        <Select.Option value={option.code} key={i} >{option.code}</Select.Option>
                                                                                    ))}
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {
                                                                    (dropdown.type === 0) && <div className="col-3">
                                                                        <div className="form-group">
                                                                            <div className="select-container ">
                                                                                <label className="col-12" >HSN Code
                                                                                    {/* <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => {
                                                                                        openModal("HSN")
                                                                                    }} ></i> */}
                                                                                </label>
                                                                                <Select mode="multiple" className="form-dropdown col-12 "
                                                                                    placeholder="HSN Code"
                                                                                    onChange={(value) => { handleDropdowns(value, "hsn_code") }}
                                                                                    value={dropdown.hsn_code}
                                                                                >
                                                                                    {hsn.map((option, i) => (
                                                                                        <Select.Option value={option.code} key={i} >{option.code}</Select.Option>
                                                                                    ))}
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    </div>}
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <label>  Quantity </label>
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="number"
                                                                                className="form-control form-control-alternative"
                                                                                placeholder="Quantity"
                                                                                name="quantity"
                                                                                value={item.quantity}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <label>  Unit Price </label>
                                                                        <div className="input-group">
                                                                            <input
                                                                                type="number"
                                                                                className="form-control form-control-alternative"
                                                                                placeholder="Unit Price"
                                                                                name="price"
                                                                                value={item.price}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
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
                                                                <div className="col-3">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label> Tax
                                                                                <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Tax")} ></i>
                                                                            </label>
                                                                            <Select mode="tags" className="form-dropdown col-12 "
                                                                                placeholder={(dropdown.tax) ? dropdown.tax : "Select Tax"}
                                                                                onChange={(value, label) => { handleDropdowns(value, "tax", label) }}
                                                                                value={dropdown.tax}
                                                                            >
                                                                                {tax.map((option, i) => (
                                                                                    <Select.Option
                                                                                        value={option.id}
                                                                                        label={option.name}
                                                                                        percent={option.percentage}
                                                                                        key={i}
                                                                                    >{option.name}</Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 mb-2" >
                                                                    <div className="col-3">
                                                                        <button type="submit" className="btn btn-warning me-2" onClick={(e) => addInvoices(e)} >
                                                                            {(id) ? "Update" : "Add"}
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </form>
                                                            <div className="table-responsive table-alone mt-1 ">
                                                                <table className="table select-table ">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>S.No.</th>
                                                                            <th> Product/Service</th>
                                                                            <th> Quantity</th>
                                                                            <th>Hsn/SAC Code</th>
                                                                            <th> Net Price</th>
                                                                            {/* <th>Discount</th> */}
                                                                            <th>Amount</th>
                                                                            <th>Tax</th>
                                                                            <th>Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {(!invoice.length) ? <tr>
                                                                        <td colSpan="7" className="text-center">
                                                                            No data found
                                                                        </td>
                                                                    </tr>
                                                                        : (invoice?.map((item, i) => {
                                                                            const code = item.hsn_code ? item.hsn_code : item.sac_code
                                                                            const name = item.type ? item.service_name : item.product_name   //item.product_name ? item.product_name : item.service_name
                                                                            const type = item.type ? "Service" : "Product"
                                                                            const tax = item.tax_percentage
                                                                            const amount = Number(item?.quantity) * Number(item?.unit_price) || 0

                                                                            return (
                                                                                <>
                                                                                    <tbody className="border-table-row " >
                                                                                        <tr key={i}>

                                                                                            <td>
                                                                                                <h6 className="text-dark font-weight" >{i + 1}</h6>
                                                                                            </td>
                                                                                            <td>
                                                                                                <h5 className="text-dark font-weight" >{name}</h5>
                                                                                                <span className={`table-color-col ${item.type ? "bg-success" : "bg-warning"} text-light font-weight`} >{type}</span>

                                                                                            </td>
                                                                                            <td>
                                                                                                <h6>{item.quantity}</h6>
                                                                                            </td>
                                                                                            <td>
                                                                                                <h6>{code}</h6>
                                                                                            </td>
                                                                                            <td>
                                                                                                <h6  >{currency}{item.unit_price}</h6>
                                                                                            </td>
                                                                                            {/* <td>
                                                                                                <h6>{calculation.discount}</h6>
                                                                                            </td> */}
                                                                                            <td>
                                                                                                <h6  >{currency}{amount}</h6>
                                                                                            </td>
                                                                                            <td>
                                                                                                {/* <h6  >{item?.tax_percentage}</h6> */}
                                                                                                <h6  >{tax}%</h6>
                                                                                            </td>
                                                                                            <td>
                                                                                                <div className="" >
                                                                                                    <i class="fs-20 mdi mdi-archive text-danger" onClick={() => { removeItem(i) }}  ></i>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </>
                                                                            )
                                                                        }))
                                                                    }

                                                                </table>
                                                            </div >
                                                            <div className="d-flex justify-content-between"  >

                                                                <div className="col-6" >
                                                                    <div className=" " >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item?.is_shipping_charge || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_shipping_charge") })}
                                                                        />
                                                                        <label className="margin-between col-3" >Shipping Charges </label>

                                                                        {(item?.is_shipping_charge) &&
                                                                            <input
                                                                                type="number"
                                                                                className=""
                                                                                placeholder=""
                                                                                name="shiping_charge"
                                                                                value={calculation.shiping_charge}
                                                                                onChange={(e) => handleCalculation(e)}

                                                                            />
                                                                        }
                                                                    </div>
                                                                    <div className="  mt-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className=""
                                                                            checked={item?.is_discount || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_discount") })}
                                                                        />
                                                                        <label className="margin-between col-3" >Total Discount(%)</label>

                                                                        {(item?.is_discount) &&
                                                                            <input
                                                                                type="number"
                                                                                className=""
                                                                                placeholder=""
                                                                                name="discount"
                                                                                value={calculation.discount}
                                                                                onChange={(e) => handleCalculation(e)}
                                                                            />
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {(isActive !== "quotation") && <div className="col-6">
                                                                    <div className="  mt-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className=""
                                                                            checked={item?.is_paid_amount || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_paid_amount") })}
                                                                        />
                                                                        <label className="margin-between col-3" >Amount Paid</label>

                                                                        {(item?.is_paid_amount) &&
                                                                            <input
                                                                                type="number"
                                                                                className=""
                                                                                placeholder=""
                                                                                name="paid_amount"
                                                                                value={calculation.paid_amount ? calculation.paid_amount : 0}
                                                                                onChange={(e) => handleCalculation(e)}
                                                                            />
                                                                        }
                                                                    </div>
                                                                    <div className="  mt-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className=""
                                                                            checked={item?.is_due_amount || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_due_amount") })}
                                                                        />
                                                                        <label className="margin-between col-3" >Amount Due</label>

                                                                        {(item?.is_due_amount) &&
                                                                            <input
                                                                                type="number"
                                                                                className=""
                                                                                placeholder=""
                                                                                name="due_amount"
                                                                                value={manageCalculation().due_amount ? manageCalculation().due_amount : 0}
                                                                            // onChange={(e) => handleCalculation(e)}
                                                                            />
                                                                        }
                                                                    </div>
                                                                </div>}
                                                                {/* <div className=" col-6" >
                                                                    <div className="heading-inv-bill p-1" >
                                                                        <label className="margin-between col-4  " >Details </label>
                                                                        <label className="margin-between row-inv-float" >Amount </label>
                                                                    </div>

                                                                    <div className="row-inv-bill mt-2">
                                                                        <label className="margin-between col-4" >Total tax </label>
                                                                        <label className="margin-between row-inv-float" >{manageCalculation().totalTax} </label>
                                                                    </div>
                                                                    <div className=" row-inv-bill mt-2">
                                                                        <label className="margin-between col-4" >Sub-total </label>
                                                                        <label className="margin-between row-inv-float" >{manageCalculation().totalSum} </label>
                                                                    </div>
                                                                    <div className=" row-inv-bill mt-2">
                                                                        <label className="margin-between col-4" >Grand Total </label>
                                                                        <label className="margin-between row-inv-float" >{manageCalculation().totalSum + manageCalculation().totalTax} </label>
                                                                    </div>
                                                                    <div className=" row-inv-bill mt-2">
                                                                        <label className="margin-between col-4" >Amount Paid </label>
                                                                        <label className="margin-between row-inv-float" >{calculation.amountPaid} </label>
                                                                    </div>
                                                                    <div className=" row-inv-bill mt-2">
                                                                        <label className="margin-between col-4" >Amount Due </label>
                                                                        <label className="margin-between row-inv-float" >{calculation.amountDue} </label>
                                                                    </div>
                                                                </div> */}

                                                            </div>
                                                            <div className="d-flex  mb-4 mt-4 col-12" >
                                                                {(isActive === "quotation") &&
                                                                    <>
                                                                        <div className="  row-border mt-2">
                                                                            <label className=" row-border-bottom col-12" >CGST </label>
                                                                            <label className="margin-between " >{currency}{manageCalculation().totalTax.toFixed(2) / 2} </label>
                                                                        </div>
                                                                        <div className="  row-border mt-2">
                                                                            <label className=" row-border-bottom col-12" >SGST</label>
                                                                            <label className="margin-between " >{currency}{manageCalculation().totalTax.toFixed(2) / 2}</label>
                                                                        </div>
                                                                    </>
                                                                }
                                                                <div className=" row-border mt-2">
                                                                    <label className=" row-border-bottom col-12" >Total tax </label>
                                                                    <label className="margin-between " >{currency}{manageCalculation().totalTax.toFixed(2)} </label>
                                                                </div>
                                                                <div className="  row-border mt-2">
                                                                    <label className=" row-border-bottom col-12" >Sub-total </label>
                                                                    <label className="margin-between " >{currency}{manageCalculation().totalSum.toFixed(2)} </label>
                                                                </div>
                                                                <div className="  row-border mt-2">
                                                                    <label className=" row-border-bottom col-12" >Grand Total </label>
                                                                    <label className="margin-between " >{currency}{manageCalculation().grandTotal.toFixed(2)} </label>
                                                                </div>
                                                                {(isActive !== "quotation") &&
                                                                    <>
                                                                        <div className="  row-border mt-2">
                                                                            <label className="row-border-bottom col-12" >Amount Paid </label>
                                                                            <label className="margin-between " >{currency}{manageCalculation().paidAmount.toFixed(2)}  </label>
                                                                        </div>
                                                                        <div className="  row-border mt-2">
                                                                            <label className=" row-border-bottom col-12" >Amount Due </label>
                                                                            <label className="margin-between " >{currency}{manageCalculation().due_amount.toFixed(2)} </label>
                                                                        </div>
                                                                    </>
                                                                }
                                                            </div>
                                                            <form className="row" onKeyPress={(event) => (event.key === 'Enter') ? "" : ''} >

                                                                <div className="col-12 mb-4" >
                                                                    <div className="form-group">
                                                                        <label> Note for Client </label>
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
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={item?.is_default_desc || false}
                                                                            onChange={((e) => { handleCheckbox(e.target.checked, "is_default_desc") })}
                                                                        />
                                                                        <label className="margin-between" >Mark as default</label>
                                                                    </div>
                                                                </div>

                                                                <div className="col-12">
                                                                    <div className="form-group">
                                                                        <label> Private Note </label>
                                                                        <textarea
                                                                            type="text"
                                                                            className="form-control form-control-alternative"
                                                                            placeholder="Note"
                                                                            name="note"
                                                                            value={item.note}
                                                                            onChange={(e) => handleChange(e)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {(isActive !== "quotation") && <div className="col-12">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label> Bank
                                                                                <i className="fa fa-plus-circle text-success add-modal margin-between cursor" data-toggle="modal" onClick={() => openModal("Bank")} ></i>
                                                                            </label>
                                                                            <Select
                                                                                mode="tags"
                                                                                className="form-dropdown col-12 "
                                                                                placeholder="Select Bank"
                                                                                onChange={(value) => { handleDropdowns(value, "bank") }}
                                                                                value={dropdown.bank}
                                                                            >
                                                                                {bank.map((option, i) => (
                                                                                    <Select.Option value={option.id} key={i}
                                                                                    >{option.account_no} | {option.ifsc_code} | {option.branch}  </Select.Option>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div>}
                                                                {/* <div className="col-6">
                                                                    <div className="form-group">
                                                                        <div className="select-container ">
                                                                            <label>Client Type
                                                                            </label>
                                                                            <Select
                                                                                mode="tags"
                                                                                className="form-dropdown col-12 "
                                                                                placeholder="Select Type"
                                                                            // onChange={(value) => { handleDropdowns(value, "bank") }}
                                                                            // value={dropdown.hsn}
                                                                            >
                                                                                <Select.Option value={0}>Customer </Select.Option>
                                                                                <Select.Option value={1}>Supplier </Select.Option>
                                                                                <Select.Option value={2}>Transporter </Select.Option>
                                                                            </Select>
                                                                        </div>
                                                                    </div>
                                                                </div> */}

                                                            </form>

                                                            <button type="submit" className="btn btn-warning me-2" onClick={(e) => manageSubmit(e, "finalSubmit")} >
                                                                {(productId || serviceId) ? "Update" : "Save"}
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
                            <Modal activeModal={activeModal} toggle={toggle?.modal} closeModal={closeModal} customerId={contactid} />
                        </Sidebar >
                        {/* <Preview salesid={dropdown.customer} purchaseid={dropdown.supplier} quotationid={dropdown.contacts} /> */}

                    </div >
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default ManageInv