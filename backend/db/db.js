const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connection with Mongo: ON");
  } catch (error) {
    console.log("Connection with Mongo: Failed", error);
    throw console.log("Error connection with MongoDB");
  }
};

module.exports = { dbConnection };
