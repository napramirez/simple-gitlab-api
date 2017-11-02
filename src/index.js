const { join } = require('path');
const requestPromise = require('request-promise');
const { resolve } = require('url');

const { GITLAB_URL, GITLAB_API_PREFIX, GITLAB_API_TOKEN } = process.env;

const config = {
  gitlabUrl: GITLAB_URL,
  gitlabApiPrefix: GITLAB_API_PREFIX || '/api/v4',
  gitlabApiToken: GITLAB_API_TOKEN
};

const self = {

  config,

  setConfig: (conf) => Object.assign(config, conf),

  invoke: (apiMethod, apiPath, apiParams = {}, queryParams = {}) =>
    requestPromise({
      uri: resolve(config.gitlabUrl, join(config.gitlabApiPrefix, apiPath)),
      headers: { 'PRIVATE-TOKEN': config.gitlabApiToken },
      json: true,
      method: apiMethod,
      body: apiParams,
      qs: queryParams
    }),

  get: (api_path, api_params, query_params) =>
    self.invoke('GET', api_path, api_params, query_params),

  post: (api_path, api_params, query_params) =>
    self.invoke('POST', api_path, api_params, query_params),

  delete: (api_path, api_params) =>
    self.invoke('DELETE', api_path, api_params),

  put: (api_path, api_params) =>
    self.invoke('PUT', api_path, api_params),

  getFile: (project_path, path, ref = 'master') =>
    self.get('/projects/' + encodeURIComponent(project_path) + '/repository/files/' + encodeURIComponent(path), undefined, { ref }),

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
      const forkRefreshId = setInterval(() =>
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

  newProjectVariable: (project_path, key, value) =>
    self.post('/projects/' + encodeURIComponent(project_path) + '/variables', {
      key: key,
      value: value
    }),

  updateProjectVariable: (project_path, key, value) =>
    self.put('/projects/' + encodeURIComponent(project_path) + '/variables/' + key, {
      key: key,
      value: value
    }),

  newGroupVariable: (path, key, value) =>
    self.post('/groups/' + path + '/variables', {
      key: key,
      value: value
    }),

  newPipeline: (project_path, ref = 'master') =>
    self.post('/projects/' + encodeURIComponent(project_path) + '/pipeline', {}, { ref }),

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

  addSSHKey: (title, key) =>
    self.post('/user/keys', {
      title: title,
      key: key
    }),

  getSSHKeys: () =>
    self.get('/user/keys'),

  deleteSSHKey: (key_id) =>
    self.delete('/user/keys/' + key_id),

  getActiveUsers: () =>
    self.get('/users?active=true&per_page=100')

}

module.exports = self;
