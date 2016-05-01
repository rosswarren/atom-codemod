'use babel';

// import Codemod from '../lib/codemod';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('Codemod', () => {
    let workspaceElement;
    let activationPromise;

    beforeEach(() => {
        workspaceElement = atom.views.getView(atom.workspace);
        activationPromise = atom.packages.activatePackage('codemod');
    });

    describe('when the codemod:toggle event is triggered', () => {
        it('hides and shows the view', () => {
            // This test shows you an integration test testing at the view level.

            // Attaching the workspaceElement to the DOM is required to allow the
            // `toBeVisible()` matchers to work. Anything testing visibility or focus
            // requires that the workspaceElement is on the DOM. Tests that attach the
            // workspaceElement to the DOM are generally slower than those off DOM.
            jasmine.attachToDOM(workspaceElement);

            // This is an activation event, triggering it causes the package to be
            // activated.
            atom.commands.dispatch(workspaceElement, 'codemod:list');

            waitsForPromise(() => activationPromise);

            runs(() => {
                expect(atom.packages.isPackageActive('codemod')).toBe(true);

                const availableCodemodsView = atom.workspace.getModalPanels()[0].getItem();

                expect(availableCodemodsView.getSelectedItem()).toBe('object-shorthand');
            });
        });
    });
});
