const CLIENT_ID = '52408913-2f3071833a6b6dd73a3aca7fb';
const BASE_URL = 'https://api.unsplash.com/search/photos';

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
        displayMessage('Please enter a keyword to search for images. 💡', 'error');
        return;
    }

    fetchImages(query);
}

/**
 * Makes the HTTP GET request to the Unsplash API.
 * @param {string} query - The image keyword to search for.
 */
async function fetchImages(query) {
    const endpoint = `${BASE_URL}?query=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&per_page=12`;

    displayMessage('Searching...', 'loading');

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}. Check if your Client ID is valid.`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayResults(data.results);
        } else {
            displayMessage(`No images found for "${query}". Try a different keyword. 🤷‍♀️`, 'error');
        }

    } catch (error) {
        console.error("Fetch error:", error);
        displayMessage('Failed to fetch image data. Check your network or API Client ID. ❌', 'error');
    }
}

/**
 * Clears the container and displays the image cards.
 * @param {Array<Object>} images - Array of image objects from the API.
 */
function displayResults(images) {
    resultsContainer.innerHTML = '';
    images.forEach(image => {
        const imageUrl = image.urls.small;
        const altDescription = image.alt_description || 'Untitled Photo';
        const photographerName = image.user.name || 'Unknown Photographer';
        const photographerLink = image.user.links.html;
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');
        
        imageCard.innerHTML = `
            <img src="${imageUrl}" alt="${altDescription}">
            <div class="image-info">
                <p>Description: <strong>${altDescription}</strong></p>
                <p>Photographer: <a href="${photographerLink}" target="_blank" class="photographer">${photographerName}</a></p>
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
    resultsContainer.innerHTML = '';
    const msgElement = document.createElement('p');
    msgElement.textContent = message;
    
    if (type === 'error') {
        msgElement.classList.add('error-message');
    } else {
        msgElement.classList.add('initial-message');
    }
    
    resultsContainer.appendChild(msgElement);
}

displayMessage('Enter a search term above to find beautiful photos! 📸', 'info');