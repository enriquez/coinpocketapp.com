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
      ]
    },
    source: function() {
      return [
        'app/js/coinpocketapp.js',
        'app/js/entropy.js',
        'app/js/key_pair.js',
        'app/js/welcome_modal_view.js',
        'app/js/welcome_modal_controller.js',
        'app/vendor/bitcoin/src/**/*.js'
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
      worker: {
        src: Files.worker(),
        options: {
          specs: [
            'spec/BitcoinWorkerSpec.js'
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
