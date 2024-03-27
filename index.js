const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const port = 3000
app.use(express.json());
app.use(cookieParser());
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');

app.use('/auth', authRoutes)
app.use('/', userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})