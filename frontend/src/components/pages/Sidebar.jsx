
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Headers from "./Headers";
import DeleteModal from "./DeleteModal";


const Sidebar = ({ children, name, updateFy }) => {
    const [toggle, setToggle] = useState({ theme: "light", activeTab: "Dashboard", delete: false })
    const [open, setClose] = useState(false)
    const navigate = useNavigate()
    const token = window.sessionStorage.getItem('token')

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    const sidebar = [{ name: "Dashboard", className: "mdi mdi-grid-large menu-icon", path: "/dashboard", },
    { name: "All Contacts", className: "menu-icon mdi mdi-account-group", path: "/contacts", },
    { name: "Products/Services", className: "menu-icon mdi mdi-account", path: "/products-services-category", },
    { name: "Taxes", className: "menu-icon mdi mdi-airballoon", path: "/taxes", },
    { name: "Invoices", className: "menu-icon mdi mdi-cart", path: "/invoices", },
    { name: "Payments Records", className: "menu-icon mdi mdi-card-text-outline", path: "", },
    { name: "Reports", className: "menu-icon mdi mdi-floor-plan", path: "", },
    { name: "Support", className: "menu-icon mdi mdi-silverware-fork-knife", path: "", },
    { name: "Profile", className: "menu-icon mdi mdi-account-circle-outline", path: "", },
    { name: "Logout", className: "menu-icon mdi mdi-logout", path: "", },]


    const manageSidebar = (item) => {
        if (item.name == "Logout") {
            setToggle({ ...toggle, delete: true })
        }
        else {
            window.sessionStorage.removeItem("contact")
            window.sessionStorage.removeItem('customer')
            window.sessionStorage.removeItem('supplier')
            window.sessionStorage.removeItem("product")
            window.sessionStorage.removeItem("categoryId")
            window.sessionStorage.removeItem("brandId")
            window.sessionStorage.removeItem("category")
            window.sessionStorage.removeItem('productId')
            window.sessionStorage.removeItem('serviceId')
            window.sessionStorage.removeItem('product')
            window.sessionStorage.removeItem("taxId")
            window.sessionStorage.removeItem('iscustomer')
            window.sessionStorage.removeItem('challanId')
            window.sessionStorage.removeItem('purchaseId')
            window.sessionStorage.removeItem("quotationId")
            window.sessionStorage.removeItem('salesId')
            window.sessionStorage.removeItem('active')
            setToggle({ ...toggle, activeTab: `${item.name}` })
        }
    }

    const handleSidebar = () => {
        setClose((prevState) => !prevState)
    }

    const closeDelete = () => {
        setToggle({ ...toggle, delete: false })
    }


    return (
        <>
            <div >
                <Headers onOpenSidebar={handleSidebar} updateFy={updateFy} />
                <div
                    className={open ? "offcanvas offcanvas-start width-fit-content  show" : "offcanvas offcanvas-start width-fit-content"}
                    tabIndex={-1}
                    id="offcanvasExample"
                    aria-labelledby="offcanvasExampleLabel"
                    role="dialog"
                    area-modal='true'
                >
                    <div className="offcanvas-body sidebar-background">
                        <nav className="sidebar sidebar-offcanvas sidebar-dark" id="sidebar">
                            <div className="offcanvas-header p-0 m-2">
                                <div className="bg-success rounded-circle p-2" >
                                    AG
                                </div>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="offcanvas"
                                    aria-label="Close"
                                    onClick={() => { handleSidebar() }}
                                />
                            </div>
                            <ul className="nav">
                                {
                                    sidebar.map((item, i) => {
                                        return (
                                            <li className={(name == item.name) ? "nav-item active" : "nav-item"} key={i}
                                                onClick={() => manageSidebar(item)}>
                                                <Link className="nav-link" to={item.path}>
                                                    <i className={item.className}></i>
                                                    <span className="menu-title">{item.name}</span>
                                                </Link>
                                            </li>
                                        )

                                    })
                                }
                            </ul>
                        </nav>
                    </div>
                </div>
                <main>{children}</main>
                {(toggle.delete) && <DeleteModal message={"Are You want to Logout ? "} logout={true} closeDelete={closeDelete} />}
            </div>
        </>
    )
}
export default Sidebar