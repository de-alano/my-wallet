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

    return {
        addItem: (type, des, val) => {
            let newItem, ID;

            // [1 2 3 4 5 6], next ID = 6
            // [1 2 3 4 6 8], next ID = 9
            // ID = last ID + 1

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') newItem = new Expense(ID, des, val);
            else if (type === 'inc') newItem = new Income(ID, des, val);

            // Push the new item into data structure
            data.allItems[type].push(newItem);

            // Return the new item
            return newItem;
        },

        test: () => {
            console.log(data);
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
        itemsContainer: '.transactions__list'
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

        addTransactionItem: (obj, type) => {
            let html, newHtml;

            // 1. Create HTML string with placeholder text
            if (type === 'inc') {
                html = '<div class="item item__income" id="income-%id%"><img src="dist/images/arrow-inc.svg" alt="Income Icon" class="item__icon item__icon--inc"><div class="item__info"><div class="item__description item__description--inc">%description%</div><div class="item__date">June 3, 2019</div></div><div class="item__value item__value--inc">%value%</div><div class="item__delete"><button class="item__delete--btn"></button></div></div>'
            } else if (type === 'exp') {
                html = '<div class="item item__expense" id="expense-%id%"><img src="dist/images/arrow-exp.svg" alt="Expense Icon" class="item__icon item__icon--exp"><div class="item__info"><div class="item__description item__description--exp">%description%</div><div class="item__date">June 3, 2019</div></div><div class="item__value item__value--exp">%value%</div><div class="item__delete"><button class="item__delete--btn"></button></div></div>';
            }
            // 2. Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            // 3. Insert the HTML into the DOM
            document.querySelector(DOMelements.itemsContainer).insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMelements: () => {

            return DOMelements;
        }
    };

})();
//---------------------------------------------------------------------------------------------------------//

// APP CONTROLLER
const appController = ((walletCtrl, UICtrl) => {

    const ctrlAddItem = () => {
        // 1. Get the inputs data
        const input = UICtrl.getInput();
        console.log(input);
        // 2. Add the item to the wallet controller
        const newItem = walletCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item to the user interface controller
        UICtrl.addTransactionItem(newItem, input.type);
        // 4. Calculate the state of wallet

        // 5. Display the state of wallet on the user interface

    };

    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMelements();

        // Add event listener on form submit
        document.querySelector(DOM.form).addEventListener('submit', e => {
            e.preventDefault();
            ctrlAddItem();
        });

        // Add event listener on press enter
        document.querySelector(DOM.itemDescription).addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                ctrlAddItem();
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
