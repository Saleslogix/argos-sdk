module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    // Load per-task config from separate files
    grunt.loadTasks('grunt-tasks');

    // Register alias tasks
    grunt.registerTask('check', ['jshint', 'jscs']);
    grunt.registerTask('test', ['check', 'connect', 'jasmine:coverage']);
    grunt.registerTask('default', ['test']);
};
