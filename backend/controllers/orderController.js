import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

export const addOrderItems = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice,
        taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items');
        return
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        const createdOrder = await order.save();
        res.status(201).json(
            createdOrder
        )
    }

});

export const getOrderById = asyncHandler(async (req, res) => {
    const order =
        await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order)
    }

    else {
        res.status(404)
        throw new Error('Order not found')
    }

});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    console.log(req.body);

    if (order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        }
        const updateOrder = await order.save();

        res.json(updateOrder);

    }

    else {
        res.status(404)
        throw new Error('Order not found')
    }

});


export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })

    res.json(orders);
})


export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('row0.user', 'id name')

    res.json(orders);
})


export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    console.log(req.body);

    if (order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updateOrder = await order.save();
        res.json(updateOrder);
    }

    else {
        res.status(404)
        throw new Error('Order not found')
    }

});