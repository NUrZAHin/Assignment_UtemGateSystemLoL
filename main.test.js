const { prepareParams } = require('api/src/lib');
const { response } = require('express');
const req = require('express/lib/request');
const supertest = require('supertest');
const request = supertest('http://localhost:3500');

describe('Express Route Test', function () {
	const data = {
		no_ic: "7566457954736",
		name: 'makko',
		password: "6666666"
	}

	it('create', async () => {
		return request
			.post('/register')
			.send(data)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining(
						{
							acknowledged : true
	
						}
					)
				);
			});
	});

	it('read', async () => {
		return request
		.get('/check')
		.expect('Content-Type', /json/)
		.send(data)
		.expect(200).then(response => {
			expect(response.body).toEqual(
				expect.objectContaining(
					{
						no_ic : expect.any(String),
						name : expect.any(String),
						password : expect.any(String)

					}
				)
			)
		})
	})

	it('update', async () => {
		return request
			.patch('/update')
			.send(data)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining(
						{
							acknowledged : true
	
						}
					)
				);
			});

	})

	it('delete', async () => {
		return request
			.delete('/delete')
			.send(data)
			.expect('Content-Type', /json/)
			.expect(200).then(response => {
				expect(response.body).toEqual(
					expect.objectContaining(
						{
							acknowledged : true
	
						}
					)
				);
			});
	})

	
});