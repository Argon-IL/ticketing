import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

import mongoose from 'mongoose';

const start = async () => {
  console.log('starting...');
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

    // process.on('SIGINT', () => natsWrapper.client.close());
    // process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log('connected to MongoDB'));
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  start();
  console.log('Listening on 3000 port!');
});
