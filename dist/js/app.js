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
        },
        wallet: 0
    };

    const calculateTotal = type => {
        let sum = 0;
        data.allItems[type].forEach(item => sum += item.value);

        data.totals[type] = sum;
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

        deleteItem: (type, id) => {
            // id = 4
            // ids = [1 2 3 4 5]
            // index = 3

            const ids = data.allItems[type].map(item => {
                return item.id
            });
            const index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateWallet: () => {
            // 1. Calculate total incomes and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // 2. Calculate the wallet: income - expenses
            data.wallet = data.totals.inc - data.totals.exp;
        },

        getWallet: () => {
            return {
                wallet: data.wallet,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
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
        itemBtn: '.transactions__btn__icon',
        itemInfo: '.item__info',
        form: '.transactions__form',
        itemsContainer: '.transactions__list',
        walletLabel: '.wallet__value',
        incomesLabel: '.wallet__incomes--value',
        expensesLabel: '.wallet__expenses--value',
        deleteBtn: '.item__delete--btn',
    };

    const formatNumber = (num, type) => {
        let numSplit, int, dec;
        /*
        +/- before number
        exactly 2 decimal points
        comma separating the thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length); // input 2310, output 2,310
        }

        dec = numSplit[1];

        // type === 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    const displayDate = () => {
        const now = new Date();
        const date = ("0" + now.getDate()).slice(-2) + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
            now.getFullYear() + " | " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2);

        return date;

    };

    const addVisible = item => {
        document.querySelector(item).classList.add('visible');
        document.querySelector('.item__info').classList.add('moveLeft');
        document.querySelector('.item__value').classList.add('moveLeft');
    }

    return {
        getInput: () => {

            // Return object with inputs value
            return {
                type: document.querySelector(DOMelements.itemType).value, // inc or exp
                description: document.querySelector(DOMelements.itemDescription).value,
                value: parseFloat(document.querySelector(DOMelements.itemValue).value)
            };
        },

        addTransactionItem: (obj, type) => {
            let html, newHtml;

            // 1. Create HTML string with placeholder text
            if (type === 'inc') {
                html = '<div class="item item__income" id="inc-%id%"><img src="dist/images/arrow-inc.svg" alt="Income Icon" class="item__icon item__icon--inc"><div class="item__info"><div class="item__description item__description--inc">%description%</div><div class="item__date">%date%</div></div><div class="item__value item__value--inc">%value%</div><div class="right"><div class="item__delete"><button class="item__delete--btn"></button></div></div></div>'
            } else if (type === 'exp') {
                html = '<div class="item item__expense" id="exp-%id%"><img src="dist/images/arrow-exp.svg" alt="Expense Icon" class="item__icon item__icon--exp"><div class="item__info"><div class="item__description item__description--exp">%description%</div><div class="item__date">%date%</div></div><div class="item__value item__value--exp">%value%</div><div class="right"><div class="item__delete"><button class="item__delete--btn"></button></div></div></div>';
            }
            // 2. Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            newHtml = newHtml.replace('%date%', displayDate());
            // 3. Insert the HTML into the DOM
            document.querySelector(DOMelements.itemsContainer).insertAdjacentHTML('beforeend', newHtml);


            // Add long-press event to show delete button
            document.querySelector('.transactions__list').addEventListener('long-press', e => {
                if (e.target && e.target.id) {
                    addVisible(`#${e.target.id} ${DOMelements.deleteBtn}`);
                } else if (e.target && e.target.classList.contains('item__description')) {
                    addVisible(`#${e.target.parentNode.parentNode.id} ${DOMelements.deleteBtn}`);
                } else if (e.target && e.target.classList.contains('item__value')) {
                    addVisible(`#${e.target.parentNode.id} ${DOMelements.deleteBtn}`);
                } else if (e.target && e.target.classList.contains('item__date')) {
                    addVisible(`#${e.target.parentNode.parentNode.id} ${DOMelements.deleteBtn}`);
                } else if (e.target && e.target.classList.contains('item__icon')) {
                    addVisible(`#${e.target.parentNode.id} ${DOMelements.deleteBtn}`);
                }
            });
        },

        deleteTransactionItem: selectorID => {
            const el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: () => {
            // Get input fields
            const fields = document.querySelectorAll(`${DOMelements.itemDescription}, ${DOMelements.itemValue}`);
            // Convert node list to array
            const fieldsArr = [...fields];
            // Clear input fields
            fieldsArr.forEach(field => field.value = '');
            // Set focus to the description field
            fieldsArr[0].focus();
        },

        displayWallet: obj => {
            let type;
            obj.wallet > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMelements.walletLabel).textContent = formatNumber(obj.wallet, type);
            document.querySelector(DOMelements.incomesLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMelements.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
        },

        changeFormColors: () => {
            const inputs = document.querySelectorAll(
                `${DOMelements.itemType},
                ${DOMelements.itemDescription},
                ${DOMelements.itemValue}`
            );
            const inputsArr = [...inputs];

            const button = document.querySelector(DOMelements.itemBtn);

            inputsArr.forEach(field => field.classList.toggle('red-focus'));
            if (inputsArr[0].classList.contains('red-focus')) {
                button.src = 'dist/images/ok-exp.svg';
            } else {
                button.src = 'dist/images/ok-inc.svg';
            }
        },

        getDOMelements: () => {

            return DOMelements;
        }
    };

})();
//---------------------------------------------------------------------------------------------------------//

// APP CONTROLLER
const appController = ((walletCtrl, UICtrl) => {

    const updateWallet = () => {
        // 1. Calculate the state of wallet
        walletCtrl.calculateWallet();
        // 2. Return the state of wallet
        const wallet = walletCtrl.getWallet();
        // 3. Display the state of wallet on the user interface
        UICtrl.displayWallet(wallet);
    };

    const ctrlAddItem = () => {
        // 1. Get the inputs data
        const input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the wallet controller
            const newItem = walletCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the user interface controller
            UICtrl.addTransactionItem(newItem, input.type);
            // 4. Clear the input fields and set focus to the description field
            UICtrl.clearFields();
            // 5. Calculate and update the wallet
            updateWallet();
        }
    };

    const ctrlDeleteItem = (e) => {
        let itemID, splitID, type, ID;
        itemID = e.target.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // inc-0
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            walletCtrl.deleteItem(type, ID);
            // 2. Delete the item from the user interface
            UICtrl.deleteTransactionItem(itemID);
            // 3. Calculate and update the wallet
            updateWallet();
        }

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

        document.querySelector(DOM.itemsContainer).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.itemType).addEventListener('change', UICtrl.changeFormColors);
    };

    return {
        init: () => {
            console.log('Application has started!');
            UICtrl.displayWallet({
                wallet: 0,
                totalInc: 0,
                totalExp: 0
            });
            setupEventListeners();
        }
    };

})(walletController, UIController);

appController.init();

//---------------------------------------------------------------------------------------------------------//


// ---------- Preloader ---------- //
window.addEventListener('load', () => {
    const preloader = document.querySelector('.loader');
    setTimeout(() => {
        preloader.classList.add('loader-finish');
    }, 1500);
});

