const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();



const port = process.env.PORT || 8080


const app = express();
app.use(bodyParser.json())
app.use(cors())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olhny.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("car-wash-server").collection("services");
  const serviceCollection = client.db("car-wash-server").collection("service");
  const reviewCollection = client.db("car-wash-server").collection("review");
  const ordersCollection = client.db("car-wash-server").collection("orders");
  const adminsCollection = client.db("car-wash-server").collection("admin");
  app.get('/service', (req, res) => {
    servicesCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });
  app.post('/addService', (req, res) => {
    const services = req.body;
    serviceCollection.insertOne(services)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });
  app.post('/addAdmin', (req, res) => {
    const admin = req.body;
    adminsCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });
  app.post('/addReview', (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  });
  app.get('/services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })
  });
  app.get('/review', (req, res) => {
    reviewCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents)
      })
  });
  app.post('/orders', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({email: email})
      .toArray((err, admin) => {
        if (admin.length === 0) {
          ordersCollection.find({email: email})
      .toArray((err, documents) => {
        console.log(err, documents)
        res.send(documents)
      })
        }else{ordersCollection.find({})
          .toArray((err, documents) => {
            res.send(documents)
          })}
      })
    
  })
  app.get('/admin', (req, res)=>{
    adminsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })
  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({email: email})
      .toArray((err, admin) => {
        res.send(admin.length > 0)
    
  })
});
})



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)