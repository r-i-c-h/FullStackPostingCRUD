const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    };
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error(`PROBLEM!: ${error}`);
    process.exit(1); // shutdown
  }
};

module.exports = connectDB;