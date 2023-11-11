import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {ArrowForward,Person} from '@material-ui/icons';
import {VictoryChart, VictoryLabel, VictoryScatter, VictoryTooltip, VictoryTheme} from 'victory';


import {plotIncomes} from './../Incomes/api-income';
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

export default function IncomesMonthlyScatter() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated;
	const [plot, setPlot] = useState([]);
	const [month, setMonth] = useState(new Date());
	const [error, setError] = useState('');
		useEffect(() => {
			const abortController = new AbortController();
			const signal = abortController.signal;
				plotIncomes({month: month},{t: jwt.token}, signal).then((data) => {
					if (data.error) {
						setError(data.error);
					} else {
						setPlot(data);
					}
				})
				return function cleanup(){
			abortController.abort();
		}
	}, []);

return (
	<Paper className={classes.root} elevation={4}>
		<VictoryChart theme={VictoryTheme.material}
						height={400}
						width={550}
						domainPadding={40}>
			<VictoryScatter style={{
									data: { fill: "#01579b", stroke: "#69f0ae", strokeWidth: 2 },
									labels: { fill: "#01579b", fontSize: 10, padding:8}}}
							bubbleProperty="y"
							maxBubbleSize={15}
							minBubbleSize={5}
							labels={({ datum }) => `$${datum.y} on ${datum.x}th`}
							labelComponent={ VictoryTooltip }
							data={plot}
							domain={{x: [0, 31]}}
				/>
			<VictoryLabel textAnchor="middle"
							style={{ fontSize: 14, fill: '#8b8b8b' }}
							x={270} y={390}
							text={`day of month`}
				/>
			<VictoryLabel textAnchor="middle"
							style={{ fontSize: 14, fill: '#8b8b8b' }}
							x={6} y={190}
							angle = {270}
							text={`Amount ($)`}
				/>
		</VictoryChart>
	</Paper>
);

};






