import { LightningElement, track } from 'lwc';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import sortable from '@salesforce/resourceUrl/sortable';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class bundlerManager extends LightningElement {

    @track cards = [];
    @track boxes = [];
    @track firstName;
    @track lastName;
    @track phone;
    @track nameValue;
    @track pageType = 'mainPage';
    @track indexCard = 0;
    @track currentIndex = 0;

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
            loadScript(this, sortable + '/Sortable.js'),
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
        this.pageType = "modalPage";
    }

    handleDismissModal() {
        this.pageType = "mainPage";
    }

    handleAddCard() {
        if (this.nameValue) {
            this.cards = [
                ...this.cards,{
                    indexCard: this.indexCard,
                    nameValue: this.nameValue
                }
            ];
            this.indexCard++;
            this.pageType = "mainPage";
        }
    }

    handleAddNewBox() {
        if (this.firstName && this.lastName && this.phone) {
            this.boxes = [
                ...this.boxes,{
                    boxId: this.currentIndex,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    phone: this.phone
                }
            ];

            let tempBox = [];

            for (let i = 0; i < this.boxes.length; i++) {
                if (this.boxes[i].boxId === this.currentIndex) {
                    tempBox.push(this.boxes[i]);
                }
            }

            this.cards[this.currentIndex] = {
                indexCard: this.cards[this.currentIndex].indexCard,
                nameValue: this.cards[this.currentIndex].nameValue,
                boxes: tempBox
            };

            this.firstName = '';
            this.lastName = '';
            this.phone = '';
            this.pageType = "mainPage";
        }
    }

    handleAddBox(event) {
        this.currentIndex = event.target.name;
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