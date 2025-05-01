const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Replace with your MongoDB Atlas URI
const mongoURI = "mongodb+srv://ashutosh9655:Ashu9645@cluster0.vjrn8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// ✅ Customer Schema
const customerSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    place: String,
    noOfPeople: Number,
    days: Number,
    roomId: Number,
    price: Number
});

const Customer = mongoose.model('Customer', customerSchema);

// Home Page
app.get('/', (req, res) => {
    return res.send(`
        <html><body>
        <div style="display:flex;gap:2rem;position:absolute;transform:translate(-50%,-50%);top:50%;left:50%;">
            <a href="create">Add customer</a>
            <a href="delete">Delete customer</a>
            <a href="update">Update user</a>
            <a href="read">Get user data</a>
        </div>
        </body></html>
    `);
});

// Create Customer Form
app.get('/create', (req, res) => {
    return res.send(`
        <html><body>
        <form action="/createCustomer" method="POST" style="display:flex;flex-direction:column;gap:1rem;">
            <input name="name" placeholder="Name" required />
            <input name="email" placeholder="Email" required />
            <input name="phone" placeholder="Phone" />
            <input name="place" placeholder="Place" />
            <input name="noOfPeople" placeholder="No of People" type="number" />
            <input name="days" placeholder="Days" type="number" />
            <input name="roomId" placeholder="Room ID" type="number" />
            <input name="price" placeholder="Price" type="number" />
            <button type="submit">Submit</button>
        </form>
        </body></html>
    `);
});

app.post('/createCustomer', async (req, res) => {
    const { name, email, phone, place, noOfPeople, days, roomId, price } = req.body;
    const total = noOfPeople * price * days;

    try {
        await Customer.create({ name, email, phone, place, noOfPeople, days, roomId, price });
        res.send(`<h1>Your total is ${total}</h1>`);
    } catch (err) {
        console.error(err);
        res.send(`<h1>Error creating customer</h1>`);
    }
});

// Delete Form
app.get('/delete', (req, res) => {
    res.send(`
        <html><body>
        <form action="/deleteCustomer" method="POST">
            <input name="email" type="email" placeholder="Email" required />
            <button type="submit">Delete</button>
        </form>
        </body></html>
    `);
});

app.post('/deleteCustomer', async (req, res) => {
    const { email } = req.body;
    try {
        await Customer.deleteOne({ email });
        res.send("<h1>User deleted successfully</h1>");
    } catch (err) {
        console.error(err);
        res.send("<h1>Error deleting user</h1>");
    }
});

// Update Form
app.get('/update', (req, res) => {
    res.send(`
        <html><body>
        <form action="/updateCustomer" method="POST" style="display:flex;flex-direction:column;gap:1rem;">
            <input name="email" placeholder="Email (used to identify user)" required />
            <input name="name" placeholder="New Name" />
            <input name="phone" placeholder="New Phone" />
            <input name="place" placeholder="New Place" />
            <input name="noOfPeople" type="number" placeholder="New No of People" />
            <input name="days" type="number" placeholder="New Days" />
            <input name="roomId" type="number" placeholder="New Room ID" />
            <input name="price" type="number" placeholder="New Price" />
            <button type="submit">Update</button>
        </form>
        </body></html>
    `);
});

app.post('/updateCustomer', async (req, res) => {
    const { email, ...updates } = req.body;
    try {
        await Customer.updateOne({ email }, { $set: updates });
        res.send("<h1>Details updated successfully</h1>");
    } catch (err) {
        console.error(err);
        res.send("<h1>Error updating customer</h1>");
    }
});

// Read Form
app.get('/read', (req, res) => {
    res.send(`
        <html><body>
        <form action="/readCustomer" method="POST">
            <input name="email" placeholder="Email" required />
            <button type="submit">Read</button>
        </form>
        </body></html>
    `);
});

app.post('/readCustomer', async (req, res) => {
    const { email } = req.body;
    try {
        const customer = await Customer.findOne({ email });
        if (!customer) return res.send("<h1>No customer found</h1>");
        res.send(`<pre>${JSON.stringify(customer, null, 2)}</pre>`);
    } catch (err) {
        console.error(err);
        res.send("<h1>Error retrieving customer</h1>");
    }
});

app.listen(8000, () => {
    console.log("Server listening on http://localhost:8000");
});