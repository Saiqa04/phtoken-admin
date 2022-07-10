import { useQuery } from "@apollo/client";
import React from "react";
import { GET_COUNTS } from "../../services/graphql";
import {useLocation} from 'react-router-dom';
require('./header-component.scss');

export default function Header() {
    const {loading: countLoading, data: countData}  = useQuery(GET_COUNTS);
    const location = useLocation();
    return(
        <div className="header-container">
            <div className="header-mini-bar">
                <a href="mailTo:"><i className="fa-solid fa-envelope"></i></a>
            </div>

            <div className="location-path">
                <a><i className="fa-solid fa-house"></i></a>
                <span className="separator">/</span>
                <a>{location.pathname.substring(1)}</a>
            </div>
            <div className="box-wrapper">
                <div className="stat-box">
                    <span>For Listing</span>
                    <span>{countData?.ForApprovalCoinCount}<i className="fa-solid fa-clipboard-list"></i></span>
                    <span>All coins with pending approval</span>
               </div>
               <div className="stat-box">
                <span>Reservations</span>
                    <span>{countData?.PendingReservationCount}<i className="fa-solid fa-book-open"></i></span>
                    <span>All pending reservations</span>
                </div>
               <div className="stat-box">
                    <span>Coins</span>
                    <span>{countData?.AllCoinCount}<i className="fa-solid fa-bitcoin-sign"></i></span>
                    <span>All coins listed</span>
               </div>
            </div>
        </div>
    );
}