import express from "express";
import cors from "cors";
import "dotenv/config";

import cookieParser from "cookie-parser";
const app = express()
const port = 3000

app.use(
    cors({
        origin: 'http://localhost:5173/' ,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: 
        [
            "Content-Type",
            "Authorization",
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})