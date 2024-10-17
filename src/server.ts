import mongoose from 'mongoose';
import { app } from './app';
import config from './app/config';

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database Connected Successfully');

    app.listen(config.port, () => {
      console.log(`Uni Link Server Is Listening On Port ${config.port}`);
    });
  } catch (error) {
    console.log(error, 'Database Connection Failed');
  }
}

main();
