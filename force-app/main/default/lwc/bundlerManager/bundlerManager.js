import { LightningElement, track } from 'lwc';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class bundlerManager extends LightningElement {

    @track cards = [];
    @track boxes = [];
    @track firstName;
    @track lastName;
    @track phone;
    @track nameValue;
    @track pageType = 'mainPage';
    boxCount = 0;

    get isModal() {
        return this.pageType === "modalPage" ? true : false;
    }

    get isInnerModal() {
        return this.pageType === "innerModalPage" ? true : false;
    }

    get isMain() {
        return this.pageType === "mainPage" ? true : false;
    }

    renderedCallback() {

        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap.css')
        ])
        .then(() => {
            console.log('Downloaded');
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    handleNewBundler() {
        this.firstName = '';
        this.lastName = '';
        this.phone = '';
        this.pageType = "modalPage";
    }

    handleDismissModal() {
        this.pageType = "mainPage";
    }

    handleAddCard() {
        if (this.nameValue) {
            this.cards.push(this.nameValue);
            this.pageType = "mainPage";
        }
    }

    handleAddNewBox() {
        if (this.firstName && this.lastName && this.phone) {
            this.boxCount++;
            this.boxes.push(this.boxCount);
            this.pageType = "mainPage";
        }
    }

    handleAddBox() {
        this.pageType = "innerModalPage";
    }

    handleInputName(event) {
        this.nameValue = event.target.value;
    }

    handleInputFirstName(event) {
        this.firstName = event.target.value;
    }

    handleInputLastName(event) {
        this.lastName = event.target.value;
    }

    handleInputPhone(event) {
        this.phone = event.target.value;
    }
}