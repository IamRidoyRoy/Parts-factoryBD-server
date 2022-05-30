const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('bike-parts-factory');
})

app.listen(port, () => {
    console.log('Listening to port', port)
})

// Connect Database

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.piip8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('parts-factory').collection('product');

        // Create an Api for get services data 
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })

        // Get a single product by using id 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await productCollection.findOne(query);
            res.send(services);

        })

    }
    finally {

    }
}

run().catch(console.dir);

