// password - gctxIGT4OwwEiwSX
// mongodb+srv://<db_username>:gctxIGT4OwwEiwSX@backendproject2.sw5go6k.mongodb.net/
const mongoose = require('mongoose');

function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('database connected successfully');
        })
        .catch((err) => {
            console.error('Error connecting to database:', err);
            process.exit(1);
        });
}

module.exports = connectDB;