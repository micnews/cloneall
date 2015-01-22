var fs = require('fs')
var join = require('path').join
var home = require('home-dir')
var configDir = join(home(), '.config')
var tokenFile = join(configDir, 'cloneall-token')

module.exports = {
  get: getToken,
  put: putToken
}

function getToken(cb) {
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

function putToken(token, cb) {
  fs.writeFile(tokenFile, token, cb)
}

function ensureDir(dir, cb) {
  fs.mkdir(dir, function(err){
    cb()
  })
}

