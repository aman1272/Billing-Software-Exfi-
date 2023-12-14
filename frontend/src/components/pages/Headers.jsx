import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { getComp_url, editComp_url } from "../assets/apis";


const Headers = ({ onOpenSidebar, updateFy }) => {
    const fy = Number(window.sessionStorage.getItem('fy'))
    const companyid = window.sessionStorage.getItem('companyid')
    const token = window.sessionStorage.getItem('token')

    const navigate = useNavigate();

    const [toggle, setToggle] = useState({ theme: "light", activeTab: "Dashboard" })
    const [header, setHeader] = useState({ message: false, notification: false, profile: false })
    const [financeYear, setFinanceYear] = useState(fy)

    useEffect(() => {
        if (companyid && token) {
            getCompany()
        }

    }, [])


    useEffect(() => {
        if (token && !financeYear && companyid) {
            const timeoutId = setTimeout(() => {
                window.alert("Please Select Financial Year")
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [financeYear])

    const getCompany = async () => {
        // console.log("getting company")
        let url = `${getComp_url}`
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    id: companyid,
                    fy: true,
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                }
            })
            if (response.data.success) {
                const finacial_year = Number(response.data.data[0].finacial_year)
                window.sessionStorage.setItem("fy", finacial_year)
                setFinanceYear(finacial_year)
            } else {
                console.log("err when getting company")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("something went wrong")
        }
    };


    const updateFY = async (newVal) => {
        let url = `${editComp_url}`
        try {
            if (financeYear) {
                const response = await axios({
                    url,
                    method: "PUT",
                    headers: {
                        id: companyid,
                        fy: true,
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    data: JSON.stringify({ data: newVal })
                })
                if (response.data.success) {
                    console.log("update fy", newVal)
                    window.sessionStorage.setItem("fy", newVal)
                    updateFy()
                    setFinanceYear(newVal)
                } else {
                    console.log("err when getting company")
                }
            } else {
                return
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("something went wrong")
        }
    };


    const manageToggle = (props) => {
        if (props) {
            setToggle(props)
        }
        else {
            onOpenSidebar()
        }
    }

    const signOut = () => {
        window.sessionStorage.clear()
        navigate('/')
    }

    const d = new Date();
    let year = Number(d.getFullYear());

    const handleChange = (value) => {
        const newVal = Number(value)
        setFinanceYear(newVal)
        if (companyid && token) {
            updateFY(newVal)
        }
    }


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

    return (
        <>
            <nav className={`navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row header-background ${toggle.headTheme}`}>
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start header-background ">
                    <div className="me-3">
                        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-bs-toggle="minimize" >
                            <span className="icon-menu" onClick={() => { manageToggle() }} ></span>
                        </button>
                    </div>
                    <div>
                        <Link className="navbar-brand brand-logo" to="/dashboard">
                            <h3>BillingApp</h3>
                        </Link>
                    </div>
                </div>
                <div className="navbar-menu-wrapper header-background d-flex align-items-top">
                    {/* <ul className="navbar-nav">
                        <li className="nav-item font-weight-semibold d-none d-lg-block ms-0">
                            <h1 className="welcome-text">Namaste <span className="text-black fw-bold">{name}</span></h1>
                            <h3 className="welcome-sub-text">Your performance summary this week </h3>
                        </li>
                    </ul>  */}
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown" onClick={() => { }} >
                            <a className={header.bell ? "nav-link count-indicator show" : "nav-link count-indicator"} id="countDropdown" href="#" data-bs-toggle="dropdown"
                                aria-expanded={header.bell ? "true" : "false"}>
                                <i className="icon-bell"></i>
                                <span className="count"></span>
                            </a>
                        </li>
                        <li onClick={() => { }} >
                            <div className="select-container ">
                                <select className="dropdown-header" placeholder="Choose Financial Year" onChange={(e) => handleChange(e.target.value)} >
                                    <option value={year} className="bg-warning" selected>{(!financeYear) ? "Choose Financial Year" : `1 Apr ${financeYear} to 31 Mar ${financeYear + 1}`}</option>
                                    {options.map((option) => (
                                        <option value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="nav-item dropdown " onClick={() => { }} >
                            <i className="mdi mdi-settings font-size"></i>
                        </li>
                        <li className="nav-item dropdown margin-between" onClick={() => { }} >
                            <div className="bg-light text-dark rounded-circle p-2" >
                                AG
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )

}
export default Headers