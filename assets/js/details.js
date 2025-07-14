const wordTitle = document.getElementById("word-title");
const wordPhonetic = document.getElementById("word-phonetic");
const definitionsList = document.getElementById("definitions-list");
const errorMessage = document.getElementById("error-message");
const loader = document.getElementById("loading");

function getWordFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("word");
}

async function fetchWordDetails(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    );
    if (!response.ok) throw new Error("Word not found");
    const data = await response.json();
    // console.log(data[0]);
    return data[0];
  } catch (error) {
    console.error("Error fetching word details:", error);
    return null;
  }
}

function findNounDetails(meanings) {
  return meanings.find((meaning) => meaning.partOfSpeech === "noun");
}

async function displayWordDetails() {
  //beginning loader
  loader.style.display = "flex";
  errorMessage.style.display = "none";

  try {
    let word = getWordFromUrl() || localStorage.getItem("selectedWord");

    if (!word) {
      throw new Error("No word selected,please go back and select a word.");
    }

    localStorage.setItem("selectedWord", word);
    const wordData = await fetchWordDetails(word);

    wordTitle.textContent = wordData.word;
    wordPhonetic.textContent = wordData.phonetic || "N/A";

    const nounDetails = findNounDetails(wordData.meanings);
    definitionsList.innerHTML = ""; //clear the list

    if (nounDetails && nounDetails.definitions.length > 0) {
      const partOfSpeechTitle = document.createElement("h3");
      partOfSpeechTitle.textContent = nounDetails.partOfSpeech;
      partOfSpeechTitle.style.textTransform = "capitalize";
      definitionsList.appendChild(partOfSpeechTitle);

      nounDetails.definitions.forEach((def) => {
        const definitionDiv = document.createElement("div");
        definitionDiv.className = "definition-entry";
        definitionDiv.style.padding = "15px";

        const definitionP = document.createElement("p");
        definitionP.innerHTML = `<strong>Definition:</strong> ${def.definition}`;
        definitionDiv.appendChild(definitionP);

        if (def.example) {
          const exampleP = document.createElement("p");
          exampleP.innerHTML = `<strong>Example:</strong> <em>${def.example}</em>`;
          definitionDiv.appendChild(exampleP);
        }

        definitionDiv.appendChild(document.createElement("hr"));
        definitionsList.appendChild(definitionDiv);
      });
    } else {
      definitionsList.textContent = "No noun definitions found for this word.";
    }
  } catch (error) {
    console.error("Error displaying word details:", error);
    errorMessage.textContent = error.message;
    errorMessage.style.display = "block";
  } finally {
    loader.style.display = "none";
  }
}
displayWordDetails();
