import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 5001;
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());



// Basic Code

app.get('/', (req, res)=> {
    res.send(`
    <p style="display : flex; justify-content: center; align-items: center; height: 100%; text-align: center; font-size: 4rem; color: #ea4459;">
    Technocare
    <br/>
    at your service
    </p>
    `)
})

app.listen(port, ()=> console.log(`Server Port ${port}`))