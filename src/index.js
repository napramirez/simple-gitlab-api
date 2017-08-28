var requestPromise = require('request-promise');

var self = {

  invoke: (apiMethod, apiPath, apiParams = {}) =>
    requestPromise({
      uri: process.env.GITLAB_URL + process.env.GITLAB_API_PREFIX + apiPath,
      headers: { 'PRIVATE-TOKEN': process.env.GITLAB_API_TOKEN },
      json: true,
      method: apiMethod,
      body: apiParams
    }),

  get: (api_path, api_params) =>
    self.invoke('GET', api_path, api_params),

  post: (api_path, api_params = {}) =>
    self.invoke('POST', api_path, api_params),

  delete: (api_path, api_params = {}) =>
    self.invoke('DELETE', api_path, api_params),

  put: (api_path, api_params = {}) =>
    self.invoke('PUT', api_path, api_params),

  newGroup: (path, name) =>
    self.post('/groups', {
      path: path,
      name: name,
      visibility: 'internal',
      lfs_enabled: false
    }),

  getGroup: (path) =>
    self.get('/groups/' + path)

}

module.exports = self;
