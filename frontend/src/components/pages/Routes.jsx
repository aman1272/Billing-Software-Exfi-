import React from 'react'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import LogIn from "./Login";
import Signup from './Signup';
import ForgetPassword from './ForgetPassword';
import Sidebar from './Sidebar';
import Headers from './Headers';
import Dashboard from './Dashboard';
import Contacts from './Contacts';
import ManageContact from './ManageContact';
import ProdServCatBrands from './ProdServCatBrands';
import ManageCatAndBrands from './ManageCatAndBrand';
import ManageProdAndService from './ManageProdAndService';
import Tax from './Tax';
import ManageTax from './ManageTax';
import ManageCode from './ManageCode';
import Invoices from './Invoices';
import ManageInv from './ManageInv';
import ManageCompany from './ManageCompany';

function RoutBar() {
    return (
        <div >

            <Router>
                <Routes>
                    <Route path="/" element={<LogIn />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forget-password" element={<ForgetPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/products-services-category" element={<ProdServCatBrands />} />
                    <Route path="/taxes" element={<Tax />} />
                    <Route path="/invoices" element={<Invoices />} />

                    <Route path="/manage-contacts" element={<ManageContact />} />
                    <Route path="/manage-category" element={<ManageCatAndBrands />} />
                    <Route path="/manage-brand" element={<ManageCatAndBrands />} />
                    <Route path="/manage-product" element={<ManageProdAndService />} />
                    <Route path="/manage-service" element={<ManageProdAndService />} />
                    <Route path="/manage-tax" element={<ManageTax />} />
                    <Route path="/manage-hsn" element={<ManageCode />} />
                    <Route path="/manage-sac" element={<ManageCode />} />
                    <Route path="/manage-inv" element={<ManageInv />} />
                    <Route path="/manage-company" element={<ManageCompany />} />
                </Routes>
            </Router>
        </div>
    );
}

export default RoutBar;
