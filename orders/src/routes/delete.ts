import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotAuthorizedError,
  NotFoundError,
} from '@argonticketing/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.set({
      status: OrderStatus.Cancelled,
      version: order.version + 1,
    });

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id!,
      version: order.version,
      ticket: {
        id: order.ticket.id!,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
