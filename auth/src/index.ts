import { app } from './app';

import mongoose from 'mongoose';

const start = async () => {
  console.log('starting up......');
  if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
    throw new Error('JWT_KEY must be defined!');
  }
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((result) => console.log('mongodb was successfully connected'))
    .catch((err) => console.log(err));
};

app.listen(3000, () => {
  start();
  console.log('Listening on 3000 port!');
});
