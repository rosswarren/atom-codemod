'use babel';

const {
    BufferedNodeProcess,
    CompositeDisposable
} = require('atom'); // eslint-disable-line import/no-unresolved

const { readdir } = require('fs');
const AvailableCodemods = require('./available-codemods');

module.exports = {
    subscriptions: null,

    activate(state) { // eslint-disable-line no-unused-vars
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'codemod:list': () => this.showCodemodList()
        }));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {

    },

    showCodemodList() {
        readdir(`${__dirname}/../node_modules/js-codemod/transforms`, (err, files) => {
            const codemods = files
                .filter(file => file.indexOf('__') === -1)
                .map(file => file.split('.')[0]);

            const availableCodemodsView = new AvailableCodemods(codemods, item => {
                this.runCodemode(item);
                availableCodemodsView.cancel();
            });
        });
    },

    runCodemode(transform) {
        const jscodeshift = `${__dirname}/../node_modules/.bin/jscodeshift`;

        const jscodemod = `${__dirname}/../node_modules/js-codemod/transforms/${transform}.js`;

        new BufferedNodeProcess({ // eslint-disable-line no-new
            command: jscodeshift,
            args: [
                '-t',
                jscodemod,
                atom.workspace.getActivePaneItem().getPath()
            ],
            stdout: output => console.log('stdout', output),
            stderr: output => console.log('stderr', output),
            exit: returnCode => console.log('Return Code', returnCode)
        });
    }
};
