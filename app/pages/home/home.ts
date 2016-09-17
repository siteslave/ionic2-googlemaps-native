import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import { GoogleMap, GoogleMapsMarkerOptions, GoogleMapsMarker, GoogleMapsEvent, Geolocation, GoogleMapsLatLng } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
  
export class HomePage implements OnInit {
  map: GoogleMap
  latLng: GoogleMapsLatLng
  mapsMarker: GoogleMapsMarker

  constructor(private navCtrl: NavController) {}

  createMarker(latLng: GoogleMapsLatLng, title?: string) {
    let _title = title || 'Your location';
    let markerOptions: GoogleMapsMarkerOptions = {
      position: latLng,
      title: _title,
      draggable: true
    }

    this.map.addMarker(markerOptions)
      .then((marker: GoogleMapsMarker) => {
        this.mapsMarker = marker
        // marker.showInfoWindow();
      });
  }

  ngOnInit() {
    GoogleMap.isAvailable().then(() => {

      this.map = new GoogleMap('map', {
        'backgroundColor': 'white',
        'mapType': 'plugin.google.maps.MapTypeId.HYBRID',
        'controls': {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': true,
          'zoom': true
        }
      });

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        // this.map.setCenter(this.latLng)
        this.map.setZoom(16)
        this.map.setMapTypeId('MAP_TYPE_HYBRID')
        this.map.refreshLayout()

        Geolocation.getCurrentPosition().then((resp) => {
          console.log(resp)
          this.latLng = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);
          this.map.setCenter(this.latLng);
          this.createMarker(this.latLng, 'ที่อยู่ปัจจุบัน')
        }, err => {
          console.log(err)
        });
        
      });

      this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((latLng) => {

        this.mapsMarker.remove();
        let markerOptions: GoogleMapsMarkerOptions = {
          position: latLng
        }
        this.map.addMarker(markerOptions)
          .then((marker: GoogleMapsMarker) => {
            this.mapsMarker = marker;
          });
      });

      this.map.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.mapsMarker.showInfoWindow()
      })

      this.map.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe((latLng) => {
        this.mapsMarker.remove();
        this.latLng = latLng;
        let markerOptions: GoogleMapsMarkerOptions = {
          position: this.latLng
        }
        this.map.addMarker(markerOptions)
          .then((marker: GoogleMapsMarker) => {
            this.mapsMarker = marker;
          });
      })

    }, err => {
      alert('Unable to load Google Map')
    });
  }

  sendLocation() {
    alert(JSON.stringify(this.latLng))
    // lat, lng
  }  

}
