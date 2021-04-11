const express = require('express');
const routes = express.Router();
const DashboardController = require('./controllers/DashboardController');
const ProfileController = require('./controllers/ProfileController');
const JobController = require('./controllers/JobController');

routes.get('/', DashboardController.index);
routes.get('/job', JobController.create);
routes.post('/job', JobController.store);
routes.get('/job/:id/edit', JobController.show);
routes.post('/job/:id/update', JobController.update);
routes.post('/job/delete/:id', JobController.delete);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;