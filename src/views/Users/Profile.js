import React, { useState, useEffect } from 'react';
import {Link, Navigate, useParams} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton,Divider, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from '@material-ui/core';
import {Person, Edit} from '@material-ui/icons';

import * as auth from  './../Auth/auth-helper';
import {read} from './api-user';
import DeleteUser from './DeleteUser';

const useStyles = makeStyles(theme => ({
  root: {
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
  },
  title: {
	padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	color: theme.palette.primary,
  },
}));

export default function Profile({ match }) {
	const classes = useStyles();
	const [user, setUser] = useState({});
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const {userId} = useParams();
	
	useEffect(() => {
		const abortController = new AbortController()
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
		read({
			userId: userId
		}, {t: jwt.token}, signal).then((data) => {
			if (data && data.error) {
				console.log('data prof error:',data.error);
				setRedirectToSignin(true);
			} else {
				setUser(data);
			}
		});
	}, [userId]);

	if (redirectToSignin) {
		return <Navigate to={'/signin'}/>;
	};
	
	const photoUrl = userId
	? `/api/users/photo/${userId}?${new Date().getTime()}`
	: '/api/users/defaultphoto'	;
	
	return (
		<Paper className={classes.root} elevation={4}>
			<Typography variant="h4" className={classes.title}>
				Profile
			</Typography>
			<List dense>
				<ListItem>
					<ListItemAvatar>
						<Avatar src={photoUrl}>
							<Person/>
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary={user.name} secondary={user.email}/>
				{( auth.isAuthenticated().user && auth.isAuthenticated().user._id === user._id ) ?
					(<ListItemSecondaryAction>
						<Link to={"/users/edit/" + user._id}>
							<IconButton aria-label="Edit" color="primary">
								<Edit/>
							</IconButton>
						</Link>
						<DeleteUser userId={user._id}/>
					</ListItemSecondaryAction>)
					:(<ListItemSecondaryAction></ListItemSecondaryAction>)
				}
				</ListItem>
				<Divider/>
				<ListItem> <ListItemText primary={user.about}/> </ListItem>				
				<ListItem>
					<ListItemText primary={"Joined: " + (
						new Date(user.created)).toDateString()}/>
				</ListItem>
			</List>
		</Paper>
	);
};