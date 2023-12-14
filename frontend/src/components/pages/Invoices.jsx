import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Select } from "antd";
import { add_sales_invoice_url, delete_multiple_purchase_url, delete_multiple_quotation_url, delete_multiple_sales_url, delete_purchase_inv_Url, delete_quotation_inv_Url, delete_sales_inv_Url, edit_quotation_invoices_url, get_all_inv_counts_url, get_purchase_invoice_url, get_quotation_invoice_url, get_sales_invoice_url } from "../assets/apis";
import { CSVLink } from "react-csv";
import DeleteModal from "./DeleteModal";

const Invoices = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [message, setMessage] = useState('')
    const [err, setErr] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [count, setCounts] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState("");
    const [active, setActive] = useState({ sales: true });
    const [isViewModal, setIsViewModal] = useState(false)
    const [isViewAlert, setIsViewAlert] = useState(false)
    const [data, setData] = useState({
        date: `${Number(window.sessionStorage.getItem('fy'))}-04-01`,
        duedate: `${Number(window.sessionStorage.getItem('fy')) + 1}-03-31`,
        min: `${Number(window.sessionStorage.getItem('fy'))}-04-01`,
        max: `${Number(window.sessionStorage.getItem('fy'))}-12-31`,
        min2: `${Number(window.sessionStorage.getItem('fy')) + 1}-01-01`,
        max2: `${Number(window.sessionStorage.getItem('fy')) + 1}-03-31`
    })

    const currency = "₹"
    const token = window.sessionStorage.getItem('token')
    const companyid = window.sessionStorage.getItem('companyid')


    useEffect(() => {
        if (token) {
            getItems()
        }
    }, []);


    useEffect(() => {
        if (token) {
            setPage(0)
            getItems()
        }
    }, [perPage]);

    useEffect(() => {
        if (token) { getItems() }
    }, [page]);

    useEffect(() => {
        if (token) {
            setPage(0)
            setPerPage(10)
            getItems()
        }
    }, [active]);


    let deleteMultipleurl = active.sales ? `${delete_multiple_sales_url}` : (active.quotation) ? `${delete_multiple_quotation_url}` : (active.purchase) ? `${delete_multiple_purchase_url}` : ""


    const getItems = async () => {
        let url
        url = active.sales ? `${get_sales_invoice_url}` : (active.quotation) ? `${get_quotation_invoice_url}` : (active.challan) ? `${get_quotation_invoice_url}` : `${get_purchase_invoice_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    'limit': perPage,
                    'skip': page,
                    companyid
                }
            })
            getCounts()
            if (response?.data?.success) {
                addKeysAndValues(response?.data?.data)
                // setItems(response?.data?.data)
                // setAllData({ ...allData, Items: response?.data?.data })
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getCounts = async () => {
        let url = `${get_all_inv_counts_url}`
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
                setCounts(response.data.data)
            } else {
                console.log("Err in getting counts")
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const deleteItem = async () => {
        let url = active.sales ? `${delete_sales_inv_Url}` : (active.quotation) ? `${delete_quotation_inv_Url}` : (active.challan) ? "" : `${delete_purchase_inv_Url}`
        try {
            const response = await axios({
                url,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id,
                    companyid
                }
            })
            // window.scrollTo(0, 0);
            setId(null)
            getItems()
            setToggle({ ...toggle, modal: false })
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    }


    const deleteMultipleItem = async () => {
        if (isViewModal) {
            setIsViewModal(false)
            getItems()
        } else {
            setIsViewModal(true)
        }
    }

    const closeAlertModal = async () => {
        if (isViewAlert) {
            setIsViewAlert(false)
            getItems()
        } else {
            setIsViewAlert(true)
        }
    }

    const changeStatus = async (item) => {
        let url = (active.sales) ? "http://localhost:8000/api/edit/sales/status" : "http://localhost:8000/api/edit/purchase/status"
        let status = Number(item.status) ? 0 : 1
        try {
            await axios({
                url,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: item.id
                },
                data: { status }
            })
            // window.scrollTo(0, 0);
            getItems()
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    }

    const shareDataTosales = async (data) => {

        let isPromtResponse = window.confirm("Do You Want to Convert Quotation  to Sales Invoice?");
        if (isPromtResponse == null || isPromtResponse == "") {
        } else {
            let url = `${add_sales_invoice_url}`
            const finaldata = JSON.stringify({
                customer: data.contact_id, companyid,
                bank: "", is_default_desc: 0, note: "", description: "", discount: data.discount,
                is_discount: 0, is_shipping_charge: 0, totalSum: data.totals_sum,
                totalTax: data.total_tax, grandTotal: data.grand_total, is_due_amount: 0, shiping_address: "", is_default_inv: 0,
                is_paid_amount: 0, payment_status: 0, invoice_prefix: data.pre_quotation, date: data.date, dueDate: "", invoice_prefix2: "",
                dueAmt: "", paidAmount: "", shipping_charge: data.shipping_charge
            })
            try {
                await axios({
                    url,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    data: { data: finaldata }
                })
                // window.scrollTo(0, 0);
                getItems()
                changeCurrentTableData(data.contact_id, data.id)
            } catch (error) {
                console.error('Error fetching data:', error);
                alert("Something went wrong")
            }
        }
    }

    const changeCurrentTableData = async (id, quoId) => {
        console.log("share quo inv step 2", id, quoId)
        const url = `${get_sales_invoice_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id,
                    companyid
                }
            })
            editSharedQuotation(quoId, response?.data?.data[0]?.invoice)
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    }

    const editSharedQuotation = async (id, invoice_no) => {
        console.log("share quo inv step 3", id, invoice_no)
        const finaldata = JSON.stringify({ id, invoice_no, companyid })
        const url = `${edit_quotation_invoices_url}`
        try {
            const response = await axios({
                url,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                data: { data: finaldata }
            })
            getItems()
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    }


    const addKeysAndValues = (data) => {
        const updatedData = data.map((item) => ({
            ...item,
            check: false
        }));
        setItems(updatedData)
        setAllData({ ...allData, Items: updatedData })

    };

    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Items?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {

            setItems(filteredResults);

        } else {

            setItems(filteredResults);
        }
    };


    const updateFy = () => {
        setData({
            date: `${Number(window.sessionStorage.getItem('fy'))}-04-01`,
            duedate: `${Number(window.sessionStorage.getItem('fy')) + 1}-03-31`,
            min: `${Number(window.sessionStorage.getItem('fy'))}-04-01`,
            max: `${Number(window.sessionStorage.getItem('fy'))}-12-31`,
            min2: `${Number(window.sessionStorage.getItem('fy')) + 1}-01-01`,
            max2: `${Number(window.sessionStorage.getItem('fy')) + 1}-03-31`
        })
        handleFilterByDate()
    };


    const handleFilterByDate = () => {
        const startDate = new Date(data.date);
        const startDateTS = Math.floor(startDate.getTime() / 1000);
        const endDate = new Date(data.duedate);
        const endDateTS = Math.floor(endDate.getTime() / 1000);

        const filteredResults = allData?.Items?.filter(a => {
            const date = new Date(a.date);
            const dateTS = Math.floor(date.getTime() / 1000);
            const duedate = new Date(a.due_date);
            const duedateTS = Math.floor(duedate.getTime() / 1000);

            return (dateTS >= startDateTS && duedateTS <= endDateTS);
        });
        setItems(filteredResults);
    };


    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const manageAction = (item, action) => {
        if (action == "edit") {
            let name = active.sales ? "salesId" : active.quotation ? "quotationId" : active.purchase ? "purchaseId" : "challanId"
            window.sessionStorage.setItem(`${[name]}`, item.id)

            if (active.sales || active.purchase) {
                if (active.sales) {
                    window.sessionStorage.setItem("active", 'sales')
                }
                else {
                    window.sessionStorage.setItem("active", 'purchase')
                }
            } else {
                if (active.quotation) {
                    window.sessionStorage.setItem("active", 'quotation')
                }
                else {
                    window.sessionStorage.setItem("active", 'challan')
                }
            }
            navigate('/manage-inv')
        }
        else if (action == "delete") {
            setId(item.id)
            setToggle({ ...toggle, modal: true });
        }
        else {
            window.sessionStorage.setItem("active", item)
            navigate('/manage-inv')
        }
    }

    const handleFilter = (props) => {
        if (props == 'due') {
            const updatedData = allData?.Items?.filter((item) => {
                if (item.payment_status === 0) {
                    return { ...item };
                }
            });
            setItems(updatedData)
        }
        else if (props == 'paid') {
            const updatedData = allData?.Items?.filter((item) => {
                if (item.payment_status === 2) {
                    return { ...item };
                }
            });
            setItems(updatedData)
        }
        else if (props == 'partial') {
            const updatedData = allData?.Items?.filter((item) => {
                if (item.payment_status === 1) {
                    return { ...item };
                }
            });
            setItems(updatedData)
        } else if (props == 'overpaid') {
            const updatedData = allData?.Items?.filter((item) => {
                if (item.payment_status === 3) {
                    return { ...item };
                }
            });
            setItems(updatedData)
        }
        else {
            setItems(allData?.Items)
        }
    }

    const manageAlert = (props) => {
        // console.log("manageAlert", props)
        // if (props == 'close') {
        //     if (!err) { getItems() }
        //     setToggle(false)
        // }
        // else if (props.error) {
        //     setErr(true)
        //     setMessage(props?.message)
        //     setToggle(true)
        // }
        // else if (props.success) {
        //     setErr(false)
        //     setMessage(props.message)
        //     setToggle(true)
        // }

    }

    const handleChange = (props) => {

        const newVal = props.target.value.split('-')
        if (newVal.length > 2) {
            const months = newVal[1]
            const date = newVal[2]
            if (props.target.name === "date") {
                const finaldate = `${Number(window.sessionStorage.getItem('fy'))}-${months}-${date}`
                setData({ ...data, [props.target.name]: finaldate })
            } else {
                const finaldate = `${Number(window.sessionStorage.getItem('fy')) + 1}-${months}-${date}`
                setData({ ...data, [props.target.name]: finaldate })
            }
            handleFilterByDate()
        }
    }


    const handleChangeCheckBox = (checked, id) => {
        if (id === "all") {
            const updatedData = items.map((item) => ({
                ...item,
                check: checked
            }));
            setItems(updatedData)
        }
        else {
            const updatedData = items.map((item) => {
                if (item.id === id) {
                    return { ...item, check: checked };
                }
                return item;
            });
            setItems(updatedData)
        }
    }


    const checkBoxItem = () => {
        let idForDelete = []
        items.forEach((item) => {
            if (item.check) {
                idForDelete.push(item.id)
            }
        });
        return idForDelete
    }

    const formatDate = (date) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) {
            hours -= 12;
        }
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return ` ${day} ${month} ${year}  ${hours}:${formattedMinutes} ${ampm}`;
    }

    const manageActive = (props) => {
        setActive({ [props]: true })
    }

    const salesCount = (count[0]?.row_count) ? count[0]?.row_count : 0
    const purchaseCount = (count[1]?.row_count) ? count[1]?.row_count : 0
    const quotationCount = (count[2]?.row_count) ? count[2]?.row_count : 0
    const challanCount = (count[3]?.row_count) ? (count[3]?.row_count) : 0
    const itemBoundary = (active.sales) ? salesCount : (active.quotation) ? quotationCount : (active.purchase) ? purchaseCount : challanCount
    const isActive = active.sales ? `salesInv` : (active.quotation) ? `quotationInv` : (active.challan) ? `challanInv` : `purchaseInv`


    return (
        <>
            <div className="container-scroller" >
                <Sidebar name={"Invoices"} updateFy={updateFy} />
                <div className={(false) ? " content-wrapper opacity-50 body-components-margin" : " content-wrapper body-components-margin"} >
                    <div className="d-flex justify-content-center margin-vertical ">
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("sales") }} >
                            <div className={`${active.sales ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-contact-mail"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Sales Invoices
                                            </p>
                                            <h4>
                                                {salesCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("purchase") }} >
                            <div className={`${active.purchase ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-briefcase-check"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Purchase Invoice
                                            </p>
                                            <h4>
                                                {purchaseCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("quotation") }} >
                            <div className={`${active.quotation ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-account-group"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Quotation
                                            </p>
                                            <h4 >
                                                {quotationCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("challan") }} >
                            <div className={`${active.challan ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="mdi  mdi-bus-clock"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Delivery Challan
                                            </p>
                                            <h4>
                                                {challanCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* {toggle ? <div className={`alert ${err ? "alert-warning" : "alert-success"} alert-dismissible fade show`} role="alert">
                        {message}  <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            onClick={() => { manageAlert('close') }}
                        />
                    </div> : ""} */}
                    <div className="row">
                        <div className="col-sm-12 card card-rounded card-body ">
                            <div className="d-flex justify-content-between vsalign mb-2 mt-2" >
                                <div>
                                    <h3 className="ukhd mb-3" >All {(active.sales) ? "Sales Invoice" : (active.quotation) ? "Quaotation" : (active.purchase) ? "Purchase Invoice" : "Delivery Challan"}</h3>
                                </div>
                                <div>
                                    {(active.sales) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("sales")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Sales Invoice</span>}
                                    {(active.purchase) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("purchase")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Purchase Invoice</span>}
                                    {(active.quotation) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("quotation")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Quotation</span>}
                                    {(active.challan) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("challan")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Delivery Challan</span>}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-start" >
                                <div className="d-flex align-item-center max-width ">
                                    <p className="p-0" >Show records per page :</p>
                                    <div>
                                        <div className="dropdown show" onClick={() => { if (!toggle.select) { setToggle({ ...toggle, select: true }) } else { setToggle({ ...toggle, select: false }) } }} >
                                            <a className="btn btn-secondary btn-sm dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                {perPage}
                                            </a>
                                            <div className={toggle.select ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuLink">
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(10)}  >10</a>
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(25)} >25</a>
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(50)}  >50</a>
                                                <a className="dropdown-item" onClick={(e) => handlePerPage(100)}  >100</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="d-flex">
                                        {/* <div>
                                            <div className="form-group">
                                                <label>{(active.sales || active.challan) ? "Customer" : (active.quotation) ? "Contact" : "Supplier"} Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={(active.sales || active.challan) ? "Customer Name" : (active.quotation) ? "Contact Name" : "Supplier Name"}
                                                    name="name"
                                                // value={category.name}
                                                // onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>{(active.sales || active.purchase) ? "Invoice" : (active.quotation) ? "Quotation" : "Challan"} Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={(active.sales || active.purchase) ? "Invoice" : (active.quotation) ? "Quotation" : "Challan"}
                                                    name="name"
                                                // value={category.name}
                                                // onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                        </div> */}
                                        <div className="margin-between" >
                                            <div className="form-group">
                                                <label>Start Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="date"
                                                    value={data.date}
                                                    onChange={(e) => handleChange(e)}
                                                    min={data.min}
                                                    max={data.max}
                                                />
                                            </div>
                                            {/* <div className="form-group">
                                                <label>End Date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                // placeholder=" Invoice Number"
                                                // name="name"
                                                // value={category.name}
                                                // onChange={(e) => handleChange(e)}
                                                />
                                            </div> */}
                                        </div>
                                        <div className="form-group">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="duedate"
                                                value={data.duedate}
                                                onChange={(e) => handleChange(e)}
                                                min={data.min2}
                                                max={data.max2}
                                            />
                                        </div>
                                        {/* {(!active.quotation) && <div className="form-group">
                                            <label>Status</label>
                                            <div className="select-container dropdown-width">
                                                <Select mode="tags" className="form-dropdown col-12 "
                                                    placeholder="Select status"
                                                // defaultActiveFirstOption="true" defaultValue={unit[0]}
                                                // onChange={(value) => { handleDropdowns(value, "uom") }}
                                                // value={dropdown.uom}
                                                >
                                                    <Select.Option value={0}>Due</Select.Option>
                                                    <Select.Option value={1}>Partial</Select.Option>
                                                    <Select.Option value={2}>Paid</Select.Option>
                                                    <Select.Option value={3}>OverPaid</Select.Option>

                                                </Select>
                                            </div>
                                        </div>} */}
                                    </div>
                                </div>
                                <div>
                                    <span className="btn btn-warning btn-sm text-white mb-0 me-0 margin-between" onClick={() => { handleFilter("all") }} ><i className="menu-icon mdi mdi-filter-remove vsalign"></i>Reset</span>
                                    {(!!checkBoxItem()?.length) && <span className="btn btn-danger btn-sm text-white mb-0 me-0 margin-between" onClick={() => { deleteMultipleItem() }} ><i className="menu-icon mdi mdi-floor-plan vsalign"></i>Delete</span>}
                                    <CSVLink
                                        data={items}
                                        filename={`${isActive}.csv`}
                                        className="btn btn-primary btn-sm text-white mb-0 me-0 margin-between"
                                        target="_blank"
                                    >
                                        <i className="menu-icon mdi mdi-export vsalign"></i>Export All
                                    </CSVLink>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        className="searchbar margin-between"
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            {(!active.quotation) && <div className="d-flex justify-content-center mb-4 " >
                                <div className="d-flex w-25 mt-2">
                                    <div className="bg-danger color-filter rounded cursor-pointer " onClick={() => handleFilter("due")} ></div>
                                    <label className="margin-between col-12"  >Due </label>
                                </div>
                                <div className=" d-flex w-25 mt-2">
                                    <div className="bg-success color-filter rounded cursor-pointer" onClick={() => handleFilter("paid")} ></div>
                                    <label className="margin-between col-12" >Paid </label>
                                </div>
                                <div className="d-flex  w-25 mt-2">
                                    <div className="bg-warning color-filter rounded cursor-pointer" onClick={() => handleFilter("partial")} ></div>
                                    <label className="margin-between col-12" >Partial</label>
                                </div>
                                <div className="d-flex w-25 mt-2">
                                    <div className="bg-info color-filter rounded cursor-pointer" onClick={() => handleFilter("overpaid")} ></div>
                                    <label className="margin-between col-12" >Overpaid </label>
                                </div>
                            </div>}
                            <div className="table-responsive table-alone">
                                <table className="table select-table ">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox"
                                                onChange={((e) => { handleChangeCheckBox(e.target.checked, "all") })}
                                            /></th>
                                            <th>S.No.</th>
                                            <th> Name</th>
                                            <th>{(active.sales || active.purchase) ? "Inv" : (active.quotation) ? "Quo" : "Challan"} N0.</th>
                                            <th>Date</th>
                                            <th> Amount</th>
                                            {(!active.challan) && <th>Tax</th>}
                                            <th> Discount</th>
                                            <th>Total</th>
                                            {(!active.quotation) && <th>Status</th>}
                                            {(!active.quotation) && <th>Paid</th>}
                                            {(!active.quotation) && <th>Balance</th>}
                                            {(!active.quotation) && <th>Paid Date</th>}
                                            {(active.quotation) && <th>Invoiced</th>}
                                            {(active.quotation) && <th>Invoiced N0.</th>}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {(!items.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        : (items?.map((item, i) => {
                                            let status = Number(item.payment_status)

                                            const payment_status = (status === 1) ? "Partial" : (status === 0) ? "Due" : (status === 2) ? "Paid" : "Overpaid"
                                            const timestamp = item.created_date * 1000
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        {
                                                            (active.sales || active.purchase) ?
                                                                <tr key={i}>
                                                                    <td>
                                                                        <input type="checkbox"
                                                                            checked={item.check}
                                                                            onChange={((e) => { handleChangeCheckBox(e.target.checked, item.id) })}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <h6  >{i + page + 1}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-dark font-weight" >{item.name}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5 >{item.pre_invoice}{item.invoice}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5 >{item.date}</h5>
                                                                    </td>
                                                                    <td>
                                                                        {(item.totals_sum) && <h5  >{currency}{Number(item.totals_sum).toFixed(2)}</h5>}
                                                                    </td>
                                                                    <td>
                                                                        {(item.total_tax) && <h5  >{currency}{Number(item.total_tax).toFixed(2)}</h5>}
                                                                    </td>
                                                                    <td>
                                                                        {(item.discount) && <h5  >{currency}{Number(item.discount).toFixed(2)}</h5>}
                                                                    </td>
                                                                    <td>
                                                                        {(item.grand_total) && <h5  >{currency}{Number(item.grand_total).toFixed(2)}</h5>}
                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-dark font-weight" >{payment_status}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-danger font-weight"  >{currency}{Number(item.paid_amount).toFixed(2)}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-dark font-weight" >{Number(item.due_amount).toFixed(2)}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h5  >{formattedDate}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <div className="" >
                                                                            {/* <i className="fs-20 mdi mdi-printer text-success" onClick={() => { }} ></i> */}
                                                                            <i className="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { manageAction(item, "edit") }} ></i>
                                                                            <i class="fs-20 mdi mdi-archive text-danger" onClick={() => { manageAction(item, "delete") }}  ></i>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                :
                                                                <tr key={i}>
                                                                    <td>
                                                                        <input type="checkbox"
                                                                            checked={item.check}
                                                                            onChange={((e) => { handleChangeCheckBox(e.target.checked, item.id) })}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <h6 className="text-dark font-weight" >{i + page + 1}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-dark font-weight" >{item.customer_name}</h5>
                                                                        <span className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</span>

                                                                    </td>
                                                                    <td>
                                                                        <h5> {item.pre_quotation} {item.quotation}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{item.date}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6  >{item.totals_sum}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{currency}{item.total_tax}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{item.discount}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6 className="text-dark font-weight"  >{item.grand_total}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{(item.is_invoice) ? "Yes" : "No"}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{(item.invoice_no) ? item.invoice_no : "----"}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <div className="" >
                                                                            {(!item.is_invoice) && <i className="fs-20 mdi mdi-share text-success" onClick={() => { shareDataTosales(item) }} ></i>
                                                                            }                                                                            <i className="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { manageAction(item, "edit") }} ></i>
                                                                            <i class="fs-20 mdi mdi-archive text-danger" onClick={() => { manageAction(item, "delete") }}  ></i>
                                                                        </div>
                                                                    </td>
                                                                </tr>


                                                        }
                                                    </tbody>
                                                </>
                                            )
                                        }))
                                    }

                                </table>
                                {(!!items.length) && <div className="custom-footer mt-3" >
                                    <i className="mdi mdi-chevron-double-left pagination-button"
                                        onClick={() => {
                                            const newPage = page - perPage;
                                            if (newPage >= 0) setPage(newPage)
                                        }}
                                    ></i>

                                    {(((page + perPage) / perPage) - 1) !== 0 && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page - perPage;
                                            if (newPage >= 0) setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) - 1)}</span>}

                                    <span className="pagination-active" >{Math.ceil((page + perPage) / perPage)}</span>

                                    {(Math.ceil(itemBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(itemBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((itemBoundary / perPage) >= newPage) {
                                                setPage(newPage)
                                            }
                                        }}
                                    ></i>
                                </div>}
                            </div >
                        </div>
                    </div>
                </div>
                <div className={toggle.modal ? "modal fade show d-block" : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                    <div className="modal-dialog delete-modal-margin" role="document">
                        <div className="modal-content w-100">

                            <div className="delete-modal">
                                <div className=" d-flex flex-column"  >
                                    <h4 className=" d-flex flex-row justify-content-center mt-2" >Are you sure ? You want to delete this.</h4>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-warning margin-between" onClick={() => deleteItem()} >Yes</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { setToggle({ ...toggle, modal: false }) }} >No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {isViewModal &&
                <DeleteModal
                    message={"Do you want to Delete the marked item ? "}
                    isDelete={true}
                    closeDelete={deleteMultipleItem}
                    data={checkBoxItem()}
                    url={deleteMultipleurl}
                    className={true}
                />}
            {isViewAlert &&
                <DeleteModal
                    message={"Do You Want to Convert Quotation to Sales Invoice ?"}
                    alert={true}
                    closeDelete={closeAlertModal}
                    className={true}
                />}
        </>
    )
}
export default Invoices