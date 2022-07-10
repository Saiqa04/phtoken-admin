import React from "react";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

export default function MessageSnackBar(props){
    const {open, type, close, message} = props;

    const onTriggerCloseCallBack = () => {
        close();
    }

    return(
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={3000} onClose={onTriggerCloseCallBack}>
                <Alert onClose={onTriggerCloseCallBack} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}