import React from 'react';
import {Navigate} from 'react-router-dom';
import GeneralOverview from './../Incomes/GeneralOverview';
import * as auth from  './../Auth/auth-helper';

export default function Home(){
	const jwt = auth.isAuthenticated;
	const {from} = {
			from: {
				pathname: '/signin'
			}
	};
	
	if (!jwt) {
		return <Navigate to={from}/>
	};
	return (
			<GeneralOverview />			
		);
};