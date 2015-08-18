module.exports = function gruntLess(grunt) {
  grunt.config('less', {
    development: {
      options: {},
      files: {
        'min/css/themes/crm/sdk.min.crm.debug.css': 'content/css/themes/crm.less',
      },
    },
    production: {
      options: {
        compress: true,
      },
      files: {
        'min/css/themes/crm/sdk.min.crm.css': 'content/css/themes/crm.less',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-less');
};
