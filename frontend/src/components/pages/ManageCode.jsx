import { useState, useEffect } from "react";
import axios from 'axios'
import Sidebar from "./Sidebar";
import { Link, useNavigate } from 'react-router-dom';
import { addHsn_url, addSac_url, editHsn_url, editSac_url, getHsnUrl, getSacUrl } from "../assets/apis";


const ManageCode = () => {
    const navigate = useNavigate()
    const [item, setItem] = useState({})
    const [showComponent, setShowComponent] = useState(false);
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')
    const [toggle, setToggle] = useState(false)

    const token = window.sessionStorage.getItem('token')
    const hsnid = window.sessionStorage.getItem('hsnId')
    const sacid = window.sessionStorage.getItem('sacId')
    const isHsn = window.sessionStorage.getItem('hsn')
    const companyid = window.sessionStorage.getItem('companyid')

    const id = hsnid ? hsnid : sacid

    const closeScreen = () => {
        window.sessionStorage.removeItem("hsnId")
        window.sessionStorage.removeItem("sacId")
        window.sessionStorage.removeItem("hsn")
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
        let url = isHsn ? `${addHsn_url}` : `${addSac_url}`
        const finaldata = JSON.stringify({ ...item, companyid })

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
            alert("Something went wrong")
        }
    };


    const getItem = async () => {
        let url = isHsn ? `${getHsnUrl}` : `${getSacUrl}`
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
                const { code, code_number, gst_rate, description } = response.data.data[0]
                setItem({
                    code, code_number, gst_rate, description
                })
            } else {
                console.log("err when getting code")
                manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert("something went wrong")
        }
    };


    const updateItem = async () => {
        let url = isHsn ? `${editHsn_url}` : `${editSac_url}`

        const finaldata = JSON.stringify({ ...item, companyid })
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
        setItem({ ...item, [props.target.name]: props.target.value })
    }

    const handleChangeCheckBox = (isChecked) => {
        setItem({
            ...item,
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
                                                <h3 className="ukhd mb-3">{(isHsn) ? "HSN" : "SAC"}</h3>
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
                                                                            <label>  Code Number </label>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                placeholder="Enter code number"
                                                                                name="code_number"
                                                                                value={item.code_number}
                                                                                onChange={(e) => handleChange(e)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <div className="form-group">
                                                                            <label> Code</label>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                name="code"
                                                                                placeholder="Enter Code"
                                                                                value={item.code}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-4">
                                                                        <div className="form-group">
                                                                            <label> GST Rate</label>
                                                                            <input
                                                                                type="number"
                                                                                className="form-control"
                                                                                name="gst_rate"
                                                                                placeholder="Enter GST Number"
                                                                                value={item.gst_rate}
                                                                                onChange={(e) => handleChange(e)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <div className="form-group">
                                                                            <label> Description</label>
                                                                            <textarea
                                                                                rows={1}
                                                                                defaultValue={""}
                                                                                className="form-control"
                                                                                name="description"
                                                                                placeholder=" Description"
                                                                                value={item.description}
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
export default ManageCode