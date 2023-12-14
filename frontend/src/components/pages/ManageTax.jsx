import { useState, useEffect } from "react";
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { addTax_url, editTax_url, getTaxUrl } from "../assets/apis";


const ManageTax = () => {
    const navigate = useNavigate()
    const [tax, setCategory] = useState({ name: "", percentage: "", status: "" })
    const [showComponent, setShowComponent] = useState(false);
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')
    const [toggle, setToggle] = useState(false)

    const token = window.sessionStorage.getItem('token')
    const id = window.sessionStorage.getItem('taxId')
    const companyid = window.sessionStorage.getItem('companyid')

    const closeScreen = () => {
        window.sessionStorage.removeItem("taxId")
        navigate("/taxes")
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowComponent(true);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);


    useEffect(() => {
        if (id && token) { getItem({ id }) }
    }, [id]);


    const addItem = async () => {
        let url = `${addTax_url}`
        const status = tax.status ? 1 : 0
        const finaldata = JSON.stringify({ ...tax, status, companyid })

        try {
            const response = await axios({
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                data: { data: finaldata, companyid }
            })
            window.scrollTo(0, 0);
            manageAlert(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };


    const getItem = async () => {
        let url = `${getTaxUrl}`
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
                console.log("getting data", response.data)
                const { name, status, percentage } = response.data.data[0]
                setCategory({
                    name, status: Number(status), percentage
                })
            } else {
                console.log("err when getting tax/brand")
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("something went wrong")
        }
    };


    const updateItem = async () => {
        let url = `${editTax_url}`
        const status = tax.status ? 1 : 0
        const finaldata = JSON.stringify({ ...tax, status, companyid })
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
            updateItem()
        } else {
            addItem()
        }
    }

    const handleChange = (props) => {
        setCategory({ ...tax, [props.target.name]: props.target.value })
    }

    const handleChangeCheckBox = (isChecked) => {
        setCategory({
            ...tax,
            status: isChecked
        })
    }

    return (
        <>
            {
                showComponent ?
                    <div className="container-scroller body-components-margin" >
                        <Sidebar name={"Taxes"}>
                            <div className="main-panel">
                                <div className="content-wrapper  ">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex justify-content-between m-1 p-1 align-items-baseline " >
                                                <h3 className="ukhd mb-3">Tax</h3>
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
                                                                    <div className="col-4">
                                                                        <div className="form-group">
                                                                            <label>  Name </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder=" Name"
                                                                                name="name"
                                                                                value={tax.name}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 ">
                                                                        <div className="form-group togglecss">
                                                                            <label className="" >Status</label>
                                                                            <div
                                                                                className={`button  r ${(tax?.status || 0) ? "active" : ""
                                                                                    }`}
                                                                                id="button-1"
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="checkbox"
                                                                                    name="status"
                                                                                    checked={tax?.status || 0}
                                                                                    onChange={((e) => { handleChangeCheckBox(e.target.checked) })} />
                                                                                <div className="knobs"></div>
                                                                                <div className="layer"></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <div className="form-group">
                                                                            <label> Tax Percentage</label>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                name="percentage"
                                                                                placeholder="Enter Percentage"
                                                                                value={tax.percentage}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
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
                            </div>
                        </Sidebar>
                    </div>
                    : <div class="text-center mt-5">
                        <div class="spinner-border" role="status">
                        </div>
                    </div>}
        </>
    )
}
export default ManageTax