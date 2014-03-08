module.exports = function(grunt) {

  var Files = {
    vendor: function() {
      return [
        'app/vendor/js/jquery-1.11.0.js',
        'app/vendor/bootstrap-3.1.1-dist/js/bootstrap.min.js',
        'app/vendor/js/microevent.js',
        'app/vendor/sjcl/core/sjcl.js',
        'app/vendor/sjcl/core/bitArray.js',
        'app/vendor/sjcl/core/aes.js',
        'app/vendor/sjcl/core/sha256.js',
        'app/vendor/sjcl/core/random.js',
        'app/vendor/js/qrcode.js',
        'app/vendor/js/scancode.js',
        'app/vendor/blockchaininfo/src/blockchaininfo.js',
      ]
    },
    source: function() {
      return [
        'app/js/coinpocketapp.js',
        'app/js/models/bitcoin_worker.js',
        'app/js/models/entropy.js',
        'app/js/models/key_pair.js',
        'app/js/models/page_hash.js',
        'app/js/models/transaction.js',
        'app/js/views/welcome_modal_view.js',
        'app/js/views/main_view.js',
        'app/js/views/send_view.js',
        'app/js/views/receive_view.js',
        'app/js/views/transactions_view.js',
        'app/js/controllers/welcome_modal_controller.js',
        'app/js/controllers/send_controller.js',
        'app/js/controllers/receive_controller.js',
        'app/js/controllers/transaction_controller.js',
        'app/js/controllers/main_controller.js'
      ];
    },
    worker: function() {
      return [
        'app/vendor/sjcl/sjcl.js',
        'app/vendor/sjcl/core/bn.js',
        'app/vendor/sjcl/core/ecc.js',
        'app/vendor/bitcoin/src/sjcl_ext/codecBase58.js',
        'app/vendor/bitcoin/src/sjcl_ext/ripemd160.js',
        'app/vendor/bitcoin/src/bitcoin.js',
        'app/js/workers/bitcoin_worker.js'
      ]
    }
  };

  grunt.initConfig({
    jasmine: {
      app: {
        src: Files.source(),
        options: {
          specs: [ 'spec/models/**/*Spec.js' ],
          vendor: Files.vendor(),
          helpers: 'spec/helpers/JqueryAJAXFixtures.js'
        }
      },
      worker: {
        src: Files.worker(),
        options: {
          specs: [
            'spec/workers/BitcoinWorkerSpec.js'
          ],
          helpers: 'spec/helpers/WorkerHelper.js'
        }
      },
      bitcoin: {
        src: 'app/vendor/bitcoin/src/**/*.js',
        options: {
          specs: 'app/vendor/bitcoin/spec/**/*Spec.js',
          vendor: [
            'app/vendor/sjcl/sjcl.js',
            'app/vendor/sjcl/core/bn.js',
            'app/vendor/sjcl/core/ecc.js'
          ]
        }
      }
    },
    connect: {
      dev: {
        options: {
          base: 'app',
          keepalive: true,
          debug: true,
        }
      }
    },
    jshint: {
      all: Files.source()
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'jasmine']);

};
