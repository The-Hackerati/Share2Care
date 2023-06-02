document.addEventListener("DOMContentLoaded", function () {
    // Declare variables to store pin location
    var pinLat, pinLng, pinAddress;

    // Function to geocode the coordinates and get the address
    function geocodeLatLng(lat, lng) {
        var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({ 'latLng': latLng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    pinAddress = results[0].formatted_address;
                    // Autofill the address field
                    document.getElementById("address").value = pinAddress;
                } else {
                    window.alert("No address found for this location.");
                }
            } else {
                window.alert("Geocoder failed due to: " + status);
            }
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            var map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: lat, lng: lng },
                zoom: 15
            });

            var marker = new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                title: "Your Location",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#4285F4",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2
                }
            });

            var circle = new google.maps.Circle({
                strokeColor: "#4285F4",
                strokeOpacity: 0.3,
                strokeWeight: 2,
                fillColor: "#4285F4",
                fillOpacity: 0.2,
                map: map,
                center: { lat: lat, lng: lng },
                radius: 80 // Adjust the radius as needed
            });
            // Add click event listener to map
            map.addListener("click", function (event) {
                // Remove previous marker if exists
                if (marker) {
                    marker.setMap(null);
                }

                // Add new marker at clicked location
                marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                    title: "Dropped Pin"
                });

                // Store pin location
                pinLat = event.latLng.lat();
                pinLng = event.latLng.lng();

                // Geocode the coordinates to get the address
                geocodeLatLng(pinLat, pinLng);
            });

            // Add button click event listener to save pin location
            // var saveBtn = document.getElementById("save-button");
            // saveBtn.addEventListener("click", function () {
            //     // Check if pin location is available
            //     if (pinLat && pinLng) {
            //         // Save the pin location using Firebase
            //         var pinRef = firebase.database().ref("pins").push();
            //         pinRef.set({
            //             latitude: pinLat,
            //             longitude: pinLng
            //         }).then(function () {
            //             window.alert("Pin location saved successfully!");
            //         }).catch(function (error) {
            //             window.alert("Failed to save pin location: " + error.message);
            //         });
            //     } else {
            //         window.alert("No pin location available to save!");
            //     }
            // });
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyB-vWKWiTqYfYwjIIcd_1W1_BLSuibzTb4",
    authDomain: "food4all-427ea.firebaseapp.com",
    projectId: "food4all-427ea",
    databaseURL: "https://food4all-427ea-default-rtdb.firebaseio.com",
    storageBucket: "food4all-427ea.appspot.com",
    messagingSenderId: "842713498087",
    appId: "1:842713498087:web:3e5baf4e9a169d0a23bd42"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase();


const submitBtn = document.getElementById("submit-button");

submitBtn.addEventListener("click", function () {
    event.preventDefault();
    const number = document.getElementById("number").value;
    const address = document.getElementById("address").value;
    // const pinLat = document.getElementById("pinLat").value;
    // const pinLng = document.getElementById("pinLng").value;
    const food = document.getElementById("food").value;
    const quantity = document.getElementById("quantity").value;
    const expiry = document.getElementById("expiry").value;

    onAuthStateChanged(auth, (user) => {
        // const user = result.user;
        const reference = ref(db, "listings/" + user.uid);
        // window.alert("User registered successfully");
        set(reference, {
            number: number,
            address: address,
            // pinLat: pinLat,
            // pinLng: pinLng,
            food: food,
            quantity: quantity,
            expiry: expiry,
            time_added: Date.now(),
        })
            .then(() => {
                window.alert("listings added successfully");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " " + errorMessage);
                window.alert("Error: " + errorMessage);
            });
    });



})