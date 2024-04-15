const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// midlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zobqzep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// const uri = "mongodb+srv://coffeeMaster:Rhvmvy7YMCxMmznb@cluster0.zobqzep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();
        const coffeeCollection = client.db('coffeeDb').collection('coffee')
        const userCollection = client.db('coffeeDb').collection('user')

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(quary);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateCoffee = req.body;
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo

                }
            }
            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(quary);
            res.send(result);
        })
        // User related API

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        app.patch('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    lastLogedAt: user.lastLogedAt
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(quary);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee Making server is running')
})

app.listen(port, () => {
    console.log(`coffee server running on port :${port}`);
})