# 🌤️ Modern Weather Dashboard - SUT Project

## 📌 1. Project Overview
The **Modern Weather Dashboard** is a fully integrated Full-Stack Web Application designed to provide accurate, real-time weather information for any city worldwide. The application displays current weather conditions and a 5-day forecast, featuring a smart search history system stored in a local database to help users quickly access their most searched locations.

---

## 👥 2. Team Members & Roles
This project was developed collaboratively by students of **Elsewedy University of Technology (SUT)**, with tasks distributed as follows:

* 👑 **Ahmed Aldmrdash (Team Leader & AI Engineer):**
  * Project management and team coordination via GitHub Version Control.
  * UI/UX design and core layout implementation (HTML/CSS).
  * Developed the Dark/Light Mode logic and state management.
  * Mapped local, high-quality weather icons to corresponding weather conditions.
* 👨‍💻 **Omar Ahmed Ramadan (Frontend & API Integrator):**
  * Handled DOM Manipulation to dynamically display data on the user interface.
  * Integrated the External API (OpenWeatherMap) using `async/await` and `Fetch API`.
  * Extracted and processed the 5-day forecast data, calculating true daily maximum and minimum temperatures.
* 👩‍💻 **Shimaa Hussien (Backend & Database Administrator):**
  * Designed and built the MySQL database architecture.
  * Programmed the backend PHP scripts (`save_city.php` and `get_history.php`).
  * Managed data persistence operations, implementing a custom "Latest on Top" logic for recent searches.

---

## 🛠️ 3. Technologies Used
* **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6+).
* **Backend:** PHP 8.x.
* **Database:** MySQL (via XAMPP Control Panel).
* **Version Control:** Git & GitHub.
* **External API:** OpenWeatherMap API.

---

## 📡 4. API Details & Integration
We relied on the OpenWeatherMap API as a robust and free source for meteorological data.

* **Endpoints Used:**
  1. **Current Weather:** `https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={API_KEY}`
  2. **5-Day Forecast:** `https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&appid={API_KEY}`
* **Programmatic Handling:**
  We utilized the JavaScript `Fetch API` alongside `Promise.all` to perform parallel data fetching for both current conditions and forecasts. This approach significantly reduces load times. We also implemented comprehensive `try...catch` blocks to gracefully handle errors, such as invalid city name inputs.

---

## ⚙️ 5. Project Features & Core Logic
The application incorporates several advanced logic concepts and features:

1. **Smart Icon Mapping:** We bypassed the default API icons, creating a custom `getWeatherIcon()` function. This algorithm maps weather description keywords (e.g., "rain", "clear", "clouds") to a local directory of high-quality images, ensuring a premium UI.
2. **Data Aggregation Algorithm:** The API returns 40 data points (every 3 hours over 5 days). We engineered a JavaScript algorithm to aggregate these points, extracting the true daily maximum temperature, minimum temperature, and noon weather condition to display in clean cards and a detailed table.
3. **Persistent Dark/Light Mode:** Integrated a theme toggler that saves the user's preference in the browser's `localStorage`, ensuring the selected theme persists across page reloads.
4. **Auto-Sorting Smart History:** When a city is searched, it is saved to the database. If an existing city is searched again (or clicked from the sidebar), the backend deletes the old record and re-inserts it as a new query. This guarantees that the most recently interacted-with cities always float to the top of the list (Latest on Top).

---

## 🗄️ 6. Database Architecture
We utilized the XAMPP environment to host our local server (Apache/MySQL).

* **Database Name:** `weather_app`
* **Main Table:** `search_history`
* **Schema Columns:**
  * `id`: INT (Primary Key, Auto Increment).
  * `city_name`: VARCHAR(255) (Stores the requested city).
  * `search_date`: TIMESTAMP (Automatically records the time of the query).

**Integration Flow:**
The frontend JS sends a POST request containing the city name to `save_city.php`. The PHP script executes an SQL query to remove any duplicate records before inserting the new entry, effectively updating its timestamp and ID. The JS then immediately fetches data from `get_history.php` to dynamically update the sidebar UI without requiring a page refresh.

---

## 🐙 7. GitHub Workflow
To maintain a professional and trackable development environment, Git and GitHub were strictly utilized:
1. **Repository Creation:** A central repository was established for version control.
2. **Task Distribution:** A `TASK_DISTRIBUTION.md` file was maintained to document individual responsibilities clearly.
3. **Staged Commits:** Code was pushed in logical stages (Initial boilerplate, API integration updates, Backend/DB linking, and final Bug Fixes).
