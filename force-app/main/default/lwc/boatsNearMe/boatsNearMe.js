// imports
import { LightningElement, wire, api } from "lwc";
import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const LABEL_YOU_ARE_HERE = "You are here!";
const ICON_STANDARD_USER = "standard:user";
const ERROR_TITLE = "Error loading Boats Near Me";
const ERROR_VARIANT = "error";
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId = "";
  mapMarkers = [];
  isLoading = true;
  isRendered = "false";
  latitude;
  longitude;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, {
    latitude: "$latitude",
    longitude: "$longitude",
    boatTypeId: "$boatTypeId"
  })
  wiredBoatsJSON({ error, data }) {
    if (data) {
      this.createMapMarkers(data);
      this.isLoading = false;
    } else if (error) {
      const evt = new ShowToastEvent({
        title: ERROR_TITLE,
        variant: ERROR_VARIANT
      });
      this.dispatchEvent(evt);
      return;
    }
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    this.isRendered = true;
    this.getLocationFromBrowser();
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    });
  }

  // Creates the map markers
  createMapMarkers(boatData) {
    // const newMarkers = boatData.map(boat => {...});
    // newMarkers.unshift({...});
    // console.log(JSON.parse(boatData)[0], 'test1');
    const newMarkers = JSON.parse(boatData).map((boat) => {
      let marker = {
        location: {
          Latitude: boat.Geolocation__Latitude__s,
          Longitude: boat.Geolocation__Longitude__s
        },
        title: boat.Name
      };

      
      return marker;
    });
    console.log(newMarkers, 'testmark');

    newMarkers.unshift({
      location: {
        Latitude: this.latitude,
        Longitude: this.longitude
      },
      title: LABEL_YOU_ARE_HERE,
      icon: ICON_STANDARD_USER
    });

    this.mapMarkers = newMarkers;
    this.isLoading = false;
  }
}
