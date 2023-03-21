const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose
  .connect("mongodb://localhost:27017/ReduxExemple", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log(err));

const db = mongoose.connection;

module.exports = db;