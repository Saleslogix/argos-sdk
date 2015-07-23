module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    // Load per-task config from separate files
    grunt.loadTasks('grunt-tasks');

    // Register alias tasks
    grunt.registerTask('test', ['babel', 'connect', 'jasmine:coverage']);
    grunt.registerTask('default', ['test']);
};
