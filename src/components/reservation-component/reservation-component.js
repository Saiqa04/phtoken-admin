import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import MessageSnackBar from "../../popups/MessageSnackBar";
import { CREATE_BANNER_AD, CREATE_PROMOTION, GET_RESERVATIONS } from "../../services/graphql";

require('./reservation-component.scss');

const InitialSelectedRowValues = {
    Number: "",
    AdType: "",
    StartDate: "",
    EndDate: "",
    Telegram: "",
    Amount: "",
    Discount: "",
    Status: "",
}

const InitialBannerFormValues = {
    ImageLocation: "",
    CommunityTG: "",
    Website: "",
    SwapExchange: "",
    BannerName: "",
    Description: "",
    TxnHash: "",
    Memo: "",
}

const InitialPromoFormValues = {
    CoinID: null,
    TxnHash: "",
    Memo: "",
}
export default function Reservations() {  
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

    const [selectedRow, setSelectedRow] = useState(InitialSelectedRowValues)
    const [values, setValues] = useState(InitialBannerFormValues)
    const [promoValues, setPromoValues] = useState(InitialPromoFormValues)
    const [GetReservations, {loading, data}] = useLazyQuery(GET_RESERVATIONS)

    const [createBannerAd] = useMutation(CREATE_BANNER_AD, {
        refetchQueries: [GET_RESERVATIONS],
        onCompleted: () => {
            setSnackBar({
                type: "success",
                message: "Successfully create a banner Ad.",
                open: true
            })
            setValues(InitialBannerFormValues);
            setSelectedRow(InitialSelectedRowValues);
        },
        onError: ({graphQLErrors}) => {
            if(graphQLErrors)
            graphQLErrors.forEach(({message}) => 
                setSnackBar({
                    type: "error",
                    message: message,
                    open: true
                })
            )
        }
    });
    const [createPromotion] = useMutation(CREATE_PROMOTION, {
        refetchQueries: [GET_RESERVATIONS],
        onCompleted: () => {
            setSnackBar({
                type: "success",
                message: "Successfully create a promotion Ad.",
                open: true
            })
            setPromoValues(InitialPromoFormValues);
            setSelectedRow(InitialSelectedRowValues);
        },
        onError: ({graphQLErrors}) => {
            if(graphQLErrors)
            graphQLErrors.forEach(({message}) => 
                setSnackBar({
                    type: "error",
                    message: message,
                    open: true
                })
            )
        }
    })

    const handleInputOnChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setValues({
            ...values,
            [name]: value
        })
    }
    
    const handleRowSelect = (row) => {
        setSelectedRow(row)
    }
    const handleFormSubmit = () => {
        if(values.ImageLocation === "" 
            || values.BannerName === "" ||
            values.CommunityTG === "" ||
            values.Description === ""){
            setSnackBar({
                type: "error",
                message: "Fields must have value.",
                open: true
            })
            return;
        }
        createBannerAd({
            variables: { 
                bannerType: selectedRow.AdType,
                imageLocation: values.ImageLocation,
                startDate: selectedRow.StartDate,
                endDate: selectedRow.EndDate,
                reservationNumber: selectedRow.Number,
                telegram: values.CommunityTG,
                swap: values.SwapExchange,
                website: values.Website,
                bannerName: values.BannerName,
                number: selectedRow.Number,
                description: values.Description,
                paymentStatus: "Paid",
                txnHash: values.TxnHash,
                memo: values.Memo
            }
        })
    }

    const handlePromoInputOnChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setPromoValues({
            ...promoValues,
            [name]: value
        })
    }

    const handlePromoteFormSubmit = () => {
        if(promoValues.CoinID === null){
            setSnackBar({
                type: "error",
                message: "No coin id provided.",
                open: true
            })
            return;
        }
        createPromotion({
            variables: {
                coinId: parseInt(promoValues.CoinID),
                startDate: selectedRow.StartDate,
                endDate:selectedRow.EndDate,
                reservationNumber: selectedRow.Number,
                number: selectedRow.Number,
                paymentStatus: "Paid",
                txnHash: promoValues.TxnHash,
                memo: promoValues.Memo
            }
        })
    }

    useEffect(() => {
        GetReservations({
            variables: {
                status: "Pending"
            }
        })
    },[])
    return(
        <div className="reservation-container">
                 <MessageSnackBar open={snackBar.open} type={snackBar.type} close={handleCloseSnackbar} message={snackBar.message}/>
            <button className="btn" onClick={() => GetReservations({
                variables: {
                    status: "Pending"
                }
            })}>Pending</button>
             <button className="btn" onClick={() => GetReservations({
                variables: {
                    status: "Paid"
                }
            })}>Paid</button>
            <div className="box-wrapper">
                <div className="table-wrapper">
                        <table className="pending">
                            <thead>
                                <tr>
                                    <th>Number</th>
                                    <th>Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Contact</th>
                                    <th>Amount</th>
                                    <th>Discount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.Reservations.map((row) => 
                                <tr key={row.Number}>
                                    <td>{row.Number}</td>
                                    <td>{row.AdType}</td>
                                    <td>{row.StartDate}</td>
                                    <td>{row.EndDate}</td>
                                    <td>{row.Telegram}</td>
                                    <td>{row.AmountToPay}</td>
                                    <td>{row.Discount}</td>
                                    <td>{row.PaymentStatus}</td>
                                    <td><button disabled={row.PaymentStatus === "Paid"} 
                                    onClick={() => handleRowSelect(row)}>Select</button></td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                </div>
                <div className="form-container">
                    <div className="form-wrapper">
                        <div className="label-text">
                            <span>Create {selectedRow.AdType} Ad</span>
                        </div>
                        {selectedRow.AdType === "Promote" ?
                            //Create Promotion Form
                            <>
                                <div className="input-wrapper">
                                    <label>Coin ID <span>(required)</span></label>
                                    <input type="text" name="CoinID" value={promoValues.CoinID} 
                                        onChange={handlePromoInputOnChange}/>
                                </div>
                                <div style={{display: 'flex'}}>
                                    <div className="input-wrapper">
                                        <label>Start Date</label>
                                        <input type="text" name="StartDate" readOnly={true} value={selectedRow.StartDate} 
                                            onChange={handlePromoInputOnChange}
                                            placeholder="Contract Address"/>
                                    </div>
                                    <div className="input-wrapper">
                                        <label>End Date</label>
                                        <input type="text" name="EndDate" readOnly={true} value={selectedRow.EndDate}
                                            onChange={handlePromoInputOnChange}
                                            placeholder="e.g https://t.me/user"/>
                                    </div>
                            </div>
                            <div className="input-wrapper">
                                <label>Txn Hash <span>(required)</span></label>
                                <input type="text" name="TxnHash" value={promoValues.TxnHash} 
                                    onChange={handlePromoInputOnChange}/>
                            </div>
                            <div className="input-wrapper">
                                <label>Memo</label>
                                <input type="text" name="Memo" value={promoValues.Memo} 
                                    onChange={handlePromoInputOnChange}/>
                            </div>
                            <div className="input-wrapper">
                                <button onClick={handlePromoteFormSubmit}>submit</button>
                            </div>
                            </> 
                            : //Create Banner Ad Form
                            selectedRow.AdType === "" ?
                            <>
                                <div style={{textAlign: 'center', margin: "15px 0px 10px 0px"}}>
                                    <span style={{fontSize: 13, color: '#d3d3d3'}}>Select from any pending reservations</span>
                                </div>
                            </>
                            :             
                            <>
                            <div style={{display: 'flex'}}>
                                <div className="input-wrapper">
                                    <label>Number <span>(required)</span></label>
                                    <input type="text" name="Number" readOnly={true} value={selectedRow.Number} 
                                        onChange={handleInputOnChange}
                                        placeholder="Contract Address"/>
                                </div>
                                <div className="input-wrapper">
                                    <label>Contact <span>(required)</span></label>
                                    <input type="text" name="Telegram" readOnly={true} value={selectedRow.Telegram}
                                        onChange={handleInputOnChange}
                                        placeholder="e.g https://t.me/user"/>
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div className="input-wrapper">
                                    <label>Telegram (Community) <span>(required)</span></label>
                                    <input type="text" name="CommunityTG" value={values.CommunityTG}
                                        onChange={handleInputOnChange}/>
                                </div>
                                <div className="input-wrapper">
                                    <label>Website</label>
                                    <input type="text" name="Website" value={values.Website}
                                        onChange={handleInputOnChange}/>
                                </div>
                            </div>
                            <div style={{display: 'flex'}}>
                                <div className="input-wrapper">
                                    <label>Swap Exchange</label>
                                    <input type="text" name="SwapExchange" value={values.SwapExchange}
                                        onChange={handleInputOnChange}/>
                                </div>
                                <div className="input-wrapper">
                                    <label>Banner Name <span>(required)</span></label>
                                    <input type="text" name="BannerName" value={values.BannerName}
                                        onChange={handleInputOnChange}/>
                                </div>
                            </div>
                            <div className="input-wrapper">
                                <label>Txn Hash <span>(required)</span></label>
                                <input type="text" name="TxnHash" value={values.TxnHash} 
                                    onChange={handleInputOnChange}/>
                            </div>
                            <div className="input-wrapper">
                                <label>Memo</label>
                                <input type="text" name="Memo" value={values.Memo} 
                                    onChange={handleInputOnChange}/>
                            </div>
                            <div className="input-wrapper">
                                <label>Description <span>(required)</span></label>
                                <textarea rows={3} type="text" name="Description" value={values.Description}
                                    onChange={handleInputOnChange}/>
                            </div>
                            <div className="input-wrapper">
                                <label>Banner URL <span>(required)</span></label>
                                <input type="text" name="ImageLocation" value={values.ImageLocation}
                                    onChange={handleInputOnChange}
                                    placeholder="e.g https://example.com/sample/banner.gif"/>
                            </div>
                            <div className="input-wrapper">
                                <button onClick={handleFormSubmit}>submit</button>
                            </div>
                            </> 
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}