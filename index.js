const mysql = require('mysql2')
const express = require("express");
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({extended:true}))


const db = mysql.createConnection({
    user: 'root',
    password:'Password@492004',
    database: 'HOTEL' 
})

db.connect(()=>{
    console.log("db connected");
    
    let q = 'CREATE DATABASE IF NOT EXISTS HOTEL'

    db.query(q, (err, res)=>{
        // if(err)
        // console.log(err);
        // else console.log(res);
    })


    q = 'USE hotel';
    db.query(q);

    q = `CREATE TABLE IF NOT EXISTS customer(
        name VARCHAR(20),
        email VARCHAR(20),
        phone VARCHAR(20),
        place VARCHAR(20),
        noOfPeople INT,
        days INT,
        roomId INT,
        price INT
    )`

    db.query(q, (err, res)=>{
        // if(err) console.log(err);
        // else console.log(res);
        
        
    });

})


app.get('/', (req, res)=>{
    return res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="display: flex; gap: 2rem; position: absolute; transform: translate(-50%, -50%); top: 50%; left: 50%;">
        <a href="create">Add cutomer</a>
        <a href="delete">delete cutomer</a>
        <a href="update">Update user</a>
        <a href="read">Get user data</a>
    </div>
</body>
</html>
        `);
})


app.get('/create', (req, res)=>{
    return res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
        <form style="display: flex; gap: 2rem; flex-direction:column;" action="/createCustomer" method="POST">
        <div>
            <label for="name">name</label>
            <input type="text" name="name" id="name">
        </div>
        <div>
            <label for="email">email</label>
            <input type="text" name="email" id="email">
        </div>
        <div>
            <label for="phone">phone</label>
            <input type="text" name="phone" id="phone">
        </div>
        <div>
            <label for="place">place</label>
            <input type="text" name="place" id="place">
        </div>
        <div>
            <label for="noOfPeople">no Of people</label>
            <input type="number" name="noOfPeople" id="noOfPeople">
        </div>
        <div>
            <label for="days">days</label>
            <input type="number" name="days" id="days">
        </div>
        <div>
            <label for="roomId">roomId</label>
            <input type="number" name="roomId" id="roomId">
        </div>
        <div>
            <label for="price">price</label>
            <input type="number" name="price" id="price">
        </div>
        <button type="submit">Submit</button>
    </form>
    </div>
</body>
</html>
        `);
})


function insertInToTable(name, email, phone, place, noOfPeople, days, roomId, price){
    const q = `
        INSERT INTO customer 
        (name, email, phone, place, noOfPeople, days, roomId, price)
        VALUES (?,?,?,?,?,?,?,?)
    `

    db.query(q, [name, email, phone, place, noOfPeople, days, roomId, price], (err, res)=>{
        if(err){
            console.log(err);
        } else{
            console.log(res);
        }
    })
}



app.post('/createCustomer', (req, res)=>{
    console.log(req.body);

    const {name, email, phone, place, noOfPeople, days, roomId, price} = req.body;

    const total = noOfPeople*price*days;
    
    insertInToTable(name, email, phone, place, noOfPeople, days, roomId, price);

    return res.send(`<h1>Your total is ${total}<h1>`)
    
})




app.get('/delete', (req, res)=>{
    res.send(
       `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <form action="/deleteCustomer" method="post">
            <label for="email">Email</label>
            <input type="email" name="email" id="email">
            <button type="submit"> submit</button>
        </form>
    </div>
</body>
</html>
        `
    )
})


function deleteFromTable({email}){
    const q = 'DELETE FROM customer WHERE email = ?'
    let f = 0;
    db.query(q, [email], (err, res)=>{
        if(err){
            console.log(err);
        } else{
            console.log("user deleted successfully");
            f=1;
        }
    })

    return f;
}


app.post('/deleteCustomer', (req, res)=>{
    deleteFromTable(req.body);
    res.send("<h1>User deleted succesffulyy</h1>")
})

app.get('/update', (req, res)=>{
    return res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="position: absolute; top:50%; left:50%; transform:translate(-50%, -50%);">
        <form style="display: flex; gap: 2rem; flex-direction:column;" action="/updateCustomer" method="POST">
        <div>
            <label for="name">name</label>
            <input type="text" name="name" id="name">
        </div>
        <div>
            <label for="email">email</label>
            <input type="text" name="email" id="email">
        </div>
        <div>
            <label for="phone">phone</label>
            <input type="text" name="phone" id="phone">
        </div>
        <div>
            <label for="place">place</label>
            <input type="text" name="place" id="place">
        </div>
        <div>
            <label for="noOfPeople">no Of people</label>
            <input type="number" name="noOfPeople" id="noOfPeople">
        </div>
        <div>
            <label for="days">days</label>
            <input type="number" name="days" id="days">
        </div>
        <div>
            <label for="roomId">roomId</label>
            <input type="number" name="roomId" id="roomId">
        </div>
        <div>
            <label for="price">price</label>
            <input type="number" name="price" id="price">
        </div>
        <button type="submit">Update</button>
    </form>
    </div>
</body>
</html>
        `);
})

function updateCustomerIntoTabel({name, email, phone, place, noOfPeople, days, roomId, price}){
    const q = `
        UPDATE customer
        SET name=?, email=?, phone=?, place=?, noOfPeople=?, days=?, roomId=?, price=?
       WHERE email = ?
    `
    console.log("hello", name, email, phone, place, noOfPeople, days, roomId, price,"fone");
    
    db.query(q, [name, email, phone, place, noOfPeople, days, roomId, price, email], (err, res)=>{
        if(err){
            console.log("err: ", err);
        } else{
            console.log("res: ", res);
        }
    })
}


app.post('/updateCustomer', (req, res)=>{
    console.log("body: ", req.body);
    
    updateCustomerIntoTabel(req.body);
    res.send("<h1>details updated successfully</h1>");

})


function getDate({email}, res){
    console.log(email);
    
    
}

app.get('/read', (req, res)=>{
    res.send(
        `
        <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Document</title>
 </head>
 <body>
     <div>
         <form action="/readCustomer" method="post">
             <label for="email">Email</label>
             <input type="email" name="email" id="email">
             <button type="submit"> submit</button>
         </form>
     </div>
 </body>
 </html>
         `);
})


app.post('/readCustomer', (req, res)=>{
    const {email} = req.body;
    const q = `
        SELECT * FROM customer WHERE email = ?
    `;

    const data = db.query(q, [email], (err, resu)=>{
        if(err) console.log(err);
        else res.send(resu[0]);
    });
    
})


app.listen(8000, ()=>{
    console.log("server lostening on  http://localhost:8000");
})


// insertInToTable('a', "a@gmail.com", 1, "a", 1, 1, 1, 100);
// insertInToTable('b', "b@gmail.com", 2, "b", 2, 2, 2, 200);
// insertInToTable('c', "c@gmail.com", 3, "c", 3, 3, 3, 200);