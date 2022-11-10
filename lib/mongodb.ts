/* This is a database connection function*/
import mongoose from "mongoose";

const connection = { isConnected: 0 }; /* creating connection object*/

async function dbConnect() {
  const uri = process.env.MONGODB_URI as string;
  if (connection.isConnected) {
    return;
  }

  try {
    console.log("connecting to database");
    let db = await mongoose.connect(uri);
    if (db.connections[0].readyState) {
      connection.isConnected = db.connections[0].readyState;
      console.log("successful connection");
    }
  } catch (err) {
    console.log("Failed to connect to database, Error: ", err);
    throw err;
  }
}

export default dbConnect;
