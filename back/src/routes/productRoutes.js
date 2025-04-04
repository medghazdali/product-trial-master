const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - description
 *         - image
 *         - category
 *         - price
 *         - quantity
 *         - internalReference
 *         - shellId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the product
 *         code:
 *           type: string
 *           description: The product code
 *         name:
 *           type: string
 *           description: The product name
 *         description:
 *           type: string
 *           description: The product description
 *         image:
 *           type: string
 *           description: The product image URL
 *         category:
 *           type: string
 *           description: The product category
 *         price:
 *           type: number
 *           description: The product price
 *         quantity:
 *           type: number
 *           description: The product quantity
 *         internalReference:
 *           type: string
 *           description: The internal reference
 *         shellId:
 *           type: number
 *           description: The shell ID
 *         inventoryStatus:
 *           type: string
 *           enum: [INSTOCK, LOWSTOCK, OUTOFSTOCK]
 *           description: The inventory status
 *         rating:
 *           type: number
 *           description: The product rating
 *         createdAt:
 *           type: number
 *           description: The creation timestamp
 *         updatedAt:
 *           type: number
 *           description: The update timestamp
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *           example:
 *             code: "PROD001"
 *             name: "Test Product"
 *             description: "This is a test product description"
 *             image: "https://example.com/image.jpg"
 *             category: "Electronics"
 *             price: 99.99
 *             quantity: 10
 *             internalReference: "INT001"
 *             shellId: 1
 *             inventoryStatus: "INSTOCK"
 *             rating: 5
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               code: "PROD001"
 *               name: "Test Product"
 *               description: "This is a test product description"
 *               image: "https://example.com/image.jpg"
 *               category: "Electronics"
 *               price: 99.99
 *               quantity: 10
 *               internalReference: "INT001"
 *               shellId: 1
 *               inventoryStatus: "INSTOCK"
 *               rating: 5
 *               createdAt: 1718114215761
 *               updatedAt: 1718114215761
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fields:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               message: "Missing required fields"
 *               fields: ["price", "quantity", "shellId"]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               message: "Server error"
 *               error: "Error message details"
 */
router.post('/', auth, async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['code', 'name', 'description', 'image', 'category', 'price', 'quantity', 'internalReference', 'shellId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    // Validate data types
    if (typeof req.body.price !== 'number' || req.body.price < 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    if (typeof req.body.quantity !== 'number' || req.body.quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    if (typeof req.body.shellId !== 'number') {
      return res.status(400).json({ message: 'Shell ID must be a number' });
    }

    // Validate inventory status
    const validStatuses = ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'];
    if (req.body.inventoryStatus && !validStatuses.includes(req.body.inventoryStatus)) {
      return res.status(400).json({ message: 'Invalid inventory status' });
    }

    // Check if product code already exists
    const existingProduct = await Product.findOne({ code: req.body.code });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product code already exists' });
    }

    // Create new product
    const product = new Product({
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 