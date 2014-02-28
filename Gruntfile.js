module.exports = function(grunt) {

  grunt.initConfig({
    jasmine: {
      spec: {
        src: 'app/js/**/*.js',
        options: {
          specs: 'spec/**/*Spec.js',
          vendor: [
            'app/vendor/js/jquery-1.11.0.js',
            'app/vendor/bootstrap-3.1.1-dist/js/bootstrap.min.js',
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
