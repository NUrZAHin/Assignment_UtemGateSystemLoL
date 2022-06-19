let users;
const bcrypt = require("bcryptjs")
class User {
    static async injectDB(conn) {
        users = await conn.db("Utemgateutem").collection("visitor")
    }

    static async register(ic,name,password,phone,type,car_plate) {
        // TODO: Check if username exists
        const db = users
        const user = await db.findOne({
                no_ic : ic
            })
            if(user){
                return false
            }
        // TODO: Hash password
        const saltRounds = 10
        const newPass = await bcrypt.hashSync(password, saltRounds)

        // TODO: Save user to database
        const data = {
            no_ic: ic,
            name: name,
            phone: phone,
            password: newPass,
            type: type,
            car_plate: car_plate,
            verification : true
            
            
        }
        const result = await db.insertOne(data)
        return result

    }

    static async login(ic,name,password,phone,type,car_plate) {
        // TODO: Check if username exists
        const db = users

        const result = await db.findOne({no_ic: ic})
        
        if (!result) {
            console.log("Not found name")
            return ("User already exists")
        }

        const validate = await bcrypt.compare(password,result.password);
                    if (
                        !validate
                    ) {
                        console.log('Invalid')
                        return false
                    }
        console.log('Verified')
        return true
                    
                

        // TODO: Return user
    }

    static async update(ic,name,password,phone,type,car_plate){
        const db = users
        const saltRounds = 10
        const newPass = await bcrypt.hashSync(password, saltRounds)

        const result = await db.findOne({no_ic: ic});
        if(!result){
            return false
        }
        return await db.updateOne({
            "no_ic": ic
        },{
            $set : { 
                no_ic: ic,
                name: name,
                phone: phone,
                password: newPass,
                type: type,
                car_plate: car_plate
            }
        })
    }
    static async delete(ic,name,password,phone,type,car_plate){
        const db = users
        const result = await db.findOne({no_ic: ic});
        if(!result){
            return false
        }
        return await db.deleteOne({no_ic: ic})
    }

    static async check(ic,name,password,phone,type,car_plate){
        const db = users
        const result = await db.findOne({no_ic: ic});
        if(!result){
            return false
        }
        return await result
    }
}

module.exports = User;