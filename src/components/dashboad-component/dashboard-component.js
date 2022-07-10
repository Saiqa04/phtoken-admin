import React, { useState } from "react";
import { GET_COINS, GET_COIN_BY_NAME_ADDRESS, GET_COUNTS, GET_FOR_APPROVAL_COINS, UPDATE_COIN_INFO, UPDATE_COIN_STATUS } from "../../services/graphql";
import { useQuery,useMutation } from '@apollo/client';
import moment from 'moment';
import { useChainContext } from "../../context/ChainContext";
import MessageSnackBar from "../../popups/MessageSnackBar";

require('./dashboard-component.scss');

const InitialValues = {
    CoinID: "",
    Name: "",
    Chain: "",
    Symbol: "",
    ContractAddress: "",
    LaunchDate: "",
    IsPresale: false,
    IsDoxxed: false,
    Description: "",
    AuditLink: "",
    Website: "",
    Telegram: "",
    Twitter: "",
    Discord: "",
    LogoLink: "",
    Status: "",
    ContactEmail: "",
    Status: "",
}
export default function Dashboard(){

    const {chains} = useChainContext();
   
    const [snackBar, setSnackBar] = useState({
        type: "success",
        message: "",
        open: false
    })

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
            setSnackBar({
                ...snackBar,
                open: false
            })
    };
    
    const [updateCoinInfo] = useMutation(UPDATE_COIN_INFO, {
        refetchQueries: [GET_COINS, GET_FOR_APPROVAL_COINS],
        onCompleted: () => {
            setSnackBar({
                type: "success",
                message: "You have successfully updated a coin.",
                open: true
            })
        }
    });
    
    const {loading: forApprovalLoading, data: forApprovalData} = useQuery(GET_FOR_APPROVAL_COINS);
    const {loading: coinsLoading, data: coinsData} = useQuery(GET_COINS, {
        variables: {
            offset: 0
        }
    })

    
    const [selectedRow, setSelectedRow] = useState(InitialValues)
    const handleRowSelect = (row) => {
        setSelectedRow(row);
    }


    const handleInputOnChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setSelectedRow({
            ...selectedRow,
            [name]: value
        })
    }

    const handleFormSubmit = () => {
        if(selectedRow.CoinID === "" || selectedRow.CoinID === null){
            setSnackBar({
                type: "warning",
                message: "No coin selected.",
                open: true
            })
            return;
        }
        
        updateCoinInfo({
            variables: {
                coinId: parseInt(selectedRow.CoinID),
                name: selectedRow.Name, 
                chain: selectedRow.Chain,
                symbol: selectedRow.Symbol, 
                contractAddress: selectedRow.ContractAddress, 
                launchDate: selectedRow.LaunchDate, 
                isPresale: JSON.parse(selectedRow.IsPresale),
                description: selectedRow.Description,
                telegram: selectedRow.Telegram,
                logoLink: selectedRow.LogoLink,
                isDoxxed: JSON.parse(selectedRow.IsDoxxed),
                auditLink: selectedRow.AuditLink, 
                website: selectedRow.Website, 
                twitter: selectedRow.Twitter,
                discord: selectedRow.Discord,
                contactEmail: selectedRow.ContactEmail,
                status: selectedRow.Status,
            }
        })
    }

    return(
        <div className="dashboard-container">
             <MessageSnackBar open={snackBar.open} type={snackBar.type} close={handleCloseSnackbar} message={snackBar.message}/>
            <div className="box-wrapper">
                <div className="table-wrapper">
                    <table className="for-approval">
                        <thead>
                            <tr>
                                <th colSpan={8}>For Approval</th>
                            </tr>
                        </thead>
                        <tbody>
                            {forApprovalData?.ForApprovalCoins.map((row) =>
                            <tr key={row.CoinID}>
                                <td>{row.Name}</td>
                                <td>{"$"+row.Symbol}</td>
                                <td>{row.Chain}</td>
                                <td>{row.LaunchDate}</td>
                                <td>{row.Telegram}</td>
                                <td>{row.Website}</td>
                                <td><button onClick={() => handleRowSelect(row)}>Select</button></td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                    <table className="coins-table">
                        <thead>
                            <tr>
                                <th colSpan={4}>All COins</th>
                                <th>Telegram</th>
                                <th>Website</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coinsData?.Coins.map((row) =>
                            <tr key={row.CoinID}>
                                <td>{row.Name}</td>
                                <td>{"$"+row.Symbol}</td>
                                <td>{row.Chain}</td>
                                <td>{row.LaunchDate}</td>
                                <td>{row.Telegram}</td>
                                <td>{row.Website}</td>
                                <td><button onClick={() => handleRowSelect(row)}>Select</button></td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="form-wrapper">
                    <div className="label-text">
                        <span>Coin Details {selectedRow.CoinID === "" ? "" : `of ID ${selectedRow.CoinID}`}</span>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="ContractAddress" value={selectedRow.ContractAddress} onChange={handleInputOnChange}
                        placeholder="Contract Address"/>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="Name" value={selectedRow.Name} onChange={handleInputOnChange}
                         placeholder="Name"/>
                        <input type="text" name="Symbol" placeholder="Symbol" value={selectedRow.Symbol} onChange={handleInputOnChange}/>
                    </div>
                    <div className="input-wrapper">
                        <select name='Chain' value={selectedRow.Chain} onChange={handleInputOnChange}>
                           {chains?.map((chain) =>
                             <option key={chain.ChainSymbol} value={chain.ChainSymbol}>{chain.Name}</option>
                           )}
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="LaunchDate" value={selectedRow.LaunchDate} onChange={handleInputOnChange}
                        placeholder="Launch Date"/>
                        <input type="text" name="Website" value={selectedRow.Website} onChange={handleInputOnChange}
                        placeholder="Website"/>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="Telegram" value={selectedRow.Telegram} onChange={handleInputOnChange}
                        placeholder="Telegram"/>
                        <input type="text" name="Twitter" value={selectedRow.Twitter} onChange={handleInputOnChange}
                        placeholder="Twitter"/>
                    </div>
                    <div className="input-wrapper">
                        <textarea type="text" name='Description' value={selectedRow.Description} onChange={handleInputOnChange}
                         placeholder='Description' rows={3}/>
                    </div>
                    <div className="input-wrapper">
                        <select name='IsPresale' value={selectedRow.IsPresale} onChange={handleInputOnChange}>
                            <option value={true}>Currently in presale</option>
                            <option value={false}>Already launched</option>
                        </select>
                        <select name='IsDoxxed' value={selectedRow.IsDoxxed} onChange={handleInputOnChange}>
                            <option value={true}>The team is Doxxed</option>
                            <option value={false}>The team is not Doxxed</option>
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="Discord" value={selectedRow.Discord} onChange={handleInputOnChange}
                        placeholder="Discord"/>
                        <input type="text" name="AuditLink" value={selectedRow.AuditLink} onChange={handleInputOnChange}
                        placeholder="Audit Link"/>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="LogoLink" value={selectedRow.LogoLink} onChange={handleInputOnChange}
                        placeholder="Logo Link"/>
                    </div>
                    <div className="input-wrapper">
                        <input type="text" name="ContactEmail" value={selectedRow.ContactEmail} onChange={handleInputOnChange}
                            placeholder="Contact Email"/>
                        <select name='Status' value={selectedRow.Status} onChange={handleInputOnChange}>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Removed">Removed</option>
                            <option value="Banned">Banned</option>
                        </select>
                    </div>
                    <div className="input-wrapper">
                        <button onClick={handleFormSubmit}>submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}