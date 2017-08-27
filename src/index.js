var requestPromise = require('request-promise');

var self = {

  invoke: (apiMethod, apiPath, apiParams = {}) =>
    requestPromise({
      uri: process.env.GITLAB_URL + process.env.GITLAB_API_PREFIX + apiPath,
      headers: { 'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN },
      json: true,
      method: apiMethod,
      body: apiParams
    })

}

module.exports = self;
