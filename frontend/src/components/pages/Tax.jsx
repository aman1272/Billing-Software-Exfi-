import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import Sidebar from "./Sidebar";
import { allTaxCountUrl, deleteHsnUrl, deleteSacUrl, deleteTaxUrl, delete_multiple_hsn_url, delete_multiple_sac_url, delete_multiple_tax_url, getHsnUrl, getSacUrl, getTaxUrl, updateTaxStatus } from "../assets/apis";
import { CSVLink } from "react-csv";
import DeleteModal from "./DeleteModal";

const Tax = () => {
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
    const [active, setActive] = useState({ tax: true });
    const [isViewModal, setIsViewModal] = useState(false)

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
        if (token) {
            getItems()
        }
    }, [page]);

    useEffect(() => {
        if (token) {
            setPage(0)
            setPerPage(10)
            getItems()
        }
    }, [active]);

    const deleteMultipleurl = active.tax ? `${delete_multiple_tax_url}` : (active.hsn) ? `${delete_multiple_hsn_url}` : `${delete_multiple_sac_url}`


    const getItems = async () => {
        let url
        url = active.tax ? `${getTaxUrl}` : (active.hsn) ? `${getHsnUrl}` : `${getSacUrl}`
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
                setAllData({ ...allData, Items: response?.data?.data })
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };


    const getCounts = async () => {
        let url = `${allTaxCountUrl}`
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
            window.alert("Something went wrong")
        }
    };


    const deleteItem = async () => {
        let url = active.tax ? `${deleteTaxUrl}` : (active.hsn) ? `${deleteHsnUrl}` : `${deleteSacUrl}`
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
            window.alert("Something went wrong")
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

    const changeStatus = async (item) => {
        let url = `${updateTaxStatus}`
        let status = item.status ? 0 : 1
        try {
            await axios({
                url,
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: item.id,
                    companyid
                },
                data: { status }
            })
            // window.scrollTo(0, 0);
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

    const handlePerPage = (value) => {
        const limit = Number(value); if (limit !== perPage) { setPerPage(limit) }
    }

    const manageAction = (item, action) => {
        console.log("delete in manage action----id", action, item.id)
        if (action == "edit") {
            let name = active.tax ? "taxId" : active.hsn ? "hsnId" : "sacId"
            window.sessionStorage.setItem(`${[name]}`, item.id)
            if (active.tax) {
                navigate('/manage-tax')
            }
            else {
                if (active.hsn) {
                    window.sessionStorage.setItem('hsn', true)
                    navigate('/manage-hsn')
                }
                else {
                    navigate('/manage-sac')
                }
            }

        }
        else if (action == "delete") {
            setId(item.id)
            setToggle({ ...toggle, modal: true });
        }
        else {
            if (item === "tax") {
                navigate('/manage-tax')
            }
            else {
                if (active.hsn) {
                    window.sessionStorage.setItem('hsn', true)
                    navigate('/manage-hsn')
                }
                else {
                    navigate('/manage-sac')
                }
            }
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
    console.log("checkboxItem", checkBoxItem())

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

    const taxCount = (count[0]?.row_count) ? count[0]?.row_count : 0
    const hsnCount = (count[1]?.row_count) ? count[1]?.row_count : 0
    const sacCount = (count[2]?.row_count) ? count[2]?.row_count : 0
    const itemBoundary = (active.tax) ? taxCount : (active.sac) ? sacCount : hsnCount

    const isActive = active.tax ? `tax` : (active.hsn) ? `hsn` : `sac`


    return (
        <>
            <div className="container-scroller" >
                <Sidebar name={"Taxes"} />
                <div className={(false) ? " content-wrapper opacity-50 body-components-margin" : " content-wrapper body-components-margin"} >
                    <div className="d-flex justify-content-center margin-vertical ">
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("tax") }} >
                            <div className={`${active.tax ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-contact-mail"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Tax
                                            </p>
                                            <h4>
                                                {taxCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("hsn") }} >
                            <div className={`${active.hsn ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-briefcase-check"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                HSN
                                            </p>
                                            <h4>
                                                {hsnCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("sac") }} >
                            <div className={`${active.sac ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-account-group"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                SAC
                                            </p>
                                            <h4 >
                                                {sacCount}
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
                                    <h3 className="ukhd mb-3" >All {(active.tax) ? "Taxes" : (active.hsn) ? " HSN code" : "SAC code"}</h3>
                                </div>
                                <div>
                                    {(active.tax) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("tax")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Tax</span>}
                                    {(active.hsn) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("hsn")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add HSN</span>}
                                    {(active.sac) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("sac")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add SAC</span>}
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
                            <div className="table-responsive table-alone mt-1 ">
                                <table className="table select-table ">
                                    <thead>

                                        {(active.tax) ?

                                            <tr>
                                                <th><input type="checkbox"
                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked, "all") })}
                                                /></th>
                                                <th>S.No.</th>
                                                <th> Name</th>
                                                <th> Status</th>
                                                <th> Percentage</th>
                                                <th>Action</th>
                                            </tr>


                                            :
                                            <tr>
                                                <th><input type="checkbox"
                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked, "all") })}
                                                /></th>
                                                <th>S.No.</th>
                                                <th>Code Number</th>
                                                <th> 4 digit Code</th>
                                                <th className="w-25" >Description</th>
                                                <th> Tax </th>
                                                <th>Action</th>
                                            </tr>
                                        }

                                    </thead>
                                    {(!items.length) ? <tr>
                                        <td colSpan="7" className="text-center">
                                            No data found
                                        </td>
                                    </tr>
                                        : (items?.map((item, i) => {
                                            let status = (item.status == 1) ? "Active" : "Inactive"
                                            let typeClass = (item.status == 1) ? "order-accept" : "order-status-pending"

                                            const timestamp = item.created_date * 1000
                                            const currentDate = new Date(timestamp);
                                            const formattedDate = formatDate(currentDate);

                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        {
                                                            (active.tax) ?
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
                                                                        <span className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</span>
                                                                    </td>
                                                                    <td>
                                                                        <div className="form-group togglecss">
                                                                            <div
                                                                                className={`button r ${(item?.status || 0) ? "active" : ""
                                                                                    }`}
                                                                                id="button-1"
                                                                                onClick={() => changeStatus(item)}
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="checkbox"
                                                                                    name="status"
                                                                                    checked={item?.status || 0}
                                                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked) })} />
                                                                                <div className="knobs"></div>
                                                                                <div className="layer"></div>
                                                                            </div>
                                                                        </div>                                                                    </td>
                                                                    <td>
                                                                        {(!!item.percentage) && <h6 className={`text-dark font-weight`} >{item.percentage}%</h6>}
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
                                                                        <h5 className="text-dark font-weight" >{item.code_number}</h5>
                                                                        <span className={`table-color-col bg-warning text-light font-weight`} >{formattedDate}</span>

                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-dark font-weight" >  {item.code}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{item.description}</h6>
                                                                    </td>
                                                                    <td>
                                                                        {(!!item.gst_rate) && <h6  >{item.gst_rate}%</h6>}
                                                                    </td>
                                                                    <td>
                                                                        <div className="" >
                                                                            {/* <i className="fs-20 mdi mdi-printer text-success" onClick={() => { }} ></i> */}
                                                                            <i className="fs-20 mdi mdi-content-save-edit-outline text-success" onClick={() => { manageAction(item, "edit") }} ></i>
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
                <DeleteModal message={"Do you want to Delete the marked item ? "}
                    isDelete={true} closeDelete={deleteMultipleItem}
                    data={checkBoxItem()}
                    url={deleteMultipleurl}
                    className={true}
                />}
        </>
    )
}
export default Tax