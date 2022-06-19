const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://admin:admin@cluster0.dbs087n.mongodb.net/?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

const express = require('express');
const res = require("express/lib/response");
const app = express()
const port = process.env.PORT || 3500

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggeroptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Utem Gate Management System',
			version: '1.0.0',
		},
	}, 
	apis: ['./main.js'], // files containing annotations as above
};

const swaggerSpec = swaggerJsdoc(swaggeroptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))



app.get('/', (req, res) => {
	res.send('Hello World')
})

app.get('/check', async (req, res) => {
	const user = await User.check(req.body.ic,req.body.name, req.body.password,req.body.phone,req.body.car_plate)
	res.json(user)
})

/**
 * @swagger
 * /check/no_ic:
 *   get:
 *     description: Returns Array of the User
 *     parameters:
 *       - in: path
 *         name: no_ic
 *         required: true
 *         content:
 *           application/json:
 *             schemas:
 *               type: object
 *               no_ic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search Found!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  no_ic:
 *                      type: string
 *                  name:
 *                      type: string
 *                  password:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  car_plate:
 *                      type: string
 */

app.post('/login', async (req, res) => {
	console.log(req.body);

	const user = await User.login(req.body.ic,req.body.name, req.body.password,req.body.phone,req.body.car_plate);
	res.status(200).json({
		no_ic: user.ic,
		name: user.username,
		token: generateAccessToken({
			ic: user.ic,
			phone: user.phone 
		})
	});
})

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               no_ic: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful
 *       401:
 *         description: Invalid Credentials
 */

app.post('/register', async (req, res) => {
	//console.log(req.body);
	const user = await User.register(req.body.ic,req.body.name, req.body.password,req.body.phone,req.body.car_plate);
	res.json(user)

})

/**
 * @swagger
 * /register:
 *   post:
 *     description: Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *                  no_ic:
 *                      type: string
 *                  name:
 *                      type: string
 *                  password:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  car_plate:
 *                      type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid Credentials
 */

app.patch('/update', async (req,res) => {
	const user = await User.update(req.body.ic,req.body.name, req.body.password,req.body.phone,req.body.car_plate)
	res.json(user)
})

/**
 * @swagger
 * /update/no_ic:
 *   patch:
 *     description: Update user
 *     parameters:
 *       - in: path
 *         name: no_ic
 *         required: true
 *         content:
 *           application/json:
 *             schemas:
 *               type: object
 *               id:
 *                 type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *                 name: 
 *                   type: string
 *                 phone: 
 *                   type: string
 *                 car_plate: 
 *                   type: string
 *                 type:
 *                   type: string
 *     responses:
 *       200:
 *         description: Search Found!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name: 
 *                   type: string
 *                 phone: 
 *                   type: string
 *                 car_plate: 
 *                   type: string
 *                 type:
 *                   type: string
 *       401:
 *        description: Not found
 */

app.delete('/delete', async (req,res) => {
	const user = await User.delete(req.body.ic,req.body.name, req.body.password,req.body.phone,req.body.car_plate)
	res.json(user)
})

/**
 * @swagger
 * /delete/no_ic:
 *   delete:
 *     description: Delete user
 *     parameters:
 *       - in: path
 *         no_ic: ic
 *         required: true
 *         content:
 *           application/json:
 *             schemas:
 *               type: object
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search Found!
 *     
 */

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

const jwt = require('jsonwebtoken');
function generateAccessToken(payload) {
	return jwt.sign(payload, "secret", { expiresIn: '60s' });
}
app.use(verifyToken);
function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) return res.sendStatus(401)

	jwt.verify(token, "secret", (err, user) => {
		console.log(err)

		if (err) return res.sendStatus(403)

		req.user = user

		next()
	})
}
