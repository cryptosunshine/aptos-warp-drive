import React, { useEffect, useState, lazy } from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation
} from "react-router-dom";
import Home from '../../views/Home'
import Coin from '../../views/Coins'

import PageHeader from '../Header'



const Layouts = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()
    const click = (e: any) => {
        navigate(e.key)
    }
    const location = useLocation();
    return (
        <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/coin" element={<Coin></Coin>} />
        </Routes>

    );
}

export default Layouts;
