module.exports = function (grunt) {
    grunt.config('shell', {
        typescript: {
            command: 'node node_modules/typescript/bin/tsc',
            options: {
                execOptions: {
                    cwd: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
};

