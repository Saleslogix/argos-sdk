module.exports = function(grunt) {
    grunt.config('watch', {
        scripts: {
            files: ['src/**/*.js'],
            tasks: ['jshint'],
            options: {
                spawn: false
            }
        },
        less: {
            files: ['content/**/*.less'],
            tasks: ['less'],
            options: {
                spawn: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};

