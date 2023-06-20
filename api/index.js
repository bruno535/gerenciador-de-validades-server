import express from 'express';
import { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';

const app = express();
const port = 4000;

// Connect to your MongoDB Atlas database
connect('mongodb+srv://yamene6353:53CQCyQP4joO9fiz@cluster0.qhy1ldt.mongodb.net/products', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the product schema
const productSchema = new Schema({
    name: String,
    date: String,
});

// Create a Product model based on the schema
const Product = model('Product', productSchema);

// Set up middleware to parse incoming JSON data
app.use(json());
app.use(cors()); // Enable CORS

// Define a route to handle the POST request
app.post('/products', async (req, res) => {
    const { name, date } = req.body;

    // Create a new Product instance
    const newProduct = new Product({
        name,
        date,
    });

    try {
        // Save the new product to the database
        await newProduct.save();
        res.status(200).json({ message: 'Product saved successfully' });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: 'Error saving product' });
    }
});

// Define a route to handle the GET request
app.get('/products', async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// Define a route to handle the DELETE request
app.delete('/products/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Remove the product from the database
        await Product.findByIdAndRemove(productId);
        res.status(200).json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ error: 'Error removing product' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});