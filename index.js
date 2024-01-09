const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://twitter_admin:${process.env.DB_PASSWORD}@twitterclone.qsbm7qu.mongodb.net/?retryWrites=true&w=majority`;
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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    await client.connect();
    const postCollection = client.db('database').collection('posts')//this is post collection
    const userCollection = client.db('database').collection('users')//this is post collection
    
    
    //get
    app.get('/post',async(req,res)=>{
        const post = (await postCollection.find().toArray()).reverse(); 
        res.send(post);
    })
    app.get('/user',async(req,res)=>{
        const user = await userCollection.find().toArray(); 
        res.send(user);
        // console.log(user);
    })



    app.get('/loggedInUser', async(req,res)=>{
      const email = req.query.email;
      const user = await userCollection.find({ email:email }).toArray();
      res.send(user)
      // console.log(user);
    })

    app.get('/userPost', async(req,res)=>{
      const email = req.query.email;
      const post = (await postCollection.find({ email:email }).toArray()).reverse()
      res.send(post)
      // console.log(user);
    })

 

    //post
    app.post('/post',async(req,res)=>{
        const post = req.body;
        const result = await postCollection.insertOne(post);
        res.send(result);   
      
      })

      app.post('/register',async(req,res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user)
        res.send(result);
      })
   

      //patch Method

      app.patch('/userUpdates/:email',async(req,res)=>{
            const filter = req.params;
            const profile = req.body;
            const option = { upsert: true };
            const updateDoc = { $set: profile};
            const result = await userCollection.updateOne(filter,updateDoc,option)

            res.send(result);
          })
      





} catch(error) {
    // Ensures that the client will close when you finish/error
    // await client.close();
    console.log(error.message);

  }
} 
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("hai !!")
})


app.listen(PORT,()=>{
   console.log( `Server running on ${PORT}`);
})