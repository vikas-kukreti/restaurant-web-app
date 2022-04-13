const express = require("express")
const mysql = require("mysql")
const cors = require("./cors")

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
})

const server = express()

server.use(cors)
server.use(express.json())
server.use(express.urlencoded())

server.use((req, res, next) => {
    setTimeout(next, 500);
})

server.get("/", (req, res) => {
    res.json("Weclome")
})

server.post('/login', (req, res) => {
    const {mobile, name, table} = req.body
    connection.query("SELECT * FROM users WHERE mobile = ?", [mobile], (err, result) => {
        if(err) {
            console.log(err)
            
        } else {
            if(result.length > 0) {
                const row = result[0]
                connection.query("UPDATE users SET table_no = ? WHERE id = ?",[table, row.id], (err, result) => {
                    if(!err) {
                        res.json({
                            status: 1,
                            message: "Login Success!"
                        })
                    } else {
                        res.json({
                            status: 0,
                            message: "Login Failed, unable to feed your table no!"
                        })
                    }
                })
            } else {
                connection.query("INSERT INTO users (mobile, user_name, table_no) VALUES(?, ?, ?)", [mobile, name, table], (err, result) => {
                    if(err) {
                        console.log(err)
                        res.json({
                            status: 0,
                            message: "Login Failed, unable to create your account!"
                        })
                    } else {
                        res.json({
                            status: 1,
                            message: "Login Success!"
                        })
                    }
                })
            }
        }
    })
})

server.get('/food-items' ,(req ,res) =>{
    connection.query("SELECT * FROM fooditems ", (err ,result)=> {
        console.log(err, result)
        res.json({
            status:1,
            message:"",
            items : result
        })
    })
})

server.listen(8080, () => {
    console.log("App is running at 8090!")
})