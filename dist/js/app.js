// WALLET CONTROLLER
const walletController = (() => {

})();
//---------------------------------------------------------------------------------------------------------//

// USER INTERFACE CONTROLLER
const UIController = (() => {

})();
//---------------------------------------------------------------------------------------------------------//

// APP CONTROLLER
const appController = ((walletCtrl, UICtrl) => {

    const addItem = () => {
        // 1. Get the inputs data

        // 2. Add the item to the wallet controller

        // 3. Add the item to the user interface controller

        // 4. Calculate the state of wallet

        // 5. Display the state of wallet on the user interface

        console.log('It works!');
    }

    // Add event listener on form submit
    document.querySelector('.transactions__form').addEventListener('submit', e => {
        e.preventDefault();
        addItem();
    });

    // Add event listener on press enter
    document.addEventListener('keypress', e => {
        if (e.keyCode === 13 || e.which === 13) {
            addItem();
        }
    });

})(walletController, UIController);
