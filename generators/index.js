var generators = require('yeoman-generator');
var sanitize = require('sanitize-filename');
var path = require('path');
var _ = require('lodash');

var Base = generators.Base;
module.exports = Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    configuring: function () {
        this.config.save();
    },
    initializing: function () {
        this.defaults = {
            title: 'New Application Name',
            version: '0.0.1',
            description: 'New application description',
            email: "emailchangeme@changeme.com",
            stylesheetName: "styles",
            scriptName: "tools-base",
            framework: 'static'
        };
    },
    prompting: function () {
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
            this.validate.bind(this));
    },
    writing: function () {
        this.log("In 'writing' function");
//        this.log(this.args.framework);
//        this.log("------------------------------");
//        this.log(this);
//        this.log("------------------------------");

        if (this.args.length > 0) {
            var files = [
            path.join('..', 'test', '**', '*'),
            path.join(__dirname + 'app', this.args.framework.value, '**', '*')
        ];

            this.log(files);

            function processTemplates(sourcePath) {
                this.log(sourcePath);
                this.fs.copyTpl(
                    this.templatePath(sourcePath),
                    this.destinationPath(sourcePath),
                    this.args);
            }

            _.each(files, processTemplates);
        }
    },
    end: function () {
        this.log("In 'end' function");
    },
    validate: function (err, props) {
        this.log("In 'validate' function");
        if (err) {
            return this.emit('error', err);
        } else {
            if (props) {
                var done = this.async();
                extScripts = [];
                extScripts.push('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js"></script>');

                if (answers.bootstrap)
                    answers.extScripts.push('<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>');

                props.appName = _.slugify(this.toolTitle.toLowerCase());
                props.extScripts = this.extScripts.join();
                props.extStyles = this.extStyles.join();

                done();
            }
        }
    }
});