import 'dotenv/config.js'; // eslint-disable-line import/no-unassigned-import
import {Indiekit} from './packages/indiekit/index.js';
import {JekyllPreset} from './packages/preset-jekyll/index.js';
import {BitbucketStore} from './packages/store-bitbucket/index.js';

// New indiekit instance
const indiekit = new Indiekit();

// Configure publication preset
const jekyll = new JekyllPreset();

// Configure content store
const bitbucket = new BitbucketStore({
  user: process.env.BITBUCKET_USER,
  repo: process.env.BITBUCKET_REPO,
  branch: process.env.BITBUCKET_BRANCH,
  auth: {
    appName: process.env.BITBUCKET_APPNAME,
    key: process.env.BITBUCKET_KEY,
    secret: process.env.BITBUCKET_SECRET
  }
});

// Application settings
indiekit.set('application.mongodbUrl', process.env.MONGODB_URL);
indiekit.set('application.locale', process.env.LOCALE);

// Publication settings
indiekit.set('publication.me', process.env.PUBLICATION_URL);
indiekit.set('publication.preset', jekyll);
indiekit.set('publication.store', bitbucket);

// Server
const server = indiekit.server();

export default server;
