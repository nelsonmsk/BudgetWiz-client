import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton,Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import * as auth from  './../Auth/auth-helper';

export default function DeleteIncome(props) {
	const [open, setOpen] = useState(false);
	const [redirect, setRedirect] = useState(false);
	
	const clickButton = () => {
		setOpen(true);
	};
	
	const handleRequestClose = () => {
		setOpen(false);
	};
	
	
	if (redirect) {
		return <Navigate to='/'/>
	};
	
	return (<span>
		<IconButton aria-label="Delete"
			onClick={clickButton} color="secondary">
			<DeleteIcon/>
		</IconButton>
		<Dialog open={open} onClose={handleRequestClose}>
			<DialogTitle>{"Delete Income"}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Confirm to delete your income.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleRequestClose} color="primary">
					Cancel
				</Button>
				<Button onClick={props.onRemove}
					color="secondary" autoFocus="autoFocus">
						Confirm
					</Button>
			</DialogActions>
		</Dialog>
	</span>)
};

DeleteIncome.propTypes = {
	incomeId: PropTypes.string.isRequired,
	onRemove: PropTypes.func.isRequired
};