import {React, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Icon } from '@material-ui/core';
import registerImg from './../../assets/images/register.jpeg';
import { DateTimePicker} from "@mui/x-date-pickers";

import {create} from './api-expense';

const useStyles = makeStyles(theme => ({
  root: {
	display: 'flex',
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	backgroundColor: theme.palette.background.default,
	backgroundImage:'url('+ registerImg + ')',
    backgroundRepeat: 'no-repeat',
	backgroundAttachment: 'scroll',
	backgroundSize: 'cover',	
  }, 
  card: {
    height: '50%',
	display: 'grid',
	justifyContent:'center',
    alignContent: 'stretch',
    alignItems: 'center',
    justifyItems: 'center',
    "@media (min-width: 768px)": {
      width: "350px"
    },
    "@media (min-width: 992px)": {
      width: "450px"
    },
    "@media (min-width: 1200px)": {
      width: "450px"
    },
  },
   title:{
	marginLeft:'3rem',
  }
}));

export default function NewExpense() {
	const classes = useStyles();
	const [redirect, setRedirect] = useState(false);
	const [values, setValues] = useState({
		title: '',
		amount: '',
		category: '',
		incurred_on: '',
		notes:'',
		error: ''
	});

	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value });
	};

	const handleDateChange = date => {
		setValues({...values, incurred_on: date });
	};
	
	const clickSubmit = () => {
		const expense = {
			title: values.title || undefined,
			amount: values.amount || undefined,
			category: values.category || undefined,
			incurred_on: values.incurred_on || undefined,
			notes: values.notes || undefined
			
		};
		create(expense).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error});
			} else {
				setValues({ ...values, error: ''});
			}
		})
	};
	
	const clickCancel = () => {
		setRedirect(true);
	};
	
	if (redirect) {
		return (<Navigate to={'/expenses/'}/>);
	};

return ( 

	<div className={classes.root}>
		<Card className={classes.card}>
			<CardContent>
				<Typography variant="h6" className={classes.title}>
					Sign Up
				</Typography>
				<TextField id="title" label="Title"
					className={classes.textField}
					value={values.title} onChange={handleChange('title')}
					margin="normal"/>
				<br/>
				<TextField id="amount" type="number" label="Amount"
					className={classes.textField} value={values.amount} onChange={handleChange('amount')}
					margin="normal"/>
				<br/>
				<TextField id="category" label="Category"
					className={classes.textField} value={values.category} onChange={handleChange('category')}
					margin="normal"/>
				<br/>
				<DateTimePicker label="Incurred on"
								views={["year", "month", "date"]}
								value={values.incurred_on}
								onChange={handleDateChange}
								showTodayButton
				/>
				<br/>
				<TextField id="multiline-flexible"label="Notes" multiline
						rows="2" value={values.notes} onChange={handleChange('notes')}/>
				<br/>
				{
					values.error && (<Typography component="p" color="error">
						<Icon color="error" className={classes.error}>error</Icon>
							{values.error}</Typography>)
				}
			</CardContent>
			<CardActions>
				<Button color="primary" variant="contained" onClick={clickSubmit}
					className={classes.submit}>Submit</Button>
				<Button color="secondary" variant="contained" onClick={clickCancel}
					className={classes.submit}>Cancel</Button>
			</CardActions>
		</Card>
	</div>
);

};
