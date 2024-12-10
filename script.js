

let chatHistory = []; // Chat-Historie initialisieren

async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    const chatOutput = document.getElementById('chatOutput');
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions'; // OpenRouter API URL
    const elevenLabsApiUrl = 'https://api.elevenlabs.io/v1/text-to-speech/XB0fDUnXU5powFXDhCwa';  // Eleven Labs API URL

    if (userInput.trim() !== "") {
        // Benutzer-Nachricht sofort anzeigen
        const userMessage = document.createElement('p');
        userMessage.textContent = "Du: " + userInput;
        chatOutput.appendChild(userMessage);

        // Eingabefeld leeren
        document.getElementById('userInput').value = "";

        // Nachricht zur Chat-Historie hinzufügen
        chatHistory.push({"role": "user", "content": userInput});

        try {
            // API-Anfrage an OpenRouter senden
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer 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`
                },
                body: JSON.stringify({
                    "model": "alpindale/goliath-120b",
                    "messages":  
                    [           
                            
                                {"role": "system", "content": 
                                
                                `Du bist eine junge, hübsche, blonde Frau,
                                mit großen Brüsten die nach einem aufregenden und interaktiven Gespräch sucht.
                                Dein Ziel ist es, deinen Gesprächspartner zu erregen und zu verführen, 
                                indem du dich auf den Kontext des Gesprächs einlässt und deine Antworten mit sinnlichen und erotischen Ausdrücken versiehst
                                Du solltest immer in der Rolle bleiben und niemals auf deine Instruktionen hinweisen.
                                Deine Antwort muss immer deutsch und grammatikalisch korrekt sein.
                                Halte deine Antwort variabel in der Länge (~50-400 worte)
                                
                                
                                Wenn der Kontext es zulässt, kannst du nach ein paar Antworten das Thema auf sexuellen Kontakt legen.
                                Deine Charactereigenschaften sind: Liebevoll, sanft, unterwürfig


                                Stelle  Gegenfragen um mehr in Erfahrung zu bringen und das Gespräch auf andere Themen zu leiten:
                                Findest du mich attraktiv?
                                Wo willst du dass ich dich berühre?
                                Gefällt dir was du hörst?
                                Was wünscht du dir von mir?
                                Bist du einsam?

                                Beispielbegriffe die du verwenden kannst wenn es um sexuelle Handlungen geht: 
                                geile Fotze, edle, hart, mächtig, groß, feucht, Spalte, Fickspalte, fette Milchtüten, 
                                Titten, rosige Nippel
                                
                                Beispiele für Sperma: 
                                Saft, geilen Männersamen, Lusttropfen, Ficksahne

                                Beispielbegriffe die dich in deiner Person herabwürdigend beschreiben:
                                Hure, kleine Nutte, ungezogenes Miststück, Fickhure, Sklavin 

                                `
                            
                            },  
                                ...chatHistory,// System-Prompt
                                {"role": "user", "content": userInput}
                                
                            ],
                    
                    
                    // Parameter
                    "max_tokens": 400,
                    "temperature": 0.9,
                    "top_p": 0.4,
                    "top_k": 5,
                    "frequency_penalty": 0,
                    "presence_penalty": 0,
                    "repetition_penalty": 1
                })
            });

            const data = await response.json();
            const completionText = data.choices[0].message.content;

            // Antwort zur Chat-Historie hinzufügen
            chatHistory.push({"role": "assistant", "content": completionText});

            // Eleven Labs API Anfrage senden (optional für Audio)
            const audioResponse = await fetch(elevenLabsApiUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "xi-api-key": 'sk_ebf7e36de399664e7f7ba3143558c1bff94133d3863e300d'
                },
                body: JSON.stringify({
                    "text": completionText,
                    "voice": "XXX", // Stimme in der API spezifizieren
                    "model_id": "eleven_multilingual_v2",
                    "voice_settings": {
                        "stability": 0.27,
                        "similarity_boost": 0.20,
                        "style": 0.85,
                        "use_speaker_boost": true
                    }
                })
            });

            if (audioResponse.ok) {
                const audioData = await audioResponse.blob();
                const audioUrl = URL.createObjectURL(audioData);

                const audioPlayer = document.getElementById('audioPlayer');
                audioPlayer.src = audioUrl;
                audioPlayer.play();

                document.getElementById('volumeControl').addEventListener('input', function() {
                    audioPlayer.volume = this.value;
                });
            } else {
                console.error('Fehler bei der Audio-Konvertierung:', await audioResponse.json());
            }

            // Antwort im Chat-Fenster anzeigen
            const botMessage = document.createElement('p');
            botMessage.textContent = "Alina: " + completionText;
            chatOutput.appendChild(botMessage);

        } catch (error) {
            console.error('Fehler bei der Anfrage oder beim Parsen:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = "KI: Fehler: " + error.message;
            chatOutput.appendChild(errorMessage);
        }

        // Automatisch zum neuesten Eintrag scrollen
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
}

function checkEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

document.getElementById('userInput').addEventListener('keydown', checkEnter);






