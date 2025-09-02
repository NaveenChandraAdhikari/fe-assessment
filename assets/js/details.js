const wordTitle = document.getElementById('word-title');
const wordPhonetic = document.getElementById('word-phonetic');
const definitionsList = document.getElementById('definitions-list');
const errorMessage = document.getElementById('error-message');
const loader = document.getElementById('loading');

function getWordFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('word') || localStorage.getItem('selectedWord');
}

async function fetchWordDetails(word) {
  try {
    const response = await fetch(`http://localhost:3000/word/${encodeURIComponent(word)}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Word not found');
    const data = await response.json();
    return data;``
  } catch (error) {
    console.error('Error fetching word details:', error);
    return null;
  }
}

async function displayWordDetails() {
  loader.style.display = 'flex';
  errorMessage.style.display = 'none';

  try {
    const word = getWordFromUrl();
    if (!word) throw new Error('No word selected, please go back and select a word.');

    localStorage.setItem('selectedWord', word);
    const wordData = await fetchWordDetails(word);
    if (!wordData) throw new Error('Word data not found');

   
    wordTitle.textContent = '';
    wordPhonetic.textContent = '';
    definitionsList.innerHTML = '';

    wordTitle.textContent = wordData.word;
    wordPhonetic.textContent = wordData.phonetic || 'N/A';

  
    if (wordData.meanings && wordData.meanings.length > 0) {
      const meaningsTitle = document.createElement('h3');
      meaningsTitle.textContent = 'Meanings';
      definitionsList.appendChild(meaningsTitle);

      const ul = document.createElement('ul');
      wordData.meanings.forEach(meaning => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Meaning:</strong> ${meaning}`;
        ul.appendChild(li);
      });
      definitionsList.appendChild(ul);
    } else {
      definitionsList.innerHTML = '<p>No meanings found for this word.</p>';
    }
  } catch (error) {
    console.error('Error displaying word details:', error);
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  } finally {
    loader.style.display = 'none';
  }
}

displayWordDetails();
