import { useState, useEffect } from "react"
import '../../App.css'
import axios from 'axios'
import { getComp_url, getCustomers, getSuppliers } from "../assets/apis"

const Preview = ({ data, quotationid, purchaseid, salesid }) => {

    const token = window.sessionStorage.getItem('token')
    const companyid = window.sessionStorage.getItem('companyid')
    // const id = window.sessionStorage.getItem('salesItemid')

    const [companyData, setCompanyData] = useState({})
    const [userData, setUsersData] = useState({})

    const currency = " ₹"

    const id = quotationid ? quotationid : (purchaseid ? purchaseid : salesid)

    useEffect(() => {
        getCompany()
        if (id) {
            getUser()
        }
    }, [])

    useEffect(() => {
        if (id) {
            getUser()
        }
    }, [id])

    // console.log("id", id)

    const getCompany = async () => {
        let url = `${getComp_url}`

        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    id: companyid
                }
            })
            if (response?.data?.success) {

                setCompanyData(response?.data?.data[0])

            } else {
                console.log("error when getting data of company in preview")
                // manageAlert(response.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };

    const getUser = async () => {
        let url = purchaseid ? `${getSuppliers}` : `${getCustomers}`
        // console.log("user url", url)
        try {
            const response = await axios({
                url,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                    companyid,
                    id
                }
            })
            if (response?.data?.success) {
                setUsersData(response?.data?.data[0])
            } else {
                console.log("error when getting data of customers in preview")
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            window.alert("Something went wrong")
        }
    };

    // console.log("company", companyData)

    return (
        <>
            <div className="receipt-content">
                <div className="container bootstrap snippets bootdey">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="invoice-wrapper">
                                {/* <div className="intro">
                                    Hi <strong>John McClane</strong>,
                                    <br />
                                    This is the receipt for a payment of <strong>$312.00</strong> (USD)
                                    for your works
                                </div> */}
                                <div className="payment-info">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <span>{` ${quotationid ? "Quotation" : purchaseid ? "Purchase Inv" : "Sales Inv"} `} No.</span>
                                            <strong>434334343</strong>
                                        </div>
                                        <div className="col-sm-6 text-right">
                                            <span> Date</span>
                                            <strong>Jul 09, 2014 - 12:20 pm</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="payment-details">
                                    <div className="row">
                                        <div className={`${purchaseid ? "col-6" : "col-4"}`}>
                                            <strong>{` ${!purchaseid ? "Bussiness" : "Company Detail"} `}</strong><br />
                                            <h4>{companyData.company_name}</h4>
                                            <p>
                                                {companyData.address}<br />
                                                {companyData.city} <br />
                                                {companyData.state} <br />
                                                {companyData.country} <br />
                                                {companyData.pin} <br />
                                                Phone: {companyData.phone} <br />
                                                Email: {companyData.email}<br />
                                                Website: {companyData.website} <br />
                                                GSTIN: {companyData.pin} <br />
                                            </p>
                                        </div>
                                        <div className={`${purchaseid ? "col-6" : "col-4"}`}>
                                            <strong>{` ${!purchaseid ? "Bill To" : "Supplier Details"} `}</strong><br />
                                            <h4>{userData.name}</h4>
                                            <p>
                                                {userData.billing_address}<br />
                                                {userData.billing_city}<br />
                                                {userData.billing_state}<br />
                                                {userData.billing_pincode}<br />
                                                {userData.billing_country} <br />
                                                Phone: {userData.mobile} <br />
                                                Email: {userData.username}
                                            </p>
                                        </div>
                                        <div className={`${purchaseid ? "col-6" : "col-4"}`}>
                                            {(!!purchaseid == false) && <>
                                                <strong>Ship To</strong><br />
                                                <h4>{userData.shipping_contact_name}</h4>
                                                <p>
                                                    {userData.shiping_address}<br />
                                                    {userData.shiping_city}<br />
                                                    {userData.shiping_state}<br />
                                                    {userData.shiping_country} <br />
                                                    {userData.shiping_pincode}<br />
                                                    Phone: {userData.shiping_mobile} <br />
                                                    Email: {userData.shiping_email}
                                                </p>
                                            </>}

                                        </div>
                                    </div>
                                </div>
                                {/* <div className="line-items">
                                    <div className="headers clearfix">
                                        <div className="row">
                                            <div className="col-xs-4">Description</div>
                                            <div className="col-xs-3">Quantity</div>
                                            <div className="col-xs-5 text-right">Amount</div>
                                        </div>
                                    </div>
                                    <div className="items">
                                        <div className="row item">
                                            <div className="col-xs-4 desc">Html theme</div>
                                            <div className="col-xs-3 qty">3</div>
                                            <div className="col-xs-5 amount text-right">$60.00</div>
                                        </div>
                                        <div className="row item">
                                            <div className="col-xs-4 desc">Bootstrap snippet</div>
                                            <div className="col-xs-3 qty">1</div>
                                            <div className="col-xs-5 amount text-right">$20.00</div>
                                        </div>
                                        <div className="row item">
                                            <div className="col-xs-4 desc">Snippets on bootdey</div>
                                            <div className="col-xs-3 qty">2</div>
                                            <div className="col-xs-5 amount text-right">$18.00</div>
                                        </div>
                                    </div>
                                    <div className="total text-right">
                                        <p className="extra-notes">
                                            <strong>Extra Notes</strong>
                                            Please send all items at the same time to shipping address by
                                            next week. Thanks a lot.
                                        </p>
                                        <div className="field">
                                            Subtotal <span>$379.00</span>
                                        </div>
                                        <div className="field">
                                            Shipping <span>$0.00</span>
                                        </div>
                                        <div className="field">
                                            Discount <span>4.5%</span>
                                        </div>
                                        <div className="field grand-total">
                                            Total <span>$312.00</span>
                                        </div>
                                    </div>

                                </div> */}
                                <div className="use-border">
                                    <div className="row">
                                        <div className=" col-6" >
                                            Total Amount in words
                                        </div>
                                        <div className=" col-6" >
                                            <div className="heading-inv-bill w-100 p-1" >
                                                <label className="margin-between col-4  " >Details </label>
                                                <label className="margin-between row-inv-float" >Amount </label>
                                            </div>
                                            {(quotationid) &&
                                                <>
                                                    <div className=" row-inv-bill w-100  mt-2">
                                                        <label className="margin-between col-4" >CGST</label>
                                                        <label className="margin-between row-inv-float" >{currency}{0}</label>
                                                    </div>
                                                    <div className=" row-inv-bill w-100 mt-2">
                                                        <label className="margin-between col-4" >SGST </label>
                                                        <label className="margin-between row-inv-float" >{currency}{0} </label>
                                                    </div>
                                                </>}
                                            <div className="row-inv-bill w-100 mt-2">
                                                <label className="margin-between col-4" >Total tax </label>
                                                <label className="margin-between row-inv-float" >{currency}{0} </label>
                                            </div>
                                            <div className=" row-inv-bill w-100 mt-2">
                                                <label className="margin-between col-4" >Sub-total </label>
                                                <label className="margin-between row-inv-float" >{currency}{0}</label>
                                            </div>
                                            <div className=" row-inv-bill w-100 mt-2">
                                                <label className="margin-between col-4" >Grand Total </label>
                                                <label className="margin-between row-inv-float" >{currency}{0} </label>
                                            </div>
                                            {(!quotationid) &&
                                                <>
                                                    <div className=" row-inv-bill w-100 mt-2">
                                                        <label className="margin-between col-4" >Amount Paid </label>
                                                        <label className="margin-between row-inv-float" >{currency}{0}</label>
                                                    </div>
                                                    <div className=" row-inv-bill w-100 mt-2">
                                                        <label className="margin-between col-4" >Amount Due </label>
                                                        <label className="margin-between row-inv-float" >{currency}{0} </label>
                                                    </div>
                                                </>}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="d-flex justify-content-center mb-4 " >
                                    {(quotationid) &&
                                        <>
                                            <div className="  row-border mt-2">
                                                <label className="margin-between col-12" >CGST </label>
                                                <label className="margin-between " >{currency}0 </label>
                                            </div>
                                            <div className="  row-border mt-2">
                                                <label className="margin-between col-12" >SGST</label>
                                                <label className="margin-between " >{currency}{0}</label>
                                            </div>
                                        </>
                                    }
                                    <div className=" row-border mt-2">
                                        <label className="margin-between col-12" >Total tax </label>
                                        <label className="margin-between " >{currency}{0} </label>
                                    </div>
                                    <div className="  row-border mt-2">
                                        <label className="margin-between col-12" >Sub-total </label>
                                        <label className="margin-between " >{currency}{0} </label>
                                    </div>
                                    <div className="  row-border mt-2">
                                        <label className="margin-between col-12" >Grand Total </label>
                                        <label className="margin-between " >{currency}{0} </label>
                                    </div>
                                    {(!quotationid) &&
                                        <>
                                            <div className="  row-border mt-2">
                                                <label className="margin-between col-12" >Amount Paid </label>
                                                <label className="margin-between " >{currency}{0}  </label>
                                            </div>
                                            <div className="  row-border mt-2">
                                                <label className="margin-between col-12" >Amount Due </label>
                                                <label className="margin-between " >{currency}{0} </label>
                                            </div>
                                        </>
                                    }
                                </div> */}
                                <div className="line-items">
                                    <div className="row">
                                        <div className="col-4">
                                            <strong>Note</strong>
                                            <p>
                                                {/* {companyData.address}<br /> */}
                                            </p>
                                        </div>
                                        <div className="col-4">
                                            <strong>Common Seal</strong>

                                        </div>
                                        <div className="col-4 text-right">
                                            <strong>For {companyData.company_name}</strong><br />
                                            <span>Authorised Signatory</span>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="footer">Copyright © 2014. company name</div> */}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Preview