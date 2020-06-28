import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import {actionController} from './controllers/action.js';
import {postsController} from './controllers/posts.js';
import {queryController} from './controllers/query.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/micropub'
};

export const MicropubEndpoint = class {
  constructor(options) {
    this.id = 'micropub';
    this.name = 'Micropub endpoint';
    this.options = options || defaults;
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    application.navigationItems.push({
      href: `${this.mountpath}/posts`,
      text: 'Posts'
    });

    application.routes.push({
      mountpath: this.mountpath,
      routes: () => this.routes(publication)
    });

    application.views.push(path.join(__dirname, 'views'));

    publication['micropub-endpoint'] = this.mountpath;
  }

  routes(publication) {
    const router = this._router;

    this._router.get('/', queryController(publication));
    this._router.post('/', actionController(publication));
    this._router.get('/posts', postsController(publication).view);

    return router;
  }
};
