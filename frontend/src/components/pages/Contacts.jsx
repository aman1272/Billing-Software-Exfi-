import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import Sidebar from "./Sidebar";
import { getContact, getCustomers, getSuppliers, allCountContact, deleteCust, deleteSuppl, delete_multiple_contacts_url } from "../assets/apis";
import { CSVLink } from "react-csv";
import DeleteModal from "./DeleteModal";

const Contacts = () => {
    const navigate = useNavigate();

    const [contacts, setContacts] = useState([])
    const [allData, setAllData] = useState({})
    const [perPage, setPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [message, setMessage] = useState('')
    const [err, setErr] = useState(false)
    const [toggle, setToggle] = useState(false)
    const [count, setCounts] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [id, setId] = useState("");
    const [active, setActive] = useState({ all: true });
    const [isViewModal, setIsViewModal] = useState(false)
    const [type, setIsType] = useState(false)

    const token = window.sessionStorage.getItem('token')
    const companyid = window.sessionStorage.getItem('companyid')

    useEffect(() => {
        if (token) {
            getContacts()
        }
    }, []);


    useEffect(() => {
        setPage(0)
        getContacts()
    }, [perPage]);

    useEffect(() => {
        getContacts()
    }, [page]);

    useEffect(() => {
        setPage(0)
        setPerPage(10)
        getContacts()
    }, [active]);

    const deleteMultipleurl = `${delete_multiple_contacts_url}`

    const getContacts = async () => {
        let url
        url = active.all ? `${getContact}` : (active.customers) ? `${getCustomers}` : `${getSuppliers}`
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
                // setContacts(response?.data?.data)
                setAllData({ ...allData, Contacts: response?.data?.data })
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getCounts = async () => {
        let url = `${allCountContact}`
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
        let url = (type.customers) ? `${deleteCust}` : `${deleteSuppl}`
        console.log("url and type", url, type)
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
            setToggle({ ...toggle, modal: false })
            setIsType(false)
            getContacts()
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    }

    const deleteMultipleItem = async () => {
        if (isViewModal) {
            setIsViewModal(false)
            getContacts()
        } else {
            setIsViewModal(true)
        }
    }

    const addKeysAndValues = (data) => {
        const updatedData = data.map((item) => {
            let type = (item.type) ? "Supplier" : "Customer"
            const timestamp = item.created_date * 1000
            const currentDate = new Date(timestamp);
            const formattedDate = formatDate(currentDate);

            return ({
                ...item,
                check: false,
                type,
                created_date: formattedDate
            })

        }
        );
        setContacts(updatedData)
    };


    const handleSearch = (searchText) => {
        setSearchTerm(searchText);
        const filteredResults = allData?.Contacts?.filter((item) =>
            Object.values(item)?.some((value) =>
                value?.toString()?.toLowerCase()?.includes(searchText?.toLowerCase())
            )
        );
        if (!filteredResults?.length) {

            setContacts(filteredResults);

        } else {

            setContacts(filteredResults);
        }
    };

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const manageAction = (item, action) => {
        if (action == "edit") {
            if (!item.type) { window.sessionStorage.setItem("contact", { contact: true }) }
            let type = (item.type === "Customer") ? "customer" : "supplier"
            window.sessionStorage.setItem(`${[type]}`, item.id)
            navigate('/manage-contacts')
        }
        else if (action == "delete") {
            setId(item.id)
            if (item.type === "Customer") { setIsType({ customers: true }) }
            else { { setIsType({ supplier: true }) } }
            setToggle({ ...toggle, modal: true });
        }
        else if (action == "deletecheckbox") {
            console.log("delete Checkbox item")
        }
        else {
            if (item == "customer") { window.sessionStorage.setItem("iscustomer", true) }
            navigate('/manage-contacts')
        }
    }


    const manageAlert = (props) => {
        // console.log("manageAlert", props)
        // if (props == 'close') {
        //     if (!err) { getContacts() }
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


    const handleChangeCheckBox = (checked, id) => {
        if (id === "all") {
            const updatedData = contacts.map((item) => ({
                ...item,
                check: checked
            }));
            setContacts(updatedData)
        }
        else {
            const updatedData = contacts.map((item) => {
                if (item.id === id) {
                    return { ...item, check: checked };
                }
                return item;
            });
            setContacts(updatedData)
        }
    }


    const checkBoxItem = () => {
        const updatedData = contacts.filter((item) => {
            if (item.check) {
                return { id: item.id };
            }
        });

        let customerItem = []
        let supplierItem = []
        updatedData.forEach((item) => {
            if (item?.type) {
                supplierItem.push(item.id)
            } else {
                customerItem.push(item.id)
            }
        });
        return { updatedData, customerItem, supplierItem }

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

    const allCount = (count[0]?.row_count + count[1]?.row_count) ? (count[0]?.row_count + count[1]?.row_count) : 0
    const customerCount = (count[0]?.row_count) ? count[0]?.row_count : 0
    const supplierCount = (count[1]?.row_count) ? (count[1]?.row_count) : 0
    const contactsBoundary = (active.all) ? allCount : (active.customers) ? customerCount : supplierCount

    const isActive = active.all ? "contacts" : (active.customers) ? "customer" : "supplier"

    return (
        <>
            <div className="container-scroller" >
                <Sidebar name={"All Contacts"} />
                <div className={(false) ? " content-wrapper opacity-50 body-components-margin" : " content-wrapper body-components-margin"} >
                    <div className="d-flex justify-content-center margin-vertical ">
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("all") }} >
                            <div className={`${active.all ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-contact-mail"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                All Contacts
                                            </p>
                                            <h4>
                                                {allCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("customers") }} >
                            <div className={`${active.customers ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-account-group"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Customers
                                            </p>
                                            <h4 >
                                                {customerCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("supplier") }} >
                            <div className={`${active.supplier ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="mdi  mdi-bus-clock"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Suppliers
                                            </p>
                                            <h4>
                                                {supplierCount}
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
                                    <h3 className="ukhd mb-3" >{(active.all) ? "All Contacts" : (active.customers) ? "All Customers" : "All Suppliers"}</h3>
                                </div>
                                <div>{
                                    (active.all) ? "" : (active.customers) ?
                                        <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("customer")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Customer</span>
                                        :
                                        <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("supplier")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Supplier</span>

                                }
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
                                    {(!!checkBoxItem()?.updatedData?.length) && <span className="btn btn-danger btn-sm text-white mb-0 me-0 margin-between" onClick={() => { deleteMultipleItem() }} ><i className="menu-icon mdi mdi-floor-plan vsalign"></i>Delete</span>}
                                    {(active.customers || active.supplier) && <span className="btn btn-info btn-sm text-white mb-0 me-0 margin-between" onClick={() => { }} ><i className="menu-icon mdi mdi-upload vsalign"></i>Import</span>
                                    }                                    <CSVLink
                                        data={contacts}
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
                            <div className="table-responsive table-alone mt-1 ">
                                <table className="table select-table ">
                                    <thead>
                                        <tr>
                                            <th><input type="checkbox"
                                                onChange={((e) => { handleChangeCheckBox(e.target.checked, "all") })}
                                            /></th>
                                            <th>S.No.</th>
                                            <th>Contact Name</th>
                                            <th> Display Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th> Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {(!contacts.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        : (contacts?.map((item, i) => {
                                            let typeClass = (item.type) ? "order-status-pending" : "order-accept"

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
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
                                                                <h5 className="text-dark font-weight" >{item.name}</h5>
                                                            </td>
                                                            <td>
                                                                <h5 className="text-dark font-weight" >  {item.display_name}</h5>
                                                                <span className={`table-color-col bg-warning text-light font-weight`} >{item.created_date}</span>
                                                            </td>
                                                            <td>
                                                                <h6>{item.username}</h6>
                                                            </td>
                                                            <td>
                                                                <h6>{item.mobile}</h6>
                                                            </td>
                                                            <td>
                                                                <h6 className={`table-color-col font-weight ${typeClass}`} >{item.type}</h6>
                                                            </td>
                                                            <td>
                                                                <div className="" >
                                                                    <i className="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { manageAction(item, "edit") }} ></i>
                                                                    <i class="fs-20 mdi mdi-archive text-danger" onClick={() => { manageAction(item, "delete") }}  ></i>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </>
                                            )
                                        }))
                                    }

                                </table>
                                {(!!contacts.length) && <div className="custom-footer mt-3" >
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

                                    {(Math.ceil(contactsBoundary / perPage) >= ((page + perPage) / perPage) + 1) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 1)}</span>}

                                    {(Math.ceil(contactsBoundary / perPage) >= ((page + perPage) / perPage) + 2) && <span className="pagination-other"
                                        onClick={() => {
                                            const newPage = page + perPage * 2; setPage(newPage)
                                        }} >{Math.ceil(((page + perPage) / perPage) + 2)}</span>}

                                    <i className="mdi mdi-chevron-double-right pagination-button"
                                        onClick={() => {
                                            const newPage = page + perPage;
                                            if ((contactsBoundary / perPage) >= newPage) {
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
                <DeleteModal message={"Do you want to Delete the marked item ? "}
                    isDelete={true} closeDelete={deleteMultipleItem}
                    data={checkBoxItem()}
                    url={deleteMultipleurl}
                    className={true}
                />}
        </>
    )
}
export default Contacts