// ...
import { LightningElement, api, wire, track } from "lwc";
import {
  publish,
  subscribe,
  unsubscribe,
  MessageContext
} from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import BOATMC from "@salesforce/messageChannel/boatMessageChannel__c";
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import updateBoatList from "@salesforce/apex/BoatDataService.updateBoatList";
const SUCCESS_TITLE = "Success";
const MESSAGE_SHIP_IT = "Ship it!";
const SUCCESS_VARIANT = "success";
const ERROR_TITLE = "Error";
const ERROR_VARIANT = "error";

const columns = [
  { label: "Name", fieldName: "Name", editable: true },
  { label: "Length", fieldName: "Length__c", type: "number", editable: true },
  { label: "Price", fieldName: "Price__c", type: "currency", editable: true },
  {
    label: "Description",
    fieldName: "Description__c",
    type: "textarea",
    editable: true
  }
];
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = columns;
  @track boatTypeId = "";
  boats;
  isLoading = false;

  error;
  subscription = null;

  connectedCallback() {
    this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
      this.selectedBoatId = message.recordId;
    });
  }

  // wired message context
  @wire(MessageContext)
  messageContext;
  // wired getBoats method
  @wire(getBoats, { boatTypeId: "$boatTypeId" })
  wiredBoats(result) {
    if (result.data) {
      this.boats = result.data;
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.boats = undefined;
    }
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
    this.notifyLoading(false);
  }

  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api
  async refresh() {
    this.notifyLoading(true);
    refreshApex(this.boats);
  }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    const message = {
      recordId: this.selectedBoatId
    };
    publish(this.messageContext, BOATMC, message);
    // explicitly pass boatId to the parameter recordId
  }

  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  async handleSave(event) {
    // notify loading
    this.notifyLoading(true);
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({ data: updatedFields })
      .then(() => {
        const evt = new ShowToastEvent({
          title: SUCCESS_TITLE,
          variant: SUCCESS_VARIANT,
          message: MESSAGE_SHIP_IT
        });
      })
      .catch((error) => {
        const evt = new ShowToastEvent({
          title: ERROR_TITLE,
          variant: ERROR_VARIANT
        });
      })
      .finally(() => {
        this.refresh();
      });
      this.notifyLoading(false);
  }

  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (isLoading) {
      const loadEvent = new CustomEvent("loading", {
      });
      this.dispatchEvent(loadEvent);
    } else {
      const loadEvent = new CustomEvent("doneloading", {
      });
      this.dispatchEvent(loadEvent);
    }
  }
}
