import React from "react";
import SideNav from "./components/side-nav-component/side-nav-component";
import { Route, Routes } from 'react-router-dom';
import Dashboard from "./components/dashboad-component/dashboard-component";
import Reservations from './components/reservation-component/reservation-component';
import Header from "./components/header-component/header-component";

require('./styles/main.scss');

export default function App() {
    return(
        <div className="app-container">
            <div className="side-wrapper">
                    <SideNav />
            </div>
            <div className="main-wrapper">
                    <div className="top-section">
                        <Header/>
                    </div>
                    <div className="content-section">
                        <Routes>
                            <Route exact path="/" element={
                                <Dashboard />
                            }>  
                            </Route>
                            <Route exact path="/reservations" element={
                                <Reservations />
                            }>  
                            </Route>
                        </Routes>
                    </div>
            </div>
        </div>
    )
}