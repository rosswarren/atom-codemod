'use babel';

const {
    BufferedNodeProcess,
    CompositeDisposable
} = require('atom'); // eslint-disable-line import/no-unresolved

const { readdir } = require('fs');
const path = require('path');
const P = require('promalom');

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
        const jsCodemod = {
            displayName: 'js-codemod',
            path: path.join(
                __dirname,
                '..',
                'codemods',
                'js-codemod',
                'transforms'
            )
        };

        const reactCodemod = {
            displayName: 'react-codemod',
            path: path.join(
                __dirname,
                '..',
                'codemods',
                'react-codemod',
                'transforms'
            )
        };

        const listCodemods = codemods => {
            const availableCodemodsView = new AvailableCodemods(codemods, item => {
                this.runCodemode(item);
                availableCodemodsView.cancel();
            });
        };

        function buildCodemodList(transforms) {
            return transforms.reduce((acc, current) => acc.concat(current.files
                .filter(file => file.indexOf('__') === -1)
                .map(file => ({
                    file,
                    displayName: `${current.displayName} / ${file.split('.')[0]}`,
                    path: current.path
                })
            )), []);
        }

        Promise.all([
            jsCodemod,
            reactCodemod
        ].map(codemod => P.promisify(readdir)(codemod.path).then(files => ({
            displayName: codemod.displayName,
            path: codemod.path,
            files
        }))))
        .then(buildCodemodList)
        .then(listCodemods);
    },

    runCodemode(transform) {
        const jscodeshift = path.join(
            __dirname,
            '..',
            'node_modules',
            '.bin',
            'jscodeshift'
        );

        new BufferedNodeProcess({ // eslint-disable-line no-new
            command: jscodeshift,
            args: [
                '-t',
                path.join(transform.path, transform.file),
                atom.workspace.getActivePaneItem().getPath()
            ],
            stdout: output => {
                console.log('stdout', output);

                const div = document.createElement('div');
                div.innerText = output;

                const panel = atom.workspace.addModalPanel({ item: div });

                setTimeout(() => {
                    panel.destroy();
                }, 1000);
            },
            stderr: output => {
                console.log('stdout', output);

                const div = document.createElement('div');
                div.innerText = output;

                const panel = atom.workspace.addModalPanel({ item: div });

                setTimeout(() => {
                    panel.destroy();
                }, 1000);
            },
            exit: returnCode => console.log('Return Code', returnCode)
        });
    }
};
