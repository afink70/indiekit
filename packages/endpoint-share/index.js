import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {shareController} from './controllers/share.js';
import {locales} from './locales/index.js';
import {validate} from './middleware/validation.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaults = {
  mountpath: '/share'
};

export const ShareEndpoint = class {
  constructor(options = {}) {
    this.id = 'share';
    this.name = 'Share endpoint';
    this.options = {...defaults, ...options};
    this._router = express.Router(); // eslint-disable-line new-cap
  }

  get mountpath() {
    return this.options.mountpath;
  }

  get namespace() {
    return 'endpoint-share';
  }

  init(indiekitConfig) {
    const {application, publication} = indiekitConfig;

    indiekitConfig.addLocale('de', locales.de);
    indiekitConfig.addLocale('en', locales.en);

    indiekitConfig.addNavigation({
      href: this.options.mountpath,
      text: 'share.title'
    });

    indiekitConfig.addRoute({
      mountpath: this.mountpath,
      routes: () => this.routes(application, publication)
    });

    indiekitConfig.addView([
      path.join(__dirname, 'includes'),
      path.join(__dirname, 'views')
    ]);
  }

  routes(application, publication) {
    const router = this._router;
    const {authenticate} = application.middleware;

    this._router.get('/:path?', authenticate, shareController(publication).get);
    this._router.post('/:path?', validate, authenticate, shareController(publication).post);

    return router;
  }
};
