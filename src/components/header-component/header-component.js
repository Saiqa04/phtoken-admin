import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { CREATE_CHAIN, GET_COUNTS } from "../../services/graphql";
import {useLocation} from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MessageSnackBar from "../../popups/MessageSnackBar";

require('./header-component.scss');

const InitialValues = {
  chainSymbol: "",
  chainName: "",
  logoUrl: ""
}
export default function Header() {
    const {loading: countLoading, data: countData}  = useQuery(GET_COUNTS);
    const [createChain] = useMutation(CREATE_CHAIN, {
      onCompleted: () => {
        setSnackBar({
          type: "success",
          message: "You have added new chain.",
          open: true
        })

        setValues(InitialValues);
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
    const location = useLocation();

    const [open, setOpen] = React.useState(false);
    const [values, setValues] = useState(InitialValues)
    const handleClickOpen = () => {
        setOpen(true);
    };

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

    const handleClose = () => {
        setOpen(false);
    };
 
    const handleOnChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setValues({
          ...values,
          [name]: value
        })
    }
    const FormDialog =  (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create Chain</DialogTitle>
          <DialogContent>
          <TextField
              autoFocus margin="dense" name="chainName" onChange={handleOnChange} value={values.chainName}
              id="text" label="Chain Name" type="text"
              fullWidth variant="standard"
            />
            <TextField
             margin="dense" name="chainSymbol"  onChange={handleOnChange} value={values.chainSymbol}
             id="text" label="Symbol" type="text"
             fullWidth variant="standard"
            />
            <TextField
              margin="dense" name="logoUrl" onChange={handleOnChange} value={values.logoUrl}
              id="text" label="Icon URL" type="text"
              fullWidth variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCreateChain()}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  
    const handleCreateChain = () => {
      if(values.chainName === "" || values.chainSymbol === ""){
        setSnackBar({
          type: "error",
          message: "Fields cannot be null.",
          open: true
        })
        return;
      }

       createChain({
          variables: {
            chainSymbol: values.chainSymbol,
            name: values.chainName,
            logo: values.logoUrl
          }
       })
    }

    return(
        <div className="header-container">
            <MessageSnackBar open={snackBar.open} type={snackBar.type} close={handleCloseSnackbar} message={snackBar.message}/>
            {FormDialog}
            <div className="header-mini-bar">
                <a href="mailTo:"><i className="fa-solid fa-envelope"></i></a>
                <button onClick={handleClickOpen}>Create chain</button>
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