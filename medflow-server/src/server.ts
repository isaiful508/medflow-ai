import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

async function server() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Connected to mongodb database');
    app.listen(config.port, () => {
      console.log(`Server is running on ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}


server();
