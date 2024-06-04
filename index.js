
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// import 'dotenv/config';
//midleware

app.use(cors());
app.use(express.json());

// console.log(process.env.USER);
// console.log(process.env.PASS);


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.njjghgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db("coffeeshop");
    const coffee = database.collection("coffee");

    app.post('/coffee', async(req, res)=>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffee.insertOne(newCoffee);
      res.send(result);
    })
    //find from database
    app.get('/coffee', async(req, res)=>{
      const cursor = coffee.find();
      if((await cursor.count()) === 0){
        console.log("No document found");
      }
      const result= await cursor.toArray();
      res.send(result);
    })
    //delete from database
    app.delete('/coffee/:id', async(req, res)=>{
      console.log("Delete hit properly")
      const id= req.params.id;
      const query={_id: new ObjectId(id)}
      const result = await coffee.deleteOne(query);
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

app.get('/', (req, res)=>{
    res.send("Server is working properly!");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})
