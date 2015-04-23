module.exports = function(grunt) {
    grunt.config('connect', {
        server: {
            options: {
                port: 8001,
                hostname: '127.0.0.1',
                base: '.'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
};

