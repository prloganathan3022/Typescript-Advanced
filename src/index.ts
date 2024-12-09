const form = document.querySelector("form")!;

var map = L.map('map')
map.setView([13.0827, 80.2707], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

form.addEventListener("submit", async (event: Event) => {
    const elementToRemove = document.querySelector('#error p');
    if (elementToRemove) {
        elementToRemove.remove();
        console.log('Element removed successfully.');
    }
    event.preventDefault();
    const location = document.getElementById('input1')! as HTMLInputElement;
    console.log(location.value);

    try {
        const response = await fetchGeoLocation(location.value);
        const coordinates = await response.json();
        console.log(coordinates);
        if (coordinates.length == 0) {
            throw new Error("Location not found. Please enter correct address!");
        }
        const coordinateDetails = {
            lat: parseFloat(coordinates[0].lat),
            lng: parseFloat(coordinates[0].lon)
        };
        map.setView([parseFloat(coordinates[0].lat), parseFloat(coordinates[0].lon)], 13)

    } catch (error: any) {
        const divElement = document.getElementById('error')!;
        const errorMessage = document.createElement('p');
        errorMessage.textContent = error.message;
        divElement.appendChild(errorMessage);
    }
});

async function fetchGeoLocation(input: string) {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`);
    return res;
}