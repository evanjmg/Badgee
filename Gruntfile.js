module.exports = function(grunt) {
  grunt.initConfig({
    // ngconstant: {
    //   // Options for all targets
    //   options: {
    //     space: '  ',
    //     wrap: '"use strict";\n\n {%= __ngModule %}',
    //     name: 'config',
    //   },
    //   // Environment targets
    //   development: {
    //     options: {
    //       dest: '<%= yeoman.app %>/scripts/config.js'
    //     },
    //     constants: {
    //       ENV: {
    //         name: 'development',
    //         apiEndpoint: 'http://localhost:5000'
    //       }
    //     }
    //   },
    //   production: {
    //     options: {
    //       dest: '<%= yeoman.dist %>/scripts/config.js'
    //     },
    //     constants: {
    //       ENV: {
    //         name: 'production',
    //         apiEndpoint: 'http://www.taggyapp.uk'
    //       }
    //     }
    //   }
    // },
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/css/layout.css' : 'public/scss/layout.scss'
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
}
