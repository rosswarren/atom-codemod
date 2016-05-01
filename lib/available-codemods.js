'use babel';

const { SelectListView } = require('atom-space-pen-views');

module.exports = class AvailableCodemods extends SelectListView {
    constructor(items, onSelect) {
        super();

        this.addClass('overlay from-top');
        this.setItems(items);
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.panel.show();
        this.focusFilterEditor();
        this.onSelect = onSelect;
    }

    viewForItem(item) {
        return `<li>${item}</li>`;
    }

    confirmed(item) {
        console.log(`${item} was selected`);
        this.onSelect(item);
    }

    cancelled() {
        console.log('the view was cancelled');

        this.editor = null;

        if (this.panel) {
            this.panel.destroy();
            this.panel = null;
        }
    }
};
