import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { signup } from '../assets/apis';

const Signup = () => {

    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "", mobile: "", name: "", confirm_password: "" })
    const [toggle, setToggle] = useState(false)
    const [err, setErr] = useState(false)
    const [message, setMessage] = useState('')


    const handleChange = (props) => {
        setData({ ...data, [props.target.name]: props.target.value })

    };

    const handleSubmit = async (e) => {
        const sendingData = JSON.stringify(data)
        await axios({
            url: `${signup}`,
            method: "POST",
            data: { data: sendingData },
        })
            .then((response) => {
                if (response.data.success) {
                    setData({ email: "", password: "", mobile: "", name: "", confirm_password: "" })
                    manageAlert(response.data)
                }
                else {
                    manageAlert(response.data)
                }
            })
            .catch((err) => {
                console.error("err", err);
                alert("Something went wrong")
            })
    };

    const manageAlert = (props) => {
        if (props == 'close') {
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
        else {
            if (props.type == 'err') {
                setErr(true)
                setMessage(`Something went wrong ${props?.err}`)
                setToggle(true)
            }
            return
        }
    }

    return (
        <>
            <div className="container-scroller" >
                <div className="container-fluid page-body-wrapper full-page-wrapper">
                    <div className="content-wrapper d-flex align-items-center auth px-0">
                        <div className="row w-100 mx-0">
                            <div className="col-lg-4 mx-auto">
                                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                                    <div className="brand-logo">
                                        {/* <img src="http://www.w3.org/2000/svg" alt='logo' /> */}  <h3>EXFI</h3>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <h3>Sign Up</h3>
                                            <Link className="p-2 mb-2 bg-warning text-dark rounded" to="/" >
                                                SIGN IN
                                            </Link>
                                        </div>
                                    </div>
                                    <form className="pt-3" onKeyPress={(event) => (event.key === 'Enter') ? handleSubmit() : ''} >
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control form-control-lg"
                                                placeholder="Name"
                                                name="name"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                className="form-control form-control-lg"
                                                placeholder="Username"
                                                name="email"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control form-control-lg"
                                                placeholder="Mobile"
                                                name="mobile"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                placeholder="Password"
                                                name="password"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                name="confirm_password"
                                                placeholder="Confirm Password"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {(data?.confirm_password?.length > 0 && data?.confirm_password !== data.password) ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                            Password not matched with Confirm Password
                                        </div> : ""}
                                        {toggle ? <div className={`alert ${err ? "alert-warning" : "alert-success"} alert-dismissible fade show`} role="alert">
                                            {message}  <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="offcanvas"
                                                aria-label="Close"
                                                onClick={() => { manageAlert('close') }}
                                            />
                                        </div> : ""}
                                        <div className="mt-3"  >
                                            <a
                                                className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                                onClick={handleSubmit}
                                            >
                                                Create Account
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>

    )
}
export default Signup
