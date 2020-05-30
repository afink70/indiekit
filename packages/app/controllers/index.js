import express from 'express';
import assetsController from './assets.js';
import documentationController from './documentation.js';
import homepageController from './homepage.js';
import micropubController from './micropub.js';
import settingsController from './settings.js';
import loginController from './login.js';
import errorController from './error.js';

const router = express.Router(); // eslint-disable-line new-cap

// Attach routes to router
assetsController(router);
documentationController(router);
homepageController(router);
micropubController(router);
settingsController(router);
loginController(router);
errorController(router);

export default router;