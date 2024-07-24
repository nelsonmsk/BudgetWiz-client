import React, {useState} from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {IconButton,Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import {remove} from './api-income';
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
	
	const removeIncome = (index) => {
		const jwt = auth.isAuthenticated();
				remove({
					incomeId: props.income._id
				}, {t: jwt.token}).then((data) => {
						if (data.error) {
							console.log(data.error);
						} else {
							console.log('income' + props.income._id + 'deleted');
							setOpen(false);
							props.updateIncome(props.income);
						}
				});
	};


	if (redirect) {
		return <Navigate to='/'/>
	};
	
	return (<span>
		<IconButton aria-label="Delete"
			onClick={clickButton} color={"secondary"}>
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
				<Button onClick={removeIncome}
					color={"secondary"} autoFocus={"autoFocus"}>
						Confirm
					</Button>
			</DialogActions>
		</Dialog>
	</span>)
};

DeleteIncome.propTypes = {
	income: PropTypes.object.isRequired,
	updateIncome: PropTypes.func.isRequired
};