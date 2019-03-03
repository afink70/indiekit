const config = require(process.env.PWD + '/app/config');
const indieauth = require(process.env.PWD + '/app/lib/indieauth');
const micropub = require(process.env.PWD + '/app/lib/micropub');

/**
 * Responds to Micropub media-endpoint POST requests
 *
 * @memberof routes
 * @module media.post
 * @param {Object} request Request
 * @param {Object} response Response
 * @param {Object} next Callback
 * @return {Object} HTTP response
 */
exports.post = async (request, response, next) => {
  const pub = await require(process.env.PWD + '/app/lib/publication')();
  const getPostResponse = async request => {
    const {body} = request;
    const {files} = request;

    // Ensure response includes files data
    const hasFiles = Object.entries(files).length !== 0;
    if (!hasFiles) {
      return micropub.error('invalid_request');
    }

    // Verify access token
    const accessToken = request.headers.authorization || body.access_token;
    const verifiedToken = await indieauth.verifyToken(accessToken, config.url);
    if (!verifiedToken) {
      return micropub.error('forbidden', 'Unable to verify access token');
    }

    // Create action
    const {scope} = verifiedToken;
    if (scope.includes('create') || scope.includes('media')) {
      return micropub.createMedia(pub, files);
    }

    return micropub.error('insufficient_scope');
  };

  try {
    const postResponse = await getPostResponse(request);
    return response.status(postResponse.code).set({
      location: postResponse.location
    }).json(postResponse.body);
  } catch (error) {
    console.error(error);
  }

  next();
};
