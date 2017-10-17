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
    self.get('/groups/' + path),

  forkProject: (project_path, namespace) =>
    self.post('/projects/' + encodeURIComponent(project_path) + '/fork', {
      namespace: namespace
    }),

  getProject: (project_path) =>
    self.get('/projects/' + encodeURIComponent(project_path), {
      statistics: false
    }),

  deleteForkRelationship: (project_path) =>
    self.delete('/projects/' + encodeURIComponent(project_path) + '/fork'),

  renameProject: (project_path, name) =>
    self.put('/projects/' + encodeURIComponent(project_path), {
      name: name,
      path: name
    }),

  waitUntilForkComplete: (project_path) =>
    new Promise(function(fullfill, reject) {
      var forkRefreshId = setInterval(() =>
        self.getProject(project_path)
          .then(function(project) {
            if (project.import_status == 'finished') {
              clearInterval(forkRefreshId);
              fullfill();
            }
          }, function(err) {
            clearInterval(forkRefreshId);
            reject(err);
          }), 3000)
    }),

  newGroupVariable: (path, key, value) =>
    self.post('/groups/' + path + '/variables', {
      key: key,
      value: value
    }),

  getProjectSnippetContent: (project_path, snippet_id) =>
    self.get('/projects/' + encodeURIComponent(project_path) + '/snippets/' + snippet_id + '/raw'),

  newRepositoryFile: (project_path, file_path, branch, content, commit_message) =>
    self.post('/projects/' + encodeURIComponent(project_path) + '/repository/files/' + encodeURIComponent(file_path), {
      branch: branch,
      content: content,
      commit_message: commit_message
    }),

  searchUser: (username) =>
    self.get('/users?username=' + username),

  addGroupMember: (path, user_id) =>
    self.post('/groups/' + encodeURIComponent(path) + '/members', {
      user_id: user_id,
      access_level: 40
    }),

  getActiveUsers: () =>
    self.get('/users?active=true&per_page=100')

}

module.exports = self;
