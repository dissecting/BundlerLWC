import { LightningElement, track } from 'lwc';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import sortable from '@salesforce/resourceUrl/sortable';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';

export default class bundlerManager extends LightningElement {

    @track cards = [];
    @track pageType = 'mainPage';
    nameValue;
    firstName;
    lastName;
    phone;
    indexCard = 0;
    indexMap = new Map();
    currentIndex = 0;
    boxCard = true;
    indexCurrentCard;
    oldIndex;
    newIndex;
    openCard = 'inner-card-body card-body';
    closeCard = 'inner-card-close card-body';

    get isModal() {
        return this.pageType === 'modalPage' ? true : false;
    }

    get isInnerModal() {
        return this.pageType === 'innerModalPage' ? true : false;
    }

    get isMain() {
        return this.pageType === 'mainPage' ? true : false;
    }

    renderedCallback() {
        let self = this;
        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap.css'),
            loadScript(this, sortable + '/Sortable.js')
        ])
        .then(() => {
            let currentBlock = this.template.querySelectorAll('div.box-list');
            if (currentBlock) {
                currentBlock.forEach(currBlock => {
                    // eslint-disable-next-line no-undef
                    Sortable.create(currBlock, {
                        animation: 150,
                        ghostClass: 'background-ghost',
                        onEnd: function (event) {
                            self.indexCurrentCard = Number((event.target.id).split('-')[0]);
                            self.oldIndex = event.oldIndex;
                            self.newIndex = event.newIndex;
                            self.setTimeout(self.handleSortBoxes(), 500);
                        }
                    });
                });
            }
        })
        .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error.message);
        });
    }

    handleSortBoxes() {
        if (this.newIndex >= this.cards[this.indexCurrentCard].boxes.length) {
            let i = this.newIndex - this.cards[this.indexCurrentCard].boxes.length;

            while ((i--) + 1) {
                this.cards[this.indexCurrentCard].boxes.push(undefined);
            }
        }
        this.cards[this.indexCurrentCard].boxes.splice(this.newIndex, 0, this.cards[this.indexCurrentCard].boxes.splice(this.oldIndex, 1)[0]);
    }

    handleNewBundler() {
        this.pageType = 'modalPage';
    }

    handleDismissModal() {
        this.pageType = 'mainPage';
    }

    handleAddCard() {
        if (this.nameValue) {
            this.cards.push({
                indexCard: this.indexCard,
                nameValue: this.nameValue,
                boxStyle: this.openCard,
                boxCard: this.boxCard,
                boxes: []
            });
            this.indexMap.set(this.indexCard, 0);
            this.indexCard++;
            this.pageType = 'mainPage';
        }
    }

    handleAddNewBox() {
        if (this.firstName && this.lastName && this.phone) {
            this.cards[this.currentIndex].boxes.push({
                cardId: this.currentIndex,
                boxId: this.indexMap.get(this.currentIndex),
                firstName: this.firstName,
                lastName: this.lastName,
                phone: this.phone
            });
            this.indexMap.set(this.currentIndex, this.indexMap.get(this.currentIndex) + 1);

            this.firstName = '';
            this.lastName = '';
            this.phone = '';
            this.pageType = 'mainPage';
        }
    }

    handleAddBox(event) {
        this.currentIndex = event.target.name;
        this.pageType = 'innerModalPage';
    }

    handleToggleBox(event) {
        this.currentIndex = event.target.name;
        this.cards[this.currentIndex].boxCard = !this.cards[this.currentIndex].boxCard;
        if (this.cards[this.currentIndex].boxCard) {
            this.cards[this.currentIndex].boxStyle = this.openCard;
        } else {
            this.cards[this.currentIndex].boxStyle = this.closeCard;
        }
    }

    handleInputData(event) {
        switch (event.target.name) {
            case 'cardName':
                this.nameValue = event.target.value;
                break;
            case 'firstName':
                this.firstName = event.target.value;
                break;
            case 'lastName':
                this.lastName = event.target.value;
                break;
            case 'phone':
                this.phone = event.target.value;
                break;
            default:
                break;
        }
    }
}