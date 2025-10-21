
/**
 * @swagger
 * /order/:
 *   post:
 *     summary: Create a new order from user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contactInfo:
 *                 type: object
 *                 example: { email: "user@example.com", phone: "+2348012345678" }
 *               deliveryInfo:
 *                 type: object
 *                 example: { address: "123 Street, Lagos" }
 *               billingAddress:
 *                 type: string
 *                 example: "123 Billing Street"
 *     responses:
 *       201:
 *         description: Order created successfully with payment link
 */

/**
 * @swagger
 * /order/verifypayment:
 *   post:
 *     summary: Verify a payment transaction
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference:
 *                 type: string
 *                 example: "pay_123abc"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /order/user:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       404:
 *         description: No orders found
 */

/**
 * @swagger
 * /order/status:
 *   patch:
 *     summary: Update an order's status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "651f3c9aab12cd00123abcd4"
 *               status:
 *                 type: string
 *                 enum: [pending, shipped, delivered, canceled]
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status or amount mismatch
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /order/{id}:
 *   patch:
 *     summary: Soft delete an order (mark as deleted)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order soft-deleted successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Hard delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order permanently deleted
 *       404:
 *         description: Order not found
 */
