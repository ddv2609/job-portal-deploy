const mongoose = require("mongoose");

require("dotenv").config();

async function connect() {
  await mongoose.connect(process.env.mongoAtlasURI)
    .then(() => console.log(`Connected to MongoAtlas`))
    .catch((err) => console.error(`MongoDB connection error: ${err}`));
}

module.exports = {
  connect,
}
