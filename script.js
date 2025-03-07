'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, distance, duration){
        this.coords = coords; // [lat, lng];
        this.distance = distance; // in km
        this.duration = duration; // in min
    }
}

class Running extends Workout {
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
    }


    calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    constructor(coords, distance, duration, elevation){
        super(coords, distance, duration);
        this.cadence = elevation;
        this.calcSpeed();
 }

 calcSpeed(){
    this.speed = this.distance / (this.duration)
    return this.speed;
 }
}


///////////////////////////////////////////////////////
// Arquitectura de la aplicacion
class App {
    #map;
    #mapEvent;
    constructor(){
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField.bind(this));
    }
        _getPosition(){
            if(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
                    alert('Could not get your position')
            })
        }

        _loadMap(position){
                const {latitude} = position.coords;
                const {longitude} = position.coords;
                console.log(`https://www.google.com/maps/@${latitude},-${longitude}z?hl=es&entry=ttu&g_ep=EgoyMDI1MDMwMi4wIKXMDSoASAFQAw%3D%3D`);
                const coords = [latitude, longitude];
                 this.#map = L.map('map').setView(coords, 13);
            
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.#map);
            
            
                this.#map.on('click',this._showForm.bind(this));
        }

        _showForm(mapE){
            this.#mapEvent = mapE;
            form.classList.remove('hidden');
            inputDistance.focus();
        }

        _toggleElevationField(){
            inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
            inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
        }

        _newWorkout(e){
            e.preventDefault();

            // clear input fields
            inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value= '';
        
            // Display markers
            const { lat, lng } = this.#mapEvent.latlng
            const marker = L.marker([lat, lng]).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick:false,
            className: 'running-popup',
             })).setPopupContent('Workout').openPopup();
        }
}

const app = new App();





