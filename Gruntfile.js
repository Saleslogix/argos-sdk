module.exports = function gruntFile(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  });

  // Load per-task config from separate files
  grunt.loadTasks('grunt-tasks');

  // Register alias tasks
  grunt.registerTask('build', ['clean', 'babel', 'less']);
  grunt.registerTask('test', ['babel', 'connect', 'jasmine:coverage']);
  grunt.registerTask('lint', ['babel', 'eslint']);
  grunt.registerTask('default', ['test']);
};
