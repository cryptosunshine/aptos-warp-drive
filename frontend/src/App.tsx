import React, { useEffect, useState, lazy, useReducer } from 'react'
import {
    BrowserRouter as Router,
} from "react-router-dom";
import Layouts from './components/Layout'
import AppProviders from './contexts'
import './App.css';


const App = () => {
    return (
        <AppProviders>
            <Router>
                <Layouts></Layouts>
            </Router>
        </AppProviders>

    );
}

export default App;
