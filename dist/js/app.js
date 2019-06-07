// WALLET CONTROLLER
const walletController = (() => {

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

})();
//---------------------------------------------------------------------------------------------------------//

// USER INTERFACE CONTROLLER
const UIController = (() => {

    // HTML elements
    const DOMelements = {
        itemType: '.transactions__type',
        itemDescription: '.transactions__description',
        itemValue: '.transactions__value',
        form: '.transactions__form',
    };

    return {
        getInput: () => {

            // Return object with inputs value
            return {
                type: document.querySelector(DOMelements.itemType).value, // inc or exp
                description: document.querySelector(DOMelements.itemDescription).value,
                value: document.querySelector(DOMelements.itemValue).value
            };
        },

        getDOMelements: () => {

            return DOMelements;
        }
    };

})();
//---------------------------------------------------------------------------------------------------------//

// APP CONTROLLER
const appController = ((walletCtrl, UICtrl) => {

    const addItem = () => {
        // 1. Get the inputs data
        const input = UICtrl.getInput();
        console.log(input);
        // 2. Add the item to the wallet controller

        // 3. Add the item to the user interface controller

        // 4. Calculate the state of wallet

        // 5. Display the state of wallet on the user interface

    };

    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMelements();

        // Add event listener on form submit
        document.querySelector(DOM.form).addEventListener('submit', e => {
            e.preventDefault();
            addItem();
        });

        // Add event listener on press enter
        document.addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which === 13) {
                addItem();
            }
        });
    };

    return {
        init: () => {
            console.log('Application has started!');
            setupEventListeners();
        }
    };

})(walletController, UIController);

appController.init();
