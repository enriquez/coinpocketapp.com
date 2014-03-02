module.exports = function(grunt) {

  grunt.initConfig({
    jasmine: {
      spec: {
        src: [
          'app/js/sjcl_ext/codecBase58.js',
          'app/js/sjcl_ext/ripemd160.js',
          'app/js/bitcoin.js',
          'app/js/coinpocketapp.js',
          'app/js/entropy.js',
          'app/js/welcome_modal_view.js',
          'app/js/welcome_modal_controller.js'
        ],
        options: {
          specs: 'spec/**/*Spec.js',
          vendor: [
            'app/vendor/js/jquery-1.11.0.js',
            'app/vendor/bootstrap-3.1.1-dist/js/bootstrap.min.js',
            'app/vendor/js/microevent.js',
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
          debug: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

};
