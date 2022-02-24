import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
// imports
import BOAT_OBJECT from "@salesforce/schema/Boat__c"
// import getSimilarBoats
import getSimilarBoats from "@salesforce/apex/BoatDataService.getSimilarBoats"
export default class SimilarBoats extends NavigationMixin(LightningElement) {
  // Private
  currentBoat;
  relatedBoats;
  boatId;
  error;
  
  // public
  @api
  get recordId() {
      // returns the boatId
      return this.boatId;
    }
    set recordId(value) {
        // sets the boatId value
        this.boatId = value
        // sets the boatId attribute
    }
  
  // public
  @api similarBy;
  
  // Wire custom Apex call, using the import named getSimilarBoats
  // Populates the relatedBoats list
  @wire(getSimilarBoats, {boatId: '$boatId', similarBy: '$similarBy'})
  similarBoats({ error, data }) {
    if(data) {
      this.error = undefined;
      this.relatedBoats = data;
    } else if(error) {
      this.error = error;
      this.relatedBoats = undefined;
    }
  }
  get getTitle() {
    return 'Similar boats by ' + this.similarBy;
  }
  get noBoats() {
    return !(this.relatedBoats && this.relatedBoats.length > 0);
  }
  
  // Navigate to record page
  openBoatDetailPage(event) {
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            actionName: "view",
            recordId: event.detail.boatId,
            objectApiName: BOAT_OBJECT
        }
    });
  }
}
