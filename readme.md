cloneall
--------

Clone all repositories for an organisation. If a repository already exists it will be updated.

## Installation

```bash
$ npm install -g cloneall
```

## Usage

Accepts a list of organisations. The following command will clone all github repositories you have access to:

```bash
$ cloneall github
Fetching repo data from: https://api.github.com/orgs/github/repos
Fetching repo data from: https://api.github.com/organizations/9919/repos?page=2
Fetching repo data from: https://api.github.com/organizations/9919/repos?page=3
Fetching repo data from: https://api.github.com/organizations/9919/repos?page=4
Fetching repo data from: https://api.github.com/organizations/9919/repos?page=5
Syncing 146 repos from 'github'
Cloning into 'github/media'...
remote: Counting objects: 59, done.
remote: Total 59 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (59/59), 3.27 MiB | 61.00 KiB/s, done.
Resolving deltas: 100% (13/13), done.
Checking connectivity... done.
Cloning into 'github/albino'...
remote: Counting objects: 226, done.
remote: Total 226 (delta 0), reused 0 (delta 0)
Receiving objects: 100% (226/226), 38.90 KiB | 7.00 KiB/s, done.
Resolving deltas: 100% (99/99), done.
Checking connectivity... done.
Cloning into 'github/hubahuba'...
..
```

In order to clone repositories you need a token. The following command will save it for later use:

```bash
$ cloneall --save-token 7957f62fb14da0c81e5b900456bdd9caa840e09a
```

Generate a new token at [this page](https://github.com/settings/tokens) with the desired `repo` access (only public or all repos with private access included).

## License

Copyright (c) 2014 Mic Network, Inc

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
