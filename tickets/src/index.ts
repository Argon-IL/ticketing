import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

import mongoose from 'mongoose';

const start = async () => {
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error('JWT_KEY and MONGO_URI must be defined!');
  }
  if (
    !process.env.NATS_URL ||
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_CLIENT_ID
  ) {
    throw new Error(
      'NATS_URL, NATS_CLUSTER_ID and NATS_CLIENT_ID must be defined!'
    );
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log('Connected to MongoDB'));
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  start();
  console.log('Listening on 3000 port!');
});
