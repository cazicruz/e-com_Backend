/**
 * @swagger
 * /products/:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt"
 *               description:
 *                 type: string
 *                 example: "A cool cotton t-shirt"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: JSON array string, e.g. '["clothing","summer"]'
 *               stock:
 *                 type: integer
 *                 example: 10
 *               brand:
 *                 type: string
 *                 example: "Nike"
 *               length:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                   unit:
 *                     type: string
 *                 example:
 *                   value: 10
 *                   unit: "inches"
 *               color:
 *                 type: string
 *                 example: "red"
 *               popularity:
 *                 type: integer
 *                 example: 0
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid input or too many images
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categories:
 *                 type: string
 *               stock:
 *                 type: integer
 *               brand:
 *                 type: string
 *               length:
 *                 type: string
 *               color:
 *                 type: string
 *               popularity:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid input or too many images
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/bulk-delete:
 *   delete:
 *     summary: Bulk delete products
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       204:
 *         description: Products deleted
 *       404:
 *         description: No products found
 */

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Change product stock
 *     tags: [Product]
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
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{id}/popularity:
 *   patch:
 *     summary: Change product popularity
 *     tags: [Product]
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
 *             type: object
 *             properties:
 *               popularity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Popularity updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{id}/images:
 *   patch:
 *     summary: Update product images
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               index:
 *                 type: integer
 *                 description: Index to update (optional)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *     responses:
 *       200:
 *         description: Images updated
 *       400:
 *         description: Invalid images or index
 *       404:
 *         description: Product not found
 */