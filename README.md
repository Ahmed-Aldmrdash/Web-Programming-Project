# Weather Dashboard

## Project Description
A dynamic, responsive weather application that fetches real-time weather conditions and a 5-day forecast for any given city using a public Weather API. The project features a custom backend built with PHP and MySQL to persist user-saved locations and track search history securely.

## Features
* **Real-time Weather Data:** Displays current weather conditions and a 5-day forecast using asynchronous JavaScript (Fetch API).
* **City Search & History:** Users can search for global cities, with search history automatically logged and retrieved from a MySQL database.
* **Favorite Locations:** Users can save specific cities to a persistent sidebar for quick access.
* **Responsive Dashboard:** A modern UI utilizing CSS Grid and Flexbox, fully optimized for mobile, tablet, and desktop screens.
* **Secure Backend:** PHP endpoints utilizing PDO and prepared statements to prevent SQL injection, alongside strict input sanitization.

## Tech Stack
* **Frontend:** HTML5 (Semantic), CSS3 (Grid, Flexbox, Media Queries), Vanilla JavaScript (ES6+)
* **Backend:** PHP, MySQL
* **API:** [Insert Weather API Name Here, e.g., OpenWeatherMap]

## Setup Instructions
1. Clone the repository to your local server environment (e.g., XAMPP, WAMP) or shared hosting.
2. Create a new MySQL database and import the provided `.sql` file to set up the necessary tables for saved cities and search history.
3. Open the PHP database connection file and update the credentials (database name, username, password).
4. Obtain an API key from your chosen weather service and insert it into the JavaScript configuration variables.
5. Open the project in your browser to view the frontend or navigate to the live deployment link.

---
## Developers
* **Ahmed Mohamed Fathy Aldmrdash** (ID: 240102791)
* **Omar Ahmed Ramadan Ramadan** (ID: 240102684)
* **Shimaa Hussien** (ID: 240102170)
