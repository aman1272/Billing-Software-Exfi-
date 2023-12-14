
import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


const DeleteModal = ({ message, closeDelete, logout, isDelete, data, url, alert, className = true }) => {
    const token = window.sessionStorage.getItem('token')
    const companyid = window.sessionStorage.getItem('companyid')
    const navigate = useNavigate()


    const closeDel = () => {
        if (alert) {

        } else {
            closeDelete()
        }
    }

    const submit = async () => {
        if (logout) {
            window.sessionStorage.clear(); navigate('/')
        }
        else if (isDelete) {
            try {
                const response = await axios({
                    url,
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                    data: { data, companyid }
                })
                closeDel()
            } catch (error) {
                console.error('Error fetching data:', error);
                alert("Something went wrong")
            }
        }
        else if (alert) {

        }
    }

    return (
        <div className={true ? "modal fade show d-block" : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
            <div className={`modal-dialog ${className ? "delete-modal-margin" : ""}`} role="document">
                <div className="modal-content w-100">

                    <div className="delete-modal">
                        <div className=" d-flex flex-column"  >
                            <h4 className=" d-flex flex-row justify-content-center mt-2" >{message}</h4>
                        </div>
                        <div>
                            <button type="button" className="btn btn-warning margin-between" onClick={() => { submit() }} >Yes</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { closeDel() }} >No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal