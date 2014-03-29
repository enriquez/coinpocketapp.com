# Coin Pocket

Bitcoin wallet that stores Bitcoin in your browser. Perfect for taking some "spending Bitcoin" with you on your mobile phone.

Coin Pocket only needs a static web server for hosting. It currently relies on [Blockchain.info's API](https://blockchain.info/api) for interacting with the blockchain (this may change in the future). An official version of Coin Pocket is hosted and maintained at:

[https://btc.coinpocketapp.com](https://btc.coinpocketapp.com)

## Features

* Native QR Code scanning on iOS using [Scan Code - QR Code Reader](http://scan-code-qr-code-reader/id828167977?ls=1&mt=8)
* Accessible offline. Coin Pocket will stay available for existing users if the server goes down.
* Live updates. Watch transactions appear and become confirmed.
* Simple and easy to understand UI. Great for new users to Bitcoin.

## Security Notes

* Key generation, encryption, signing, etc... is done using the [Stanford Javascript Crypto Library (SJCL)](https://github.com/bitwiseshiftleft/sjcl).
* The PRNG is seeded with user interaction in addition to the cryptographically secure `crypto.getRandomValues`.
* The private key is encrypted with the user's password and stored in the browser's local storage.
* Extensive automated tests cover any extension to SJCL.

## Development

Coin Pocket is a single page application that is written in plain html, css, and javacsript. The `app/index.html` file can be opened in your browser without any pre-processing, but make sure you run it on a server since local storage won't work with the `file://` protocol. Follow below to get your environment setup for development.

### Setup

This project uses tools written in Ruby to help with development. Get started by running the following commands from the root directory of this project.

```bash
$ gem install bundler
$ bundle
```

The above will install the tools needed and their dependencies.

### Rake tasks

Everything you should need is available as a Rake task including:

* Running a server for development: `$ bin/rake server`
* Running JSLint: `$ bin/rake lint`
* Running Jasmine specs: `$ bin/rake spec`
* Optimizing the code for production: `$ bin/rake build`

See the `Rakefile` for more.

## MIT License

Copyright (c) 2014 Enriquez Software LLC (http://enriquez.me)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
