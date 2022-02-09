const express = require('express')

const multer = require('multer')

const userRouter = require('./routers/user')

const mongoose = require('./db/mongoose')

const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT

// Automatically parse incoming reqests
app.use(express.json())


// Automatically allows user routers
app.use(userRouter)


// Automatically allows task routers
app.use(taskRouter)


// Start Server
app.listen(port, () => {

  console.log("\n\nServer is running on port " + port);

})
