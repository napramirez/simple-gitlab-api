# simple-gitlab-api
A simple GitLab API library for Node.js using simple request-promise calls

Install
=======

```bash
# Install from npm
npm install simple-gitlab-api
```

Usage in Node.js
================

```javascript
var gitlab = require('simple-gitlab-api');

gitlab.get('/groups').then(function(groups) {
  for (var i = 0; i < groups.length; i++)
    console.log(groups[i].name);
});
```

Environment Variables
=====================

- `GITLAB_URL` - the url to the GitLab server, _e.g._ `https://gitlab.mycompany.com`
- `GITLAB_API_PREFIX` - the API endpoint prefix including the API version, _e.g._ `/api/v4`
- `GITLAB_API_TOKEN` - the access token to the API passed into the header, _e.g._ (as used in `curl`):
```bash
curl --request GET --header 'PRIVATE-TOKEN: 9koXpg98eAheJpvBs5tK' 'https://gitlab.example.com/api/v4/projects/13083/repository/files/app%2Fmodels%2Fkey%2Erb/raw?ref=master'
```
