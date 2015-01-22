#!/usr/bin/env node

var fs = require('fs')
var join = require('path').join
var spawn = require('child_process').spawn
var argv = require('minimist')(process.argv.slice(2))

var home = require('home-dir')
var request = require('hyperquest')
var concat = require('concat-stream')
var async = require('async')
var c = require('chalk')

var configDir = join(home(), '.config')
var tokenFile = join(configDir, 'cloneall-token')

function getRepos(org, cb){
  getToken(function(err, token){
    if (err) return cb(err)
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

  })
}

function getToken(cb){
  ensureDir(configDir, function(){
    fs.readFile(tokenFile, 'utf8', function(err, token){
      if (err) return cb(new Error([
        'Missing token. ',
        'Use \'cloneall --save-token :token\' to save your github token.',
        '\n',
        'See https://github.com/settings/applications#personal-access-tokens'
      ].join('')))
      cb(null, token)
    })
  })
}

function ensureDir(dir, cb){
  fs.mkdir(dir, function(err){
    cb()
  })
}

function clone(repo, cb) {
  var opts = {
    stdio: 'inherit'
  }
  var args = [
    'clone',
    repo.ssh_url,
    repo.full_name
  ]
  git(args, opts, cb)
}

function update(dir, cb) {
  var opts = {
    cwd: dir,
    stdio: 'inherit'
  }
  git('pull', opts, cb)
}

function git(args, opts, cb) {
  if (typeof args == 'string') args = [ args ]
  var child = spawn('git', args, opts)
  child.on('close', function(code) {
    if (code !== 0) console.log('git', args, 'failed')
    cb()
  })
  child.on('error', function(err) {})
}

if (argv['save-token']) {
  var token = argv['save-token']
  fs.writeFileSync(tokenFile, token)
  process.exit(0)
}

var orgs = process.argv.slice(2)
if (!orgs.length) {
  console.log(c.red('Missing organisation(s)'))
  process.exit(1)
}

async.eachSeries(orgs, function(org, next_org) {
  getRepos(org, function(err, repos) {
    if (err) return console.log(err.message || err)
    console.log(c.green('Syncing %d repos from \'%s\''), repos.length, org)
    async.eachSeries(repos, function(repo, next_repo) {
      var dir = join(process.cwd(), repo.full_name)
      fs.stat(dir, function(err, stats) {
        if (stats === undefined) return clone(repo, next_repo)
        console.log('Updating', repo.full_name)
        update(dir, next_repo)
      })
    }, next_org)
  }, function() {
    console.log('Done.')
  })
})
