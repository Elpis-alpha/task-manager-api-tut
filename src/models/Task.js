const mongoose = require('mongoose')

const validator = require('validator')


const taskSchema = new mongoose.Schema({

  owner: {

    type: mongoose.Schema.Types.ObjectId,

    required: true,

    ref: 'User'

  },

  description: {

    type: String,

    trim: true,

    required: true,

  },

  completed: {

    type: Boolean,

    default: false

  }

}, {
  timestamps: true
})

// Task Model
const Task = mongoose.model('Task', taskSchema)

module.exports = Task
