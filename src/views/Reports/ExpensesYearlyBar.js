import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {ArrowForward,Person} from '@material-ui/icons';
import {VictoryChart, VictoryAxis, VictoryBar, VictoryTheme} from 'victory';

import {yearlyExpenses} from './../Expenses/api-expense';
import * as auth from  './../Auth/auth-helper';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  }
}));

export default function ExpensesYearlyBar() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated;
	const [year, setYear] = useState(new Date());
	const [yearlyExpense, setYearlyExpense] = useState([]);
	const [error, setError] = useState('');

		useEffect(() => {
			const abortController = new AbortController();
			const signal = abortController.signal;
				yearlyExpenses({year: year.getFullYear()},{t: jwt.token}, signal).then((data) => {
					if (data.error) {
						setError(data.error);
					}
					setYearlyExpense(data);
				});
			return function cleanup(){
				abortController.abort();
			}
		}, []);
		
	const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	

return (
	<Paper className={classes.root} elevation={4}>
		 <VictoryChart  theme={VictoryTheme.material}
						domainPadding={10}
						height={300}
						width={450}>
			<VictoryAxis/>
			<VictoryBar categories={{
								x: monthStrings
							}}
						style={{ data: { fill: "#69f0ae", width: 20 }, labels: {fill: "#01579b"} }}
						data={yearlyExpense.monthTot}
						x={monthStrings['x']}
						domain={{x: [0, 13]}}
						labels={({datum}) => `$${datum.y}`}
				/>
		</VictoryChart>
	</Paper>
);

};






