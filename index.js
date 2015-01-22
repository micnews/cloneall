var fs = require('fs')
var async = require('async')
var spawn = require('child_process').spawn
var join = require('path').join
var c = require('chalk')
var getRepos = require('./lib/get-repos')

function syncRepos(orgs, token, cb) {
  async.eachSeries(orgs, function(org, next_org) {
    getRepos(org, token, function(err, repos) {
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
    })
  }, cb)
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

module.exports = syncRepos
