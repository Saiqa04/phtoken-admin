import React from "react";
import logo from '../../../public/images/logo-racoins.png';
import {
    NavLink
} from "react-router-dom";

require('./side-nav-component.scss');

export default function SideNav(){
    return(
        <div className="side-nav-container">
            <div className="title">
                 <img src={logo}/>
            </div>
            <div className="label">
                <span>Navigation</span>
            </div>
            <div className="buttons-wrapper">
                 <NavLink to="/" activeclassname='active'><i className="fa-solid fa-house"></i>Dashboard<i className="fa-solid fa-angle-right"></i></NavLink>
                 <NavLink to="/reservations">&nbsp;<i className="fa-solid fa-calendar-days"></i>Reservations<i className="fa-solid fa-angle-right"></i></NavLink>
                 <NavLink to="/records">&nbsp;<i class="fa-solid fa-book"></i>Records<i className="fa-solid fa-angle-right"></i></NavLink>
            </div>  
        </div>
    );
}