const MongoClient = require("mongodb").MongoClient;
const User = require("./user")

describe("UtemGateManagementSystem", () => {
	let client;
	beforeAll(async () => {
		client = await MongoClient.connect(
			"mongodb+srv://admin:admin@cluster0.dbs087n.mongodb.net/?retryWrites=true&w=majority",
			{ useNewUrlParser: true },
		);
		User.injectDB(client);
	})

	afterAll(async () => {
		await client.close();
	})

	test("New user registration", async () => {
		const res = await User.register("032017191754","test", "0123","02222736453","student","rte4532")
		expect(res.acknowledged).toBe("032017191754")
	})

	test("Duplicate username", async () => {
		const res = await User.register("032017191754","test", "0123","02222736453","student","rte4532")
		expect(res.acknowledged).toBe(false)
	})

	test("User login invalid username", async () => {
		const res = await User.login("032017191754","test", "0123","02222736453","student","rte4532")
		expect(res.name).toBe("User already exists")
	})

	test("User login invalid password", async () => {
		const res = await User.login("032017191754","test", "0123","02222736453","student","rte4532")
		expect(res.verification).toBe(false)
	})

	test("User login successfully", async () => {
		const res = await User.login("032017191754","test", "0123","02222736453","student","rte4532")
		expect(res.verification).toBe(true)
	})
});