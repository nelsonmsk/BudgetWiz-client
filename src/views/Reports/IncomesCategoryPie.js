
import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {ArrowForward,Person} from '@material-ui/icons';
import {VictoryPie, VictoryLabel, VictoryTheme} from 'victory';

import * as auth from  './../Auth/auth-helper';
import {averageCategories} from './../Incomes/api-income';

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
	const [error, setError] = useState('');
	const [incomes, setIncomes] = useState([]);
	const date = new Date(), y = date.getFullYear(), m = date.getMonth();
	const [firstDay, setFirstDay] = useState(new Date(y, m, 1));
	const [lastDay, setLastDay] = useState(new Date(y, m + 1, 0));

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
			averageCategories({firstDay: firstDay, lastDay: lastDay},
				{t: jwt.token}, signal).then((data) => {
					if (data.error) {
						setError(data.error);
					} else {
						setIncomes(data);
					}
				})
		return function cleanup(){
			abortController.abort()
		}
	}, []);

return (
	<Paper className={classes.root} elevation={4}>
		<div style={{width: 550, margin: 'auto'}}>
			<svg viewBox="0 0 320 320">
				<VictoryPie standalone={false} data={incomes.monthAVG} innerRadius={50}
							theme={VictoryTheme.material}
							labelRadius={(50 + 14 )}
							labelComponent={ <VictoryLabel angle={0} style={[{
																		fontSize: '11px',
																		fill: '#0f0f0f'
																	},
																	{
																		fontSize: '10px',
																		fill: '#013157'
																	}]} 
															text={({ datum }) => `${datum.x}\n $${datum.y}`}/>
									 }
				/>
					<VictoryLabel textAnchor="middle"
									style={{ fontSize: 14, fill: '#8b8b8b' }}
									x={175} y={170}
									text={`Spent \nper category`}
						/>
			</svg>
		</div>
	</Paper>
);

};






