import React, {useState} from 'react';
import {Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {IconButton,Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import {remove} from './api-expense';
import * as auth from  './../Auth/auth-helper';

export default function DeleteExpense(props) {
	const [open, setOpen] = useState(false);
	const [redirect, setRedirect] = useState(false);
	
	const clickButton = () => {
		setOpen(true);
	};
	
	const handleRequestClose = () => {
		setOpen(false);
	};

	const removeExpense = (index) => {
		const jwt = auth.isAuthenticated();
				remove({
					expenseId: props.expense._id
				}, {t: jwt.token}).then((data) => {
						if (data.error) {
							console.log(data.error);
						} else {
							console.log('expense' + props.expense._id + 'deleted');
							setOpen(false);
							props.updateExpense(props.expense);
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
			<DialogTitle>{"Delete Expense"}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Confirm to delete your expense.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleRequestClose} color="primary">
					Cancel
				</Button>
				<Button onClick={removeExpense}
					color={"secondary"} autoFocus={"autoFocus"}>
						Confirm
					</Button>
			</DialogActions>
		</Dialog>
	</span>)
};

DeleteExpense.propTypes = {
	expense: PropTypes.object.isRequired,
	updateExpense: PropTypes.func.isRequired
};