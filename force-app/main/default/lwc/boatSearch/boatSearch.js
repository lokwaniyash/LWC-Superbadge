// imports
import { LightningElement , wire , api , track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { publish, MessageContext } from "lightning/messageService";
import BOATMC from "@salesforce/messageChannel/boatMessageChannel__c";
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearch extends NavigationMixin(LightningElement) {
  isLoading = false;
  @track boatTypeId;

  @wire(MessageContext)
  messageContext

  // Handles loading event
  handleLoading() {
    this.isLoading = true;
  }

  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false;
  }

  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    this.boatTypeId = event.detail.boatTypeId;

    this.template.querySelector('c-boat-search-results').searchBoats(this.boatTypeId);
    // const message = {
    //   recordId: this.boatTypeId
    // }

    // publish(this.messageContext, BOATMC, message);
  }

  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Boat__c",
        actionName: "new"
      }
    });
  }
}
