![Coin Pocket icon](https://coinpocketapp.com/icon-small.png)

# Coin Pocket

Bitcoin wallet that stores Bitcoin in your browser. Perfect for taking some "spending Bitcoin" with you on your mobile phone.

Coin Pocket only needs a static web server for hosting. It currently relies on [Blockchain.info](https://blockchain.info/api) and [helloblock.io](https://helloblock.io) for interacting with the blockchain (this may change in the future). An official version of Coin Pocket is hosted and maintained at:

[https://btc.coinpocketapp.com](https://btc.coinpocketapp.com)

## Features

* Native QR Code scanning on iOS using [Scan Code - QR Code Reader](https://itunes.apple.com/app/scan-code-qr-code-reader/id828167977?mt=8)
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

## Deploy Notes

You can run your own version of Coin Pocket on any static web server. It is possible to serve this project's `app/` directory, but you'll want to follow the instructions below to optimize Coin Pocket for production.

### Install Tools

This project uses Ruby and Rake with some gems for the build process. Assuming you have Ruby installed already, you'll need to get Bundler and install the build tools and their dependencies.

```bash
$ gem install bundler
$ bundle
```

### Build for Production

With the build tools installed, you can run the following command.

```bash
$ bin/rake build_prod
```

This will create a `build` directory containing the public root of the app. The javascripts and stylesheets are combined and minified. Everything is gzipped in here as well.

### Server Configuration

Below are some things to keep in mind when running your version of Coin Pocket.

#### Best Practices

You should lock down access to your server. There is no data on the server to steal, but malicious code updates may be able to steal data. Monitor your server regularly.

#### SSL

Please use Coin Pocket over SSL only. Test your configuration with [https://www.ssllabs.com/ssltest/](https://www.ssllabs.com/ssltest/).

#### Domains

Coin Pocket data is tied to a domain. You'll want to setup proper redirects to the right domain or else you'll end up with multiple wallets at different domains which may be confusing.

Also, be careful running Coin Pocket on services where you share a domain with other people. It may be tempting to use GitHub pages, Dropbox, or Heroku since it is easy to setup. The problem is that an attacker can setup a page on the same domain and get access to Coin Pocket data. Hosting Coin Pocket on these services is Ok as long as you can do so on a domain that you control (subdomains should be Ok too). Make sure you redirect to your domain as well.

#### X-Frame-Options Header

This is a header that should be sent with every request. It prevents Coin Pocket from running in an iframe on modern browsers.

#### Content Security Policy Header

Send this header to whitelist external sources.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://coinbase.com; connect-src wss://ws.blockchain.info https://blockchain.info https://mainnet.helloblock.io https://bitpay.com https://api.coindesk.com; img-src data:;
```

#### GZip

The build process for Coin Pocket generates gzip versions of all the assets ahead of time. Configure your server to take advantage of this.

#### Cache Manifest

Coin Pocket is still available to users even if the server goes down by using a Cache Manifest file. Make sure your server has the correct mime type of `text/cache-manifest` for `.manifest` files to take advantage of this.

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
