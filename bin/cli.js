#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2))
var async = require('async')
var c = require('chalk')
var token = require('../lib/token')
var syncRepos = require('../')

if (argv['save-token']) {
  token.put(argv['save-token'], function (err) {
    process.exit(0)
  })
}

var orgs = process.argv.slice(2)
if (!orgs.length) {
  console.log(c.red('Missing organisation(s)'))
  process.exit(1)
}

token.get(function (err, token) {
  if (err) return console.log(err.message || err)
  syncRepos(orgs, token, function () {
    console.log('Done.')
  })
})
