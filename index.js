const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')

const ObjectId = require('mongodb').ObjectId

const port =process.env.PORT || 5000;
//middle were 
app.use(cors())
app.use(express.json())

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ytj1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('database connected')
        const services = client.db("Service-s");
        const servicesCollection = services.collection('servisce-collection');


        // app.get('/service-col', async (req, res) => {

        //     const docs = [
        //         { name: "cake", healthy: false },
        //         { name: "lettuce", healthy: true },
        //         { name: "donut", healthy: false }
        //     ];

        //     const result = await servicesCollection.insertMany(docs);

        //     res.send(result)

        // })




        app.post('/services', async (req, res) => {
            console.log('hitting')
            const service = req.body


            const result = await servicesCollection.insertOne(service)
            console.log(result)

            res.send(result)
        })

        // get all data api 



        // create all service api

        app.get('/services-all', async (req, res) => {
            const cursor = servicesCollection.find({})
            const cursorArray = await cursor.toArray()
            res.send(cursorArray)
        })

        // create single api service

        app.get('/services-all/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const cursor = await servicesCollection.findOne(query)

            res.send(cursor)
        })

        app.get('/car', (req, res)=> {
            res.send('car mechanics')
        })



        app.put('/update/:id', async (req, res) => {
            console.log('connected with put')
            const data = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const { name, description, imgUrl, price } = data;
            const updateDoc = {
                $set: {
                    name, description, imgUrl, price
                }
            };

            const result = await servicesCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('car mechanics main root server ............')
})

app.listen(port, () => {
    console.log('server is running at port', port)
})