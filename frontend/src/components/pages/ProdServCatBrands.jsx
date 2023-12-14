import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import Sidebar from "./Sidebar";
import { allItemCount, changeBrandStatusUrl, changeCategoryStatusUrl, deleteBrandUrl, deleteCategoryUrl, deleteProdUrl, deleteServUrl, delete_multiple_brand_url, delete_multiple_categ_url, delete_multiple_prod_url, delete_multiple_service_url, getBrands_url, getCategories_url, getProd_url, getServ_url } from "../assets/apis";
import { CSVLink } from "react-csv";
import DeleteModal from "./DeleteModal";
import ImportModal from "./ImportModal";


const ProdServCatBrands = () => {
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
    const [active, setActive] = useState({ category: true });
    const [isViewModal, setIsViewModal] = useState(false)
    const [isImport, setIsImport] = useState(false)

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

    let deleteMultipleurl = active.category ? `${delete_multiple_categ_url}` : (active.product) ? `${delete_multiple_prod_url}` : (active.service) ? `${delete_multiple_service_url}` : `${delete_multiple_brand_url}`


    const getItems = async () => {
        let url
        url = active.category ? `${getCategories_url}` : (active.product) ? `${getProd_url}` : (active.service) ? `${getServ_url} ` : `${getBrands_url}`
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
                setAllData({ ...allData, Items: response?.data?.data })
            } else {
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("Something went wrong")
        }
    };


    const getCounts = async () => {
        let url = `${allItemCount}`
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
        let url = active.category ? `${deleteCategoryUrl}` : (active.product) ? `${deleteProdUrl}` : (active.service) ? `${deleteServUrl}` : `${deleteBrandUrl}`
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

    const changeStatus = async (item) => {
        let url = (active.category) ? `${changeCategoryStatusUrl}` : `${changeBrandStatusUrl}`
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


    const addKeysAndValues = (data) => {
        const updatedData = data.map((item) => {

            let status = Number(item.status) ? true : false
            const timestamp = item.created_date * 1000
            const currentDate = new Date(timestamp);
            const formattedDate = formatDate(currentDate);

            return {
                ...item,
                check: false,
                created_date: formattedDate,
                status
            }
        });
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
            let name = active.category ? "categoryId" : active.product ? "productId" : active.brand ? "brandId" : "serviceId"
            window.sessionStorage.setItem(`${[name]}`, item.id)
            if (active.category || active.brand) {
                if (active.category) {
                    window.sessionStorage.setItem('category', true)
                    navigate('/manage-category')
                }
                else {
                    navigate('/manage-brand')
                }
            } else {
                if (active.product) {
                    window.sessionStorage.setItem('product', true)
                    navigate('/manage-product')
                }
                else {
                    navigate('/manage-service')
                }
            }

        }
        else if (action == "delete") {
            setId(item.id)
            setToggle({ ...toggle, modal: true });
        }
        else {
            if (item === "category" || item === "brand") {
                if (active.category) {
                    window.sessionStorage.setItem('category', true)
                    navigate('/manage-category')
                }
                else {
                    navigate('/manage-brand')
                }
            }
            else {
                if (active.product) {
                    window.sessionStorage.setItem('product', true)
                    navigate('/manage-product')
                }
                else {
                    navigate('/manage-service')
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


    const closeModal = () => {
        if (isImport) {
            setIsImport(false)
        }
        else {
            setIsImport(true)
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
    console.log("deleteMultiple", checkBoxItem())


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

    const categoryCount = (count[0]?.row_count) ? count[0]?.row_count : 0
    const brandCount = (count[1]?.row_count) ? count[1]?.row_count : 0
    const productCount = (count[2]?.row_count) ? count[2]?.row_count : 0
    const serviceCount = (count[3]?.row_count) ? (count[3]?.row_count) : 0
    const itemBoundary = (active.category) ? categoryCount : (active.product) ? productCount : (active.brand) ? brandCount : serviceCount

    const isActive = active.category ? `categories` : (active.product) ? `products` : (active.service) ? `services` : `brands`


    return (
        <>
            <div className="container-scroller" >
                <Sidebar name={"Products/Services"} />
                <div className={(false) ? " content-wrapper opacity-50 body-components-margin" : " content-wrapper body-components-margin"} >
                    <div className="d-flex justify-content-center margin-vertical ">
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("category") }} >
                            <div className={`${active.category ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-contact-mail"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Categories
                                            </p>
                                            <h4>
                                                {categoryCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("brand") }} >
                            <div className={`${active.brand ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-briefcase-check"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Brands
                                            </p>
                                            <h4>
                                                {brandCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("product") }} >
                            <div className={`${active.product ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="menu-icon mdi mdi-account-group"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Products
                                            </p>
                                            <h4 >
                                                {productCount}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-lg-3 grid-margin margin-between" onClick={() => { manageActive("service") }} >
                            <div className={`${active.service ? "active" : ""} card card-rounded`}>
                                <div className="card-body cursor">
                                    <div className="d-flex justify-content-center">
                                        <i className="mdi  mdi-bus-clock"></i>
                                        <div className="wrapper ms-3">
                                            <p className="mb-2 fw-bold">
                                                Services
                                            </p>
                                            <h4>
                                                {serviceCount}
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
                                    <h3 className="ukhd mb-3" >All {(active.category) ? "Categories" : (active.product) ? "Products" : (active.brand) ? "Brands" : "Services"}</h3>
                                </div>
                                <div>
                                    {(active.category) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("category")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Category</span>}
                                    {(active.brand) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("brand")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Brand</span>}
                                    {(active.product) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("product")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Product</span>}
                                    {(active.service) && <span class="btn btn-warning btn-sm text-black mb-0 me-0" onClick={() => manageAction("service")} ><i class="menu-icon mdi mdi-floor-plan vsalign"></i>Add Service</span>}
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
                                    {(active.service || active.product) && <span className="btn btn-info btn-sm text-white mb-0 me-0 margin-between" onClick={() => { closeModal() }} ><i className="menu-icon mdi mdi-upload vsalign"></i>Import</span>
                                    }                                    <CSVLink
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

                                        {(active.category || active.brand) ?

                                            <tr>
                                                <th><input type="checkbox"
                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked, "all") })}
                                                /></th>
                                                <th>S.No.</th>
                                                <th>{(active.category) ? "Category" : "Brand"} Name</th>
                                                <th> Status</th>
                                                <th>Action</th>
                                            </tr>


                                            :
                                            <tr>
                                                <th><input type="checkbox"
                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked, "all") })}
                                                /></th>
                                                <th>S.No.</th>
                                                <th>Item Name</th>
                                                <th>Category</th>
                                                <th>Brand</th>
                                                <th> Qty</th>
                                                <th>Price</th>
                                                <th> UOM</th>
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
                                            let typeClass = (item.status == 1) ? "order-accept" : "order-status-pending"


                                            return (
                                                <>
                                                    <tbody className="border-table-row " >
                                                        {
                                                            (active.category || active.brand) ?
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
                                                                        <div className="form-group togglecss">
                                                                            <div
                                                                                className={`button r ${(item.status) ? "active" : ""
                                                                                    }`}
                                                                                id="button-1"
                                                                                onClick={() => changeStatus(item)}
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="checkbox"
                                                                                    name="status"
                                                                                    checked={item.status}
                                                                                />
                                                                                <div className="knobs"></div>
                                                                                <div className="layer"></div>
                                                                            </div>
                                                                        </div>
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
                                                                        <h5 className="text-dark font-weight" >{item.name}</h5>
                                                                        <span className={`table-color-col bg-warning text-light font-weight`} >{item.created_date}</span>

                                                                    </td>
                                                                    <td>
                                                                        <h5 className="text-dark font-weight" >  {item.category}</h5>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{item.brand}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6  >{item.opening_qty}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6>{currency}{item.mrp_price}</h6>
                                                                    </td>
                                                                    <td>
                                                                        <h6 className={`table-color-col font-weight ${typeClass}`} >{item?.uom}</h6>
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
            <ImportModal activeModal={active} toggle={isImport} closeModal={closeModal} />
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
export default ProdServCatBrands