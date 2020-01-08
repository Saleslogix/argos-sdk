module.exports = function gruntFile(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'convert-l20n': {
      all: {
        src: [
          './localization/**/*.l20n',
        ],
        dest: './localization-out',
      },
    },
  });

  // Load per-task config from separate files
  grunt.loadTasks('grunt-tasks');

  // Register alias tasks
  grunt.registerTask('build', ['clean', 'less']);
  grunt.registerTask('test', ['connect', 'jasmine:basic']);
};
