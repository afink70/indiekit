import test from 'ava';
import supertest from 'supertest';
import {defaultConfig} from '../../config/defaults.js';
import {serverConfig} from '../../config/server.js';

const request = supertest(serverConfig(defaultConfig));

test('Returns CSS', async t => {
  const response = await request.get('/assets/app.css');
  t.is(response.status, 200);
  t.is(response.type, 'text/css');
});
