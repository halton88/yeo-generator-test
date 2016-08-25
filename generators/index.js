var generators = require('yeoman-generator');
var sanitize = require('sanitize-filename');
var path = require('path');
var _ = require('lodash');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    prompting: function () {
        this.defaults = {
            title: 'New Application Name',
            version: '0.0.1',
            description: 'New application description',
            email: "emailchangeme@changeme.com",
            stylesheetName: "styles",
            scriptName: "tools-base",
            framework: 'static'
        };
        this.prompt(
            [
                {
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
                    type: 'confirm',
                    name: 'bootstrap',
                    message: 'Will this application depend on bootstrap\'s javascript? ',
                    default: true
        },
                {
                    type: 'list',
                    name: 'framework',
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
                $this = this;
                var done = $this.async();
                this.log("In 'validate' function \n");
                if (err) {
                    return this.emit('error', err);
                } else {
                    extScripts = [];
                    extScripts.push('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>');

                    if (answers.bootstrap)
                        answers.extScripts.push('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>');

                    
                    this.appname = _.slugify(answers.toolTitle.toLowerCase());
                    this.extScripts = answers.extScripts.join();
                    this.extStyles = answers.extStyles.join();
                    this.args = answers;
                }
                done();
            }.bind(this));
    },
    writing: {
        testCopy: function () {
            this.fs.copy(this.template('test/**/*','./'));
        },
        appCopy: function () {
            this.log(this);
            if (this.args.framework)
                this.fs.copyTpl(this.template(this.args.framework.value + 'app/**/*', './'));
        }
    }
});