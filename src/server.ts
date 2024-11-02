import mongoose from 'mongoose';
import { app } from './app';
import config from './app/config';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database Connected Successfully');

    server = app.listen(config.port, () => {
      console.log(`Uni Link Server Is Listening On Port ${config.port}`);
    });
  } catch (error) {
    console.log(error, 'Database Connection Failed');
  }
}

main();

// for asynchronous operations
process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection Is Detected!! Shutting Down.');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// for synchronous operations
process.on('uncaughtException', () => {
  console.log('Uncaught Exception Is Detected!! Shutting Down.');
  process.exit(1);
});
