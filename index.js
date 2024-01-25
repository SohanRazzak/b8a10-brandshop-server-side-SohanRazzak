import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import all_brands from './brands.js'

const app = express();
const port = process.env.PORT || 5001;
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// MongDB Connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;

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


        // Collections
        const database = client.db("Technocare");
        const userCollection = database.collection("userCollection");
        const productCollection = database.collection("productCollection");


        // Users EndPoints

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/users/:uid', async (req, res) => {
            const uid = req.params.uid;
            const filter = { uid: uid };
            const result = await userCollection.findOne(filter);
            res.send(result)
        })

        // User cart
        app.get('/users/cart/:uid', async (req, res) => {
            const uid = req.params.uid;
            const filter = { uid: uid };
            const result = await userCollection.findOne(filter);
            res.send(result.cart)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // app.delete('/users/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const filter = { _id : new ObjectId(id)};
        //     const result = await userCollection.deleteOne(filter);
        //     res.send(result);
        // })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true }
            const updateUser = {
                $set: {
                    displayName: user.displayName,
                    email: user.email,
                    photo: user.photo,
                    createdAt: user.createdAt,
                    lastLoggeddAt: user.lastLoggeddAt,
                    verified: user.verified,
                    uid: user.uid,
                }
            }

            const result = await userCollection.updateOne(filter, updateUser, options);
            res.send(result)
        })

        app.patch('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateUser = {
                $set: {
                    lastLoggeddAt: user.lastLoggeddAt
                }
            }

            const result = await userCollection.updateOne(filter, updateUser);
            res.send(result)
        })

        

        // Patch User Cart
        app.patch('/users/cart', async(req, res)=>{
            const userCart = req.body;
            const filter = { email : userCart.email };
            const options = { upsert : true };
            const updatedCart = {
                $set : {
                    cart : userCart.updatedCart
                }
            }
            const result = await userCollection.updateOne(filter, updatedCart, options);
            res.send(result)
        })

        // Products Endpoints

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Product by sku
        app.get('/products/:sku', async (req, res) => {
            const sku = parseInt(req.params.sku);
            const filter = { sku: sku };
            const result = await productCollection.findOne(filter);
            res.send(result)
        })

        // Product by pathname
        app.get('/products/pathname/:pathname', async (req, res) => {
            const pathname = req.params.pathname;
            const filter = { pathname: pathname };
            const result = await productCollection.findOne(filter);
            res.send(result)
        })

        // new product
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })

        // update product
        app.put('/products', async (req, res) => {
            const product = req.body;
            const filter = { sku: product.sku };
            const options = { upsert: false }
            const upadatedProduct = {
                $set: {
                    gadgetName: product.gadgetName,
                    brand: product.brand,
                    rating: product.rating,
                    sku: product.sku,
                    pathname: product.pathname,
                    category: product.category,
                    details: product.details,
                    photo: product.photo,
                    price: product.price
                }
            }
            const result = await productCollection.updateOne(filter, upadatedProduct, options)
            res.send(result)
        })

        // Product by brand
        app.get('/products/brand/:brand', async (req, res) => {
            const brand = req.params.brand;
            const filter = { brand: brand }
            const cursor = productCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Product by type
        app.get('/products/category/:category', async (req, res) => {
            const category = req.params.category;
            const filter = { category: category }
            const cursor = productCollection.find(filter);
            const result = await cursor.toArray();
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



// Basic Code

app.get('/', (req, res) => {
    res.send(`
    <p style="display : flex; justify-content: center; align-items: center; height: 100%; text-align: center; font-size: 4rem; color: #ea4459;">
    Technocare
    <br/>
    at your service
    </p>
    `)
})

app.get('/all_brands', (req, res)=> {
    res.send(all_brands);
})

app.listen(port, () => console.log(`Server Port ${port}`))