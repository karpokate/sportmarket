const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = connectDB();
    }
  }

  getInstance() {
    return Singleton.instance;
  }
}
module.exports = Singleton;
