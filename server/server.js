const app = require('./app')
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({path:'./config.env'});


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB()


console.log(process.env.NODE_ENV)
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on ${process.env.NODE_ENV} environment`)
})

process.on('unhandledRejection',err=>{
  console.log(err.name,err.message);
  console.log('Unhandled Rejection');
  server.close(()=>{
    process.exit(1)
  })
})


process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  process.exit(1); // Let Nodemon restart the app
});


