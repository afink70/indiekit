# @indiekit/endpoint-share

Share endpoint for Indiekit. Inspired and developed from [an idea described by Max Böck](https://mxb.dev/blog/indieweb-link-sharing/).

## Installation

`npm i @indiekit/endpoint-share`

## Configuration

```js
const ShareEndpoint = require('@indiekit/endpoint-share');

const shareEndpoint = new ShareEndpoint({
  // config options here
});
```

### Options

* `mountpath`: Path to share screen. *Optional*, defaults to `/share`.
