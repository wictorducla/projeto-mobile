const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = express();
const mongoose = require('mongoose');
require('./Product');
app.use(express.json({ limit: '10kb' }));

const Product = mongoose.model('product');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('connected to mongo yeahhh');
});
mongoose.connection.on('error', (err) => {
  console.log('error', err);
});

app.get('/', (req, res) => {
  Product.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/send-data', (req, res) => {
  const product = new Product({
    name: req.body.name,
    type: req.body.type,
    weight: req.body.weight,
    fuction: req.body.fuction,
    price: req.body.price,
    benefits: req.body.benefits,
  });
  product
    .save()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete('/delete', (req, res) => {
  Product.findByIdAndRemove(req.body.id)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put('/update', (req, res) => {
  Product.findByIdAndUpdate(req.body.id, {
    name: req.body.name,
    type: req.body.type,
    weight: req.body.weight,
    fuction: req.body.fuction,
    price: req.body.price,
    benefits: req.body.benefits,
  })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server running');
});
