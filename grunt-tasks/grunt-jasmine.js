module.exports = function gruntJasmine(grunt) {
  grunt.config('jasmine', {
    basic: {
      src: ['src-out/**/*.js'],
      options: {
        specs: 'tests/**/*.js',
        host: 'http://127.0.0.1:8001/',
        template: 'GruntRunnerBasic.tmpl',
        summary: true,
        display: 'full',
        sandboxArgs: {
          args: [
            '--aggressive-cache-discard',
          ],
          dumpio: true,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
};
