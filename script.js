// **API Configuration**
// IMPORTANT: Replace 'YOUR_PIXABAY_API_KEY' with your actual Pixabay API key.
const API_KEY = '52408913-2f3071833a6b6dd73a3aca7fb';
const BASE_URL = 'https://pixabay.com/api/';

// **DOM Elements**
const searchButton = document.getElementById('search-button');
const imageQueryInput = document.getElementById('image-query');
const resultsContainer = document.getElementById('results-container');

// **Event Listeners for User Input**
searchButton.addEventListener('click', handleSearch);
imageQueryInput.addEventListener('keypress', (e) => {
    // Allows pressing 'Enter' key to trigger the search
    if (e.key === 'Enter') {
        handleSearch();
    }
});

/**
 * Handles the search action: gets the query, validates it, and calls the fetch function.
 */
function handleSearch() {
    // Get the trimmed value from the input field
    const query = imageQueryInput.value.trim();

    // **User Input Feature Error Handling (Empty Query)**
    if (!query) {
        displayMessage('Please enter a keyword to search for images. 🛑', 'error');
        return; // Stop the function if the query is empty
    }

    // Call the function to fetch data
    fetchImages(query);
}

/**
 * Makes the HTTP GET request to the Pixabay API.
 * @param {string} query - The image keyword to search for.
 */
async function fetchImages(query) {
    // Construct the API endpoint for searching images
    // Parameters: key (auth), q (query), image_type=photo (filter), per_page=12 (limit results)
    const endpoint = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12`;

    // Clear previous results and display a loading message
    displayMessage('Searching...', 'loading');

    try {
        // **HTTP GET Request**
        const response = await fetch(endpoint);

        // Check if the HTTP status is OK (200-299)
        if (!response.ok) {
            // **Error Handling for Network/HTTP Issues**
            throw new Error(`HTTP error! Status: ${response.status}. Check network connection.`);
        }

        // **Parse JSON Data**
        const data = await response.json();

        // Pixabay uses a 'hits' array for results. Check if results were found.
        if (data.hits && data.hits.length > 0) {
            displayResults(data.hits);
        } else {
            // **Error Handling for No Results**
            displayMessage(`No images found for "${query}". Try a different search term. 🤔`, 'error');
        }

    } catch (error) {
        console.error("Fetch error:", error);
        // Display a general error message
        displayMessage('Failed to fetch image data. Ensure your API Key is correct and try again. ❌', 'error');
    }
}

/**
 * Clears the container and displays the image cards.
 * @param {Array<Object>} images - Array of image objects from the API (the 'hits' array).
 */
function displayResults(images) {
    // Clear the container before adding new results
    resultsContainer.innerHTML = '';

    // Loop through the array of image objects
    images.forEach(image => {
        // **Data Mapping and User-Friendly Format**
        
        // Data Mapping (Required Fields):
        const imageSource = image.webformatURL;   // webformatURL -> Image Source
        const tags = image.tags;                   // tags -> Image Tags
        const photographerName = image.user;       // user -> Photographer Name
        const likes = image.likes;                 // likes -> Number of Likes
        const downloads = image.downloads;         // downloads -> Number of Downloads
        
        // Clean up tags for display
        const tagList = tags.split(',').map(tag => tag.trim()).join(', ');

        // Create the HTML for a single image card
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');
        
        // Using Font Awesome icons for better visual presentation of data
        imageCard.innerHTML = `
            <img src="${imageSource}" alt="${tagList}">
            <div class="image-info">
                <div class="data-field">
                    <span>Photographer:</span> <strong>${photographerName}</strong>
                </div>
                <div class="data-field">
                    <span><i class="fas fa-thumbs-up"></i> Likes:</span> <strong>${likes}</strong>
                </div>
                <div class="data-field">
                    <span><i class="fas fa-download"></i> Downloads:</span> <strong>${downloads}</strong>
                </div>
                <p class="tags">Tags: ${tagList}</p>
            </div>
        `;
        
        // Add the new card to the results container
        resultsContainer.appendChild(imageCard);
    });
}

/**
 * Clears the results and displays a status/error message.
 * @param {string} message - The message text to display.
 * @param {string} type - The type of message ('loading', 'error', 'info').
 */
function displayMessage(message, type) {
    resultsContainer.innerHTML = ''; // Clear previous content
    const msgElement = document.createElement('p');
    msgElement.textContent = message;
    
    // Apply appropriate styling class
    if (type === 'error') {
        msgElement.classList.add('error-message');
    } else {
        msgElement.classList.add('initial-message');
    }
    
    resultsContainer.appendChild(msgElement);
}

// Initial state message
displayMessage('Enter a search keyword above to fetch images!', 'info');
