const wordTitle = document.getElementById('word-title');
const wordPhonetic = document.getElementById('word-phonetic');
// const wordDefinition = document.getElementById('word-definition').querySelector('span');
// const wordExample = document.getElementById('word-example').querySelector('span');
const definitionsList=document.getElementById('definitions-list');
const errorMessage = document.getElementById('error-message');

function getWordFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('word');
}

async function fetchWordDetails(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) throw new Error('Word not found');
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Error fetching word details:', error);
        return null;
    }
}

function findNounDetails(meanings){
    return meanings.find(meaning=>meaning.partOfSpeech==='noun')
}


function findNounDefinition(meanings) {
    const nounMeaning = meanings.find(meaning => meaning.partOfSpeech === 'noun');
    if (nounMeaning && nounMeaning.definitions.length > 0) {
        const definition = nounMeaning.definitions[0];
        return {
            definition: definition.definition || 'No definition available',
            example: definition.example || 'No example available'
        };
    }
    return { definition: 'No noun definition available', example: 'No example available' };
}


async function displayWordDetails() {
    let word = getWordFromUrl() || localStorage.getItem('selectedWord');
    if (!word) {
        errorMessage.textContent = 'No word selected.';
        errorMessage.style.display = 'block';
        return;
    }
    localStorage.setItem('selectedWord', word);

    const wordData = await fetchWordDetails(word);
    if (!wordData) {
        errorMessage.textContent = 'Failed to load word details.';
        errorMessage.style.display = 'block';
        return;
    }

    wordTitle.textContent = word;
    wordPhonetic.textContent = wordData.phonetic || 'N/A';

    const nounDetails = findNounDetails(wordData.meanings);

    definitionsList.innerHTML = '';

    if (nounDetails && nounDetails.definitions.length > 0) {
        const partOfSpeechTitle = document.createElement('h3');
        partOfSpeechTitle.textContent = nounDetails.partOfSpeech;
        partOfSpeechTitle.style.textTransform = 'capitalize'; 
        definitionsList.appendChild(partOfSpeechTitle);

        nounDetails.definitions.forEach(def => {
            const definitionDiv = document.createElement('div');
            definitionDiv.className = 'definition-entry';

            const definitionP = document.createElement('p');
            definitionP.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
            definitionDiv.appendChild(definitionP);

          
            if (def.example) {
                const exampleP = document.createElement('p');
                exampleP.innerHTML = `<strong>Example:</strong> <em>${def.example}</em>`;
                definitionDiv.appendChild(exampleP);
            }
            
            definitionDiv.appendChild(document.createElement('hr'));

            definitionsList.appendChild(definitionDiv);
        });

    } else {
        definitionsList.textContent = 'No noun definitions found for this word.';
    }
}
displayWordDetails();