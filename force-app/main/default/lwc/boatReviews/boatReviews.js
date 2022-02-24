import { LightningElement, api } from 'lwc';
import { refreshApex } from "@salesforce/apex";
import { NavigationMixin } from "lightning/navigation";
import BOAT_REVIEW_OBJECT from "@salesforce/schema/BoatReview__c";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";
// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  boatReviews;
  isLoading;
  
  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    //sets boatId attribute
    //sets boatId assignment
    this.boatId = value;
    //get reviews associated with boatId
    this.getReviews();
  }
  
  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    if(this.boatReviews == null || this.boatReviews == undefined || this.boatReviews.length == 0) return false;
    else return true;
  }
  
  // Public method to force a refresh of the reviews invoking getReviews
  @api
  refresh() {
    refreshApex(this.boatReviews);
  }
  
  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    if(this.boatId == null || this.boatId.length == 0) return;
    this.isLoading = true;
    getAllReviews({ boatId: this.boatId })
            .then((result) => {
                this.boatReviews = result;
                this.error = undefined;;
            })
            .catch((error) => {
                this.error = error;
                this.boatReviews = undefined;
            }).finally(() => {
              this.isLoading = false;
            })
  }
  
  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: event.target.dataset.recordId,
            objectApiName: BOAT_REVIEW_OBJECT,
            actionName: 'view'
        }
    });
  }
}
