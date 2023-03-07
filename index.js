const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ekuronr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        const catagoryCollection = client.db('weddingAccessories').collection('catagories');
        const productsCollection = client.db('weddingAccessories').collection('categoryproducts');
        const bookedCollection = client.db('weddingAccessories').collection('bookeddatabase');
        const userCollection = client.db('weddingAccessories').collection('usersdatabase');


        //JWT implement
        app.get('/jwt', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const user = await userCollection.findOne(query);
            if(user){
              const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '10d'})
              return res.send({tokenForAccess: token});
            }
            res.status(403).send({tokenForAccess: 'congratulation you have got ghorar egg'})
          })
    

        //catergory collection
        app.get('/catagory', async (req, res) => {
            const query = {};
            const catagoryitem = await catagoryCollection.find(query).toArray();
            res.send(catagoryitem);
        });



        //category product collection get
        app.get('/products', async (req, res) => {
            console.log(req.query)
            let query = {};
            if (req.query.product_category) {
                query = {
                    product_category: req.query.product_category

                }
            }

            const cursor = productsCollection.find(query);
            const productItem = await cursor.toArray();
            res.send(productItem);
        });



        //modal data sending
        app.post('/bookdata', async (req, res) => {
            const book = req.body;
            console.log(book);
            const result = await bookedCollection.insertOne(book);
            res.send(result);
        });



        //uploading user information
        app.post('/users', async (req, res) => {
            const userInformation = req.body;
            console.log(userInformation);
            const result = await userCollection.insertOne(userInformation);
            res.send(result);
        });






    }
    finally {

    }
}

run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('Used Wedding Accessories Is Running')
})

app.listen(port, () => {
    console.log(`Port is running in ${port}`);
})