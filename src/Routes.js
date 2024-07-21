import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from './views/Core/Home';
import Users from './views/Users/Users';
import Signup from './views/Users/Signup';
import Signin from './views/Auth/Signin';
import Profile from './views/Users/Profile';
import EditProfile from './views/Users/EditProfile';
import {MenuBar} from './views/Core/Menu';
import Footer from './views/Core/Footer';
import PrivateRoute from './views/Auth/PrivateRoute';
import NewExpense from './views/Expenses/NewExpense';
import Expenses from './views/Expenses/Expenses';
import ExpenseOverview from './views/Expenses/ExpenseOverview';
import DeleteExpense from './views/Expenses/DeleteExpense';
import NewIncome from './views/Incomes/NewIncome';
import Incomes from './views/Incomes/Incomes';
import IncomeOverview from './views/Incomes/IncomeOverview';
import DeleteIncome from './views/Incomes/DeleteIncome';
import ExpensesMonthlyScatter from './views/Reports/ExpensesMonthlyScatter';
import ExpensesYearlyBar from './views/Reports/ExpensesYearlyBar';
import ExpensesCategoryPie from './views/Reports/ExpensesCategoryPie';
import IncomesMonthlyScatter from './views/Reports/IncomesMonthlyScatter';
import IncomesYearlyBar from './views/Reports/IncomesYearlyBar';
import IncomesCategoryPie from './views/Reports/IncomesCategoryPie';
import * as auth from './views/Auth/auth-helper';

const MainRouter = () => {
	return(
	 <div>
		<MenuBar/>
		<Routes>
			<Route exact path="/" element={<Home />}/>
			<Route path="/signup" element={<Signup />}/>
			<Route path="/signin" element={<Signin />}/>
			<Route path="/users" element={<PrivateRoute path={"/users"} element={<Users />} /> } />
			<Route path="/users/:userId" element={<PrivateRoute path={"/users/:userId"} element={<Profile />} /> } />
			<Route path="/users/edit/:userId" element={<PrivateRoute path={"/users/edit/:userId"} element={<EditProfile />} /> } />
			<Route path="/expenses/new" element={<PrivateRoute path={"/expenses/new"} element={<NewExpense />} />} />
			<Route path="/expenses/all" element={<PrivateRoute path={"/expenses/all"} element={<Expenses />} />} />
			<Route path="/expenses/current/preview" element={<PrivateRoute path={"/expenses/current/preview"} element={<ExpenseOverview />} />} />
			<Route path="/expenses/by/category" element={<PrivateRoute path={"/expenses/by/category"} element={<ExpenseOverview />} />} />
			<Route path="/expenses/plot" element={<PrivateRoute path={"/expenses/plot"} element={<ExpensesMonthlyScatter />} />} />
			<Route path="/expenses/yearly" element={<PrivateRoute path={"/expenses/yearly"} element={<ExpensesYearlyBar />} />} />
			<Route path="/expenses/category/average" element={<PrivateRoute path={"/expenses/category/average"} element={<ExpensesCategoryPie />} />} />
			<Route path="/incomes/new" element={<PrivateRoute path={"/incomes/new"} element={<NewIncome />} />} />
			<Route path="/incomes/all" element={<PrivateRoute path={"/incomes/all"} element={<Incomes />} />} />
			<Route path="/incomes/edit/:incomeId" element={<PrivateRoute path={"/incomes/edit/:incomeId"} element={<IncomeOverview />} />} />
			<Route path="/incomes/current/preview" element={<PrivateRoute path={"/incomes/current/preview"} element={<IncomeOverview />} />} />
			<Route path="/incomes/by/category" element={<PrivateRoute path={"/incomes/by/category"} element={<IncomeOverview />} />} />
			<Route path="/incomes/plot" element={<PrivateRoute path={"/incomes/plot"} element={<IncomesMonthlyScatter />} />} />
			<Route path="/incomes/yearly" element={<PrivateRoute path={"/incomes/yearly"} element={<IncomesYearlyBar />} />} />
			<Route path="/incomes/category/average" element={<PrivateRoute path={"/incomes/category/average"} element={<IncomesCategoryPie />} />} />
		</Routes>
		<Footer/>
	</div>   
	);
};
export default MainRouter; 