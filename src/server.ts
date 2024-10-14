import mongoose from "mongoose";
import { app } from "./app";
import config from "./app/config";

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      console.log(`Uni Link Server App Listening On Port ${config.port}`);
    });
  } catch (error) {
    console.log(error, "Database Connection Failed");
  }
}

main();
