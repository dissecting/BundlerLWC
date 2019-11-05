import { LightningElement, api } from 'lwc';

export default class boxCard extends LightningElement {
    @api boxes = [];
    @api firstName;
    @api lastName;
    @api phone;
}