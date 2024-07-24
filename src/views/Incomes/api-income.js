import qs from 'qs';

const create = async (credentials, income) => {
	try {
		let response = await fetch('/api/incomes', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			},
			body: JSON.stringify(income)
		});
		return await response.json();
	} catch(err) {
	console.log(err);
	}
};

const listByUser = async (params, credentials, signal) => {
	const query = qs.stringify(params);
	try {
		let response = await fetch('/api/incomes?'+query, {
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
		let response = await fetch('/api/incomes/' + params.incomeId, {
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

const update = async (params, credentials, income) => {
	try {
		let response = await fetch('/api/incomes/' + params.incomeId, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + credentials.t
			},
			body: income
		})
		return await response.json();
	} catch(err) {
		console.log(err);
	}
};

const remove = async (params, credentials) => {
	try {
		let response = await fetch('/api/incomes/' + params.incomeId, {
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
		let response = await fetch('/api/incomes/current/preview', {
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

const incomeByCategory = async (credentials, signal) => {
	try {
		let response = await fetch('/api/incomes/by/category', {
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

const plotIncomes = async (credentials, signal) => {
	try {
		let response = await fetch('/api/incomes/plot', {
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

const yearlyIncomes = async (credentials, signal) => {
	try {
		let response = await fetch('/api/incomes/yearly', {
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

const averageCategories = async (credentials, signal) => {
	try {
		let response = await fetch('/api/incomes/category/averages', {
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


export { create, listByUser, read, update, remove, currentMonthPreview, incomeByCategory, plotIncomes, yearlyIncomes, averageCategories };