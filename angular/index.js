'use strict';

var yeoman = require('yeoman-generator');
var sanitize = require('sanitize-filename');
var path = require('path');
var _ = require('lodash');

module.exports = yeoman.Base.extend({
    constructor: function () {
        yeoman.Base.apply(this, arguments);

        this.option('appname', {
            desc: 'name for the application',
            type: String,
            defaults: this.defaults.title
        });
    },
    prompting: function () {
        this.defaults = {
            title: 'New Application Name',
            version: '0.0.1',
            description: 'New application description',
            email: "emailchangeme@changeme.com",
            stylesheetName: "styles",
            scriptName: "tools-base",
            scriptFramework: 'angular'
        };
        var done = this.async();

        return this.prompt(
            [{
                    type: 'input',
                    name: 'toolTitle',
                    message: 'Give your app a name: ',
                    default: this.defaults.title
                },
                {
                    type: 'input',
                    name: 'toolVersion',
                    message: 'What will be the version of this application (x.x.x): ',
                    default: this.defaults.version
                },
                {
                    type: 'input',
                    name: 'toolDescription',
                    message: 'Give a brief description of the application: '
},
                {
                    type: 'input',
                    name: 'toolSupportEmail',
                    message: 'What will the application support email be: ',
                    default: this.defaults.email
},
                {
                    type: 'input',
                    name: 'cssName',
                    message: 'What will be the filename of the base CSS: ',
                    default: this.defaults.stylesheetName,
                    filter: function (name) {
                        return sanitize(name);
                    }
},
                {
                    type: 'input',
                    name: 'jsName',
                    message: 'What will be the filename of the base javascript: ',
                    default: this.defaults.scriptName,
                    filter: function (name) {
                        return sanitize(name);
                    }
},
                {
                    type: 'list',
                    name: 'styleFramework',
                    message: "Which CSS framework will this project will use? ",
                    choices: [{
                        name: 'None (Plain CSS)',
                        value: 'css'
                }, {
                        name: 'Bootstrap',
                        value: 'bs'
                }, {
                        name: 'Foundation',
                        value: 'fdn'
                }]
},
                {
                    type: 'list',
                    name: 'scriptFramework',
                    message: 'Will this be a static, Angular or Backbone application? ',
                    choices: [
                        {
                            name: 'Static (only jQuery)',
                            value: 'static'
            },
                        {
                            name: "Angular (v. 1.5.8)",
                            value: 'angular'
            },
                        {
                            name: "Backbone (including underscore.js)",
                            value: 'backbone'
            }
        ],
                    filter: function (obj) {
                        return obj.value;
                    },
                    default: 0
    },
                {
                    type: 'confirm',
                    name: 'moveon',
                    message: 'Continue?'
    }
            ],
            function (answers) {
                var done = this.async();


                this.defaults = {
                    title: 'New Application Name',
                    version: '0.0.1',
                    description: 'New application description',
                    email: "emailchangeme@changeme.com",
                    stylesheetName: "styles",
                    scriptName: "tools-base",
                    scriptFramework: 'static'
                };
                var extScripts = [];
                extScripts.push('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>');

                if (answers.styleFramework == 'bs') {
                    this.extScripts.push('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>');
                    this.extStyles.push('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
                }
                if (answers.styleFramework == 'fdn') {
                    this.extScripts.push('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.js"></script>');
                    this.extStyles.push('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.css">');
                }

                answers.appName = _.slugify(answers.toolTitle.toLowerCase());
                answers.extScripts = answers.extScripts.join();
                answers.extStyles = answers.extStyles.join();

                _.join(this, answers);
                done();
            }.bind(this));
    },
    writing: function () {
        this.log("writing");
        this.fs.copy(
            this.templatePath('.gitignore'),
            this.destinationPath('.gitignore'));

        this.fs.copyTpl(
            this.templatePath('../test/spec/test.js'),
            this.destinationPath('test/spec/test.js'),
            this);

        if (this.scriptFramework) {
            this.fs.copyTpl(
                this.templatePath('../generators/package.json'),
                this.destinationPath('package.json'),
                this);

            this.fs.copyTpl(
                this.templatePath('index.html'),
                this.destinationPath('index.html'),
                this);

            this.fs.copyTpl(
                this.templatePath('styles.css'),
                this.destinationPath(this.stylesheetName + '.css'),
                this);

            this.fs.copyTpl(
                this.templatePath('tools-base.js'),
                this.destinationPath(this.scriptName + '.js'),
                this);
        }

        //        this.template('../test/spec/test.js');
        //        this.template('.gitignore');
        //
        //        this.template('index.html');
        //        this.template(this.scriptName + '.js');
        //        this.template(this.stylesheetName + '.css');
        //        this.template('../generators/package.json');

    },

    install: function () {
        this.log("install");
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }
});