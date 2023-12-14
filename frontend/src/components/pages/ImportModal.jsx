import { useState, useEffect } from "react";
import axios from 'axios'
import { CSVLink } from "react-csv";
import {
    addBrandUrl, addCustomerUrl, addCustomer_ship_address_Url,
    addHsn_url, addProd_url, addSac_url, addServ_url, addTax_url, add_bank_url
} from "../assets/apis";
import { serviceData } from "../assets/service";

const ImportModal = ({ activeModal, toggle, closeModal }) => {

    const companyid = window.sessionStorage.getItem('companyid')
    const token = window.sessionStorage.getItem('token')

    const [file, setFile] = useState();
    const [array, setArray] = useState([]);
  
    const fileReader = new FileReader();
  
    const handleOnChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const csvFileToArray = string => {
      const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
      const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  
      const array = csvRows.map(i => {
        const values = i.split(",");
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });
  
      setArray(array);
    };
  
    const handleOnSubmit = (e) => {
      e.preventDefault();
  
      if (file) {
        fileReader.onload = function (event) {
          const text = event.target.result;
          csvFileToArray(text);
        };
  
        fileReader.readAsText(file);
      }
    };
  
    const headerKeys = Object.keys(Object.assign({}, ...array));
  



    // const addTableItem = async () => {
    //     let url = (activeModal === "Customer") ? `${addCustomerUrl}` : (activeModal === "Brand") ? `${addBrandUrl}`
    //         : (activeModal === "Tax") ? `${addTax_url}` : (activeModal === "HSN") ? `${addHsn_url}`
    //             : (activeModal === "Product") ? `${addProd_url}` : (activeModal === "Service") ? `${addServ_url}`
    //                 : (activeModal === "Shipping Address") ? `${addCustomer_ship_address_Url}` : (activeModal === "Bank")
    //                     ? `${add_bank_url}` : `${addSac_url}`

    //     const p_price_tax_inc = tableItem.p_price_tax_inc ? 1 : 0
    //     const s_price_tax_inc = tableItem.s_price_tax_inc ? 1 : 0

    //     const finaldata = JSON.stringify({ ...tableItem, companyid, name: tableItem.name, p_price_tax_inc, s_price_tax_inc, companyid })
    //     try {
    //         const response = await axios({
    //             url,
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 authorization: `Bearer ${token}`,
    //             },
    //             data: { data: finaldata }
    //         })
    //         // window.scrollTo(0, 0);
    //         console.log("response==>", response.data)
    //         if (response.data.success) {

    //         } else {
    //             window.alert(response.data.message)
    //         }

    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //         alert("Something went wrong")
    //     }
    // }


    const closeModals = () => {
        closeModal()
    }
        

    return (
        <div className={toggle ? "modal fade show d-block modal-dropdown-index " : "modal fade"} id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
            <div className="modal-dialog  modal-dialog-customize" role="document">
                <div className="modal-content">
                    <div className="modal-header pl-2 pr-0 pt-0 pb-0">
                        <h5 className="modal-title ml-2" id="exampleModalLabel">Import Data </h5>
                        <button type="button" className="close " data-dismiss="modal" aria-label="Close" onClick={() => { closeModals() }} >
                            <span style={{ fontSize: "30px" }} >&times;</span>
                        </button>
                    </div>
                    <div className="modal-body p-0 d-flex justify-content-center" >


                        <div className="col-8">
                            <div className="form-group">
                                <h3 className="mt-3 mb-3">Select File to upload</h3>
                                <input
                                    type="file"
                                    className="form-control h-100"
                                    name="common_seal"
                                    placeholder="Common Seal"
                                // onChange={(e) => handleChange(e.target.files[0], "common_seal", e)}
                                />
                                <p className="mt-2 mb-2 text-danger">* Service with Unique Phone Number will only be imported.</p>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-warning btn-sm margin-between" onClick={() => { }} >Upload</button>
                            <CSVLink
                                data={serviceData}
                                filename={`service.csv`}
                                className="btn btn-primary btn-sm text-white mb-0 me-0 margin-between"
                                target="_blank"
                            >
                              Save Demo File
                            </CSVLink>
                        <button type="button" className="btn btn-secondary btn-sm margin-between" data-dismiss="modal" onClick={() => { closeModals() }} >Close</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ImportModal