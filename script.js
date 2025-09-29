const API_KEY = '52408913-2f3071833a6b6dd73a3aca7fb';
const BASE_URL = 'https://pixabay.com/api/';

const searchButton = document.getElementById('search-button');
const imageQueryInput = document.getElementById('image-query');
const resultsContainer = document.getElementById('results-container');

searchButton.addEventListener('click', handleSearch);
imageQueryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const query = imageQueryInput.value.trim();

    if (!query) {
        displayMessage('Please enter a keyword to search for images. 🛑', 'error');
        return; 
    }
    fetchImages(query);
}

/**
 * Makes the HTTP GET request to the Pixabay API.
 * @param {string} query - The image keyword to search for.
 */
async function fetchImages(query) {
    const endpoint = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=12`;

    displayMessage('Searching...', 'loading');

    try {

        const response = await fetch(endpoint);

        if (!response.ok) {
     
            throw new Error(`HTTP error! Status: ${response.status}. Check network connection.`);
        }

        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            displayResults(data.hits);
        } else {
            displayMessage(`No images found for "${query}". Try a different search term. 🤔`, 'error');
        }

    } catch (error) {
        console.error("Fetch error:", error);
        displayMessage('Failed to fetch image data. Ensure your API Key is correct and try again. ❌', 'error');
    }
}

/**
 * Clears the container and displays the image cards.
 * @param {Array<Object>} images - Array of image objects from the API (the 'hits' array).
 */
function displayResults(images) {
    resultsContainer.innerHTML = '';
    images.forEach(image => {
        const imageSource = image.webformatURL;   // webformatURL -> Image Source
        const tags = image.tags;                   // tags -> Image Tags
        const photographerName = image.user;       // user -> Photographer Name
        const likes = image.likes;                 // likes -> Number of Likes
        const downloads = image.downloads;         // downloads -> Number of Downloads
       
        const tagList = tags.split(',').map(tag => tag.trim()).join(', ');

        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');
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

    if (type === 'error') {
        msgElement.classList.add('error-message');
    } else {
        msgElement.classList.add('initial-message');
    }
    
    resultsContainer.appendChild(msgElement);
}

displayMessage('Enter a search keyword above to fetch images!', 'info');
