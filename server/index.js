require('dotenv').config();
const express = require('express');
const route = require('./routes');
const connectDb = require('./db/connectDb');
const cors = require('cors');

const app = express();
connectDb();

app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(express.json());
route(app);

const PORT = 4444;
app.listen(PORT, () => console.log(`server runing at port: ${PORT}`));