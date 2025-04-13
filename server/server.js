import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import adminProductsRouter from "./routes/admin/products-routes.js"
import shopProductsRouter from "./routes/shop/products-routes.js"
import shopCartRouter from "./routes/shop/cart-routes.js"

const app = express()
const port = 3000

app.use(
    cors({
        origin: 'http://localhost:5173' ,
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

app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})