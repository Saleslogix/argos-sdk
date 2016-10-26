module.exports = function gruntFile(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  // Load per-task config from separate files
  grunt.loadTasks('grunt-tasks');

  // Register alias tasks
  grunt.registerTask('build', ['clean', 'less']);
  grunt.registerTask('test', ['connect', 'jasmine:coverage']);
  grunt.registerTask('test:basic', ['connect', 'jasmine:basic']);
};
