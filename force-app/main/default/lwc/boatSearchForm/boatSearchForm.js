// imports
import { LightningElement , wire} from "lwc";
// import getBoatTypes from the BoatDataService => getBoatTypes method';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearchForm extends LightningElement {
  selectedBoatTypeId = '';
  
  // Private
  error = undefined;
  
  searchOptions;
  
  // Wire a custom Apex method
  @wire(getBoatTypes)
    boatTypes({ error, data }) {
    if (data) {
      this.searchOptions = data.map(type => {
        let obj = {label: type.Name, value: type.Id}
        return obj;
      });
      this.searchOptions.unshift({ label: 'All Types', value: '' });
    } else if (error) {
      this.searchOptions = undefined;
      this.error = error;
    }
  }
  
  // Fires event that the search option has changed.
  // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
  handleSearchOptionChange(event) {
    // event.preventDefault();
    // Create the const searchEvent
    // searchEvent must be the new custom event search
    this.selectedBoatTypeId = event.detail.value;
    const searchEvent = new CustomEvent('search', { detail: {boatTypeId: this.selectedBoatTypeId} });
    this.dispatchEvent(searchEvent);
  }
}
