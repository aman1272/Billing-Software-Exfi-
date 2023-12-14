import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Headers from "./Headers"
import Sidebar from "./Sidebar"

const Dashboard = () => {

    return (
        <>
            <div className="container-scroller" >
                {/* <Headers /> */}
                <Sidebar name={"Dashboard"} >

                </Sidebar>
            </div>
        </>
    )
}
export default Dashboard