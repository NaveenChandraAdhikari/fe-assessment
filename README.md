# 📖 Interactive Dictionary Web App

A clean, responsive, and feature-rich dictionary built with HTML,CSS,JS.This project fetches and displays word definitions, phonetics, and examples from public APIs, providing a seamless user experience with a sleek dark theme and dynamic animations.
<img width="1848" height="975" alt="Screenshot from 2025-07-14 18-54-37" src="https://github.com/user-attachments/assets/c149d745-31dd-4b45-982b-44d6b4f6f60b" />

<img width="1848" height="975" alt="Screenshot from 2025-07-14 18-55-01" src="https://github.com/user-attachments/assets/d8bcf0d1-51bb-4209-857e-06bc31e76393" />

### ## Live Demo

Check out the live version of the app here: **https://naveenchandraadhikari.github.io/fe-assessment/**
---

### ## Features

* **Dynamic Homepage:** Displays a random selection of 6 words on every visit.
* **Detailed View:** Click on any word to navigate to a detailed view with comprehensive information.
* **Multiple Definitions:** Displays all noun definitions available from the API, not just the first one.
* **Phonetic Information:** Shows the phonetic spelling for each word.
* **Usage Examples:** Provides example sentences for definitions when available.
* **Data Persistence:** Remembers the last viewed word on the details page even after a refresh, using `localStorage`.
* **Responsive Design:** A fully responsive layout that looks great on desktops, tablets, and mobile devices.
* **Loading States:** Smooth loading spinners provide a better user experience during API calls.

---

### ## Technologies Used

This project was built using the following technologies:

* **HTML5:** For the structure and content of the application.
* **CSS3:** For styling, layout, and animations.
    * **Flexbox:** For creating responsive and flexible layouts.
    * **CSS Animations & Keyframes:** For the animated backgrounds and loading spinner.
    * **Media Queries:** For adapting the layout to different screen sizes.
* **JavaScript (ES6+):** For all application logic.
    * **Async/Await with the Fetch API:** For handling asynchronous network requests to get word data.
    * **DOM Manipulation:** To dynamically create and update the content on the page.
    * **localStorage API:** For client-side data persistence.

* **APIs:**
    * [DictionaryAPI.dev](https://dictionaryapi.dev/): For fetching detailed word definitions.
    * [Firebase](https://firebase.google.com/): Used to host the initial list of random words.

---

### ## Getting Started

To run this project locally on your machine, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/NaveenChandraAdhikari/fe-assessment.git
        ```
2.  **Navigate to the project directory:**
    ```bash
    cd fe-assessment
    ```
3.  **Open the `index.html` file in your browser.**


---

### ## What I Learned

This project was a great opportunity to practice and solidify my understanding of core web development concepts, including:

* Making asynchronous API calls and handling the responses, including loading and error states.
* Manipulating the DOM based on user interaction and fetched data.
* Building a responsive, mobile-first user interface with modern CSS.
* Implementing client-side storage with `localStorage` to create a persistent user experience.
* Structuring code across multiple files (HTML, CSS, JS) for better organization and maintainability.

---
