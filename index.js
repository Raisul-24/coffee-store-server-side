const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 2000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxdrhxr.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('user');

    app.get('/coffee', async(req,res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })


    app.post('/coffee', async(req,res)=>{
      const newCoffee = req.body;
      console.log(newCoffee);

      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    })
// new user

    app.get('/user',async(req,res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/user', async(req,res) =>{
      const newUser = req.body;
      console.log(newUser);

      const result = await userCollection.insertOne(newUser);
      res.send(result)
    })


    app.delete('/coffee/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/coffee/:id',async(req,res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedCoffee = {
         $set: {
            name:req.body.name, 
            chef:req.body.chef, 
            supplier:req.body.supplier,
             taste:req.body.taste, 
             category:req.body.category, 
             details:req.body.details,
            photo:req.body.photo, 
            price:req.body.price 
         }
      }
      const result = await coffeeCollection.updateOne(filter, updatedCoffee, options);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('Hello World!')
 })
 
 app.listen(port, () => {
   console.log(`Example app listening on port ${port}`)
 })