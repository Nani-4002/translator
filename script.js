const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const soundBtn = document.getElementById('sound-btn');
const inputDisplay = document.getElementById('input-text');
const translatedDisplay = document.getElementById('translated-text');

let isSoundEnabled = true;

document.getElementById('input-lang').addEventListener('change', (e) => {
  const langMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN'
  };
  recognition.lang = langMap[e.target.value] || 'en-US';
});

startBtn.addEventListener('click', () => {
  inputDisplay.innerText = 'Listening...';
  recognition.start();
});

resetBtn.addEventListener('click', () => {
  inputDisplay.innerText = 'Welcome';
  translatedDisplay.innerText = '';
});

soundBtn.addEventListener('click', () => {
  isSoundEnabled = !isSoundEnabled;
  soundBtn.textContent = `Output Sound: ${isSoundEnabled ? 'ON' : 'OFF'}`;
});

recognition.onresult = async (event) => {
  const spokenText = event.results[0][0].transcript;
  inputDisplay.innerText = spokenText;

  const outputLang = document.getElementById('output-lang').value;

  const translatedText = await translateText(spokenText, outputLang);
  translatedDisplay.innerText = translatedText;

  if (isSoundEnabled) {
    speakText(translatedText, outputLang);
  }
};

async function translateText(text, targetLang) {
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
  const data = await response.json();
  return data[0][0][0];
}

function speakText(text, lang) {
  const audio = new Audio();
  audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
  audio.play();
}
