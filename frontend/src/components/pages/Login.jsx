import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { login } from '../assets/apis';

const LogIn = () => {

    const navigate = useNavigate();
    const [data, setData] = useState({ email: "", password: "" })
    const [toggle, setToggle] = useState(false)
    const [err, setErr] = useState('')
    const token = sessionStorage.getItem('token')

    useEffect(() => {
        if (token) {
            navigate('/invoices')
        } else {
            navigate('/')
        }
    }, [])

    const handleChange = (props) => {
        setData({ ...data, [props.target.name]: props.target.value })

    };

    const handleSubmit = async (e) => {
        await axios({
            url: `${login}`,
            method: "POST",
            data,
        })
            .then((response) => {
                if (response.data.success) {
                    window.sessionStorage.setItem("token", response.data.user.token)
                    window.sessionStorage.setItem("userid", response.data.user.id)
                 
                    if (response.data.user.id && response.data.user.company_id) {
                        window.sessionStorage.setItem("companyid", response.data.user.company_id)
                        navigate('/invoices');
                    } else {
                        navigate('/manage-company')
                    }
                }
                else {
                    manageAlert(response.data)
                }
            })
            .catch((err) => {
                console.log("err");
                manageAlert({ type: 'err', err })
            })
    };

    const manageAlert = (props) => {
        if (props == 'close') {
            setToggle(false)
        }
        if (props.error) {
            setErr(props?.msg || props.message)
            setToggle(true)
        }
        else {
            if (props.type == 'err') {
                setErr(`Something went wrong ${props?.err}`)
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
                                    <h4>Hello! let's get started</h4>
                                    <h6 className="fw-light">Sign in to continue.</h6>
                                    <form className="pt-3" onKeyPress={(event) => (event.key === 'Enter') ? handleSubmit() : ''} >
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                className="form-control form-control-lg"
                                                id="exampleInputEmail1"
                                                placeholder="Username"
                                                name="email"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control form-control-lg"
                                                id="exampleInputPassword1"
                                                placeholder="Password"
                                                name="password"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {toggle ? <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                            {err}  <button
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
                                                SIGN IN
                                            </a>
                                        </div>
                                        <div className="my-2 d-flex justify-content-between align-items-center">
                                            <div className="form-check">
                                                <label className="form-check-label text-muted">
                                                    <input type="checkbox" className="form-check-input" />
                                                    Keep me signed in
                                                </label>
                                            </div>
                                            <Link to="/forget-password" className="auth-link text-black">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className="mb-2">
                                            <button
                                                type="button"
                                                className="btn btn-block btn-facebook auth-form-btn"
                                            >
                                                <i className="ti-facebook me-2" />
                                                Connect using facebook
                                            </button>
                                        </div>
                                        <div className="text-center mt-4 fw-light">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary" >
                                                Create
                                            </Link>
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
export default LogIn
