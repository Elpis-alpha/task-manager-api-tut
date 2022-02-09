const express = require('express')

const User = require('../models/User')

const Task = require('../models/Task')

const auth = require('../middleware/auth')


const router = new express.Router()


// Sends post request to create tasks
router.post('/tasks', auth, async (req, res) => {

  const newTask = new Task({

    ...req.body,

    owner: req.user._id

  })

  try {

    await newTask.save()

    res.status(201).send(newTask)

  } catch (error) {

    res.status(400).send(error)

  }

})


// Sends get request to get all tasks
router.get('/tasks', auth, async (req, res) => {

  const match = {}, sort = {}

  if (req.query.completed) {

    match.completed = req.query.completed == 'true'

  }

  if (req.query.sortBy) {

    const query = req.query.sortBy.split(':')

    query[1] = query[1] === 'asc' ? 1 : -1

    sort[query[0]] = query[1]

  }

  try {

    await req.user.populate({

      path: 'tasks',

      match, options: {

        limit: parseInt(req.query.limit),

        skip: parseInt(req.query.skip),

        sort

      }

    })

    res.send(req.user.tasks)

  } catch (error) {

    console.log(error);

    res.status(500).send({ error: 'Server Error' })

  }

})


// Sends get request to get all specific task
router.get('/tasks/:id', auth, async (req, res) => {

  const _id = req.params.id

  try {

    const task = await Task.find({ _id, owner: req.user._id })

    if (!task) {

      res.status(404).send()

    }

    res.send(task)

  } catch (error) {

    res.status(404).send()

  }

})


// Sends patch request to update tasks
router.patch('/tasks/:id', auth, async (req, res) => {

  const _id = req.params.id

  const updates = Object.keys(req.body)

  const allowedUpdate = ['completed', 'description']

  const isValidOp = updates.every(item => allowedUpdate.includes(item))

  if (!isValidOp) {

    return res.status(400).send({ error: 'Invalid Updates', allowedUpdates: allowedUpdate })

  }

  try {

    const task = await Task.findOne({ _id, owner: req.user._id })

    updates.forEach(item => task[item] = req.body[item])

    await task.save()

    // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

    if (!task) {

      res.status(404).send({ error: 'Not Found' })

    }

    res.status(201).send(task)

  } catch (error) {

    res.status(400).send(error)

  }

})


// Sends delete request to delete tasks
router.delete('/tasks/:id', auth, async (req, res) => {

  const _id = req.params.id

  try {

    const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

    if (!task) {

      return res.status(404).send()

    }

    res.send(task)

  } catch (error) {

    res.status(500).send()

  }

})


module.exports = router
