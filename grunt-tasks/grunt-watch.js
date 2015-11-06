module.exports = function gruntWatch(grunt) {
  grunt.config('watch', {
    less: {
      files: ['content/**/*.less'],
      tasks: ['less'],
      options: {
        spawn: false,
      },
    },
    babel: {
      files: ['src/**/*.js'],
      tasks: ['lint'],
      options: {
        spawn: false,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
