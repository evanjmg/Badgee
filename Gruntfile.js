module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/css/app.css' : 'public/scss/app.scss'
        }
      }
    },
     server: {
      port: 5000,
      base: './public'
    },
    watch: {
     options: {
           livereload: true,
         },
     files: '**/*.html',
      css: {
        files: '**/*.scss',
        tasks: ['sass']
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('server', 'Start a custom web server', function() {
    grunt.log.writeln('Started web server on port 5000');
    require('./app.js').listen(5000);
  });
  grunt.registerTask('default',['watch']);
}
