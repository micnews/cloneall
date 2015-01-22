var request = require('hyperquest')
var concat = require('concat-stream')
var c = require('chalk')

function getRepos(org, token, cb) {
  var all_repos = []

  function getNextUrl(link) {
    if (link === undefined) return
    var match = /<(.*)>; rel="next"/.exec(link)
    return match && match[1]
  }

  function get(url) {
    console.log(c.green('Fetching repo data from:'), c.yellow(url))
    var req = request.get(url)

    req.setHeader('Authorization', 'token ' + token)
    req.setHeader('User-Agent', 'micnews/cloneall')

    req.on('response', function(res){
      res.pipe(concat(function(body){
        if (res.statusCode.toString()[0] !== '2')
          return cb(new Error('http error ' + res.statusCode))
        body = JSON.parse(body)
        var repos = body.map(function(repo) {
          return {
            name: repo.name,
            full_name: repo.full_name,
            ssh_url: repo.ssh_url
          }
        })
        all_repos = all_repos.concat(repos)
        var next = getNextUrl(res.headers.link)
        if (next) return get(next)
        cb(null, all_repos)
      }))
    })
  }

  get('https://api.github.com/orgs/' + org + '/repos')

}

module.exports = getRepos

