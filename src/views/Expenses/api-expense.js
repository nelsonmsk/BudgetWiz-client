import qs from 'qs';

const create = async (credentials, expense) => {
	try {
		let response = await fetch('/api/expenses/', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			},
			body: JSON.stringify(expense)
		});
		return await response.json();
	} catch(err) {
	console.log(err);
	}
};

const listByUser = async (params, credentials, signal) => {
	const query = qs.stringify(params);
	try {
		let response = await fetch('/api/expenses?'+query, {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
		return await response.json();
	} catch(err) {
	console.log(err);
	}
};

const read = async (params, credentials, signal) => {
	try {
		let response = await fetch('/api/expenses/' + params.expenseId, {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
			return await response.json();
		} catch(err) {
			console.log(err);
		}
};

const update = async (params, credentials, expense) => {
	try {
		let response = await fetch('/api/expenses/' + params.expenseId, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			},
			body: expense
		})
		return await response.json();
	} catch(err) {
		console.log(err);
	}
};

const remove = async (params, credentials) => {
	try {
		let response = await fetch('/api/expenses/' + params.expenseId, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
		return await response.json();
	} catch(err) {
		console.log(err);
	}
};

const currentMonthPreview = async (credentials, signal) => {
	try {
		let response = await fetch('/api/expenses/current/preview', {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
			return await response.json();
		} catch(err) {
			console.log(err);
		}
};

const expenseByCategory = async (credentials, signal) => {
	try {
		let response = await fetch('/api/expenses/by/category', {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
			return await response.json();
		} catch(err) {
			console.log(err);
		}
};

const plotExpenses = async (params, credentials, signal) => {
	const query = qs.stringify(params);
	try {
		let response = await fetch('/api/expenses/plot?'+query, {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
			return await response.json();
		} catch(err) {
			console.log(err);
		}
};

const yearlyExpenses = async (params, credentials, signal) => {
	const query = qs.stringify(params);
	try {
		let response = await fetch('/api/expenses/yearly?'+query, {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
			return await response.json();
		} catch(err) {
			console.log(err);
		}
};

const averageCategories = async (params, credentials, signal) => {
	const query = qs.stringify(params);
	try {
		let response = await fetch('/api/expenses/category/averages?'+query, {
			method: 'GET',
			signal: signal,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			}
		})
			return await response.json();
		} catch(err) {
			console.log(err);
		}
};


export { create, listByUser, read, update, remove, currentMonthPreview, expenseByCategory, plotExpenses, yearlyExpenses, averageCategories };