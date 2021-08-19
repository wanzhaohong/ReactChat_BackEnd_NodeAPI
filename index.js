const express = require('express');
const app = express();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

//routes
const userRoute = require('./Routes/users');
const authRoute = require('./Routes/auth');
const convrRoute = require('./Routes/conversations');
const msgRoute = require('./Routes/messages');

dotenv.config();

const PORT = process.env.PORT || 8900;

//Connect to MongoDB server
mongoose.connect(
    process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected.'))
    .catch(err => console.log(err));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(cors());


//Routes
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/conversation', convrRoute);
app.use('/api/message', msgRoute);

//request
app.get('/', (req, res) => {
    res.send('welcome to homepage');
})

app.listen(PORT, () => {
    console.log('Server is running.');
});