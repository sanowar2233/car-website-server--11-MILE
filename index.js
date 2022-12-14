const express=require('express');
const cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app =express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jr3dxw2.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




// Main work for server

async function run(){

    try{
        const serviceCollection=client.db('car').collection('parts')
        const orderCollection = client.db('car').collection('orders')

        // all data get from mongodb server

        app.get('/services', async (req,res)=>{

            const query={}
            const cursor = serviceCollection.find(query);
            const services= await cursor.toArray();
            res.send(services)

        })

        // -------------------

        // just one data get by id from mongodb server

        app.get('/services/:id', async(req,res)=>{
            const id =req.params.id;
            const query={_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        // ---------------------------------

        // output

         app.get('/order', async(req,res)=>{
           
            let query={}
            if(req.query.email){
                query={
                    email:req.query.email
                }
            }
            cursor = orderCollection.find(query)
            const orders= await cursor.toArray()
            res.send(orders)

         })

// input
        app.post('/orders',async(req,res)=>{
            const order=req.body;
            const result=await orderCollection.insertOne(order)
            res.send(result)

        })

        // update----------------

        app.patch('/orders/:id', async(req, res)=>{
            const id=req.params.id;
            const status=req.body.status
            const query={_id:ObjectId(id)}
            const updatedDoc={
                $set:{
                    status:status
                }
            }
            const result=await orderCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        // DELETE----------------

        app.delete('/orders/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result=await orderCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally{
        
    }

}

run().catch(err=>console.error(err))


// 






app.get('/', (req,res)=>{
    res.send('car server')
})

app.listen(port, ()=>{
    console.log(`car server running on ${port}`)
})