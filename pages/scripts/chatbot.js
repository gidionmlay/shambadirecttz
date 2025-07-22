 // Swahili FAQ Responses - Replaced all English responses with your provided Swahili versions.
        // These are designed to be warm and conversational, as requested.
        const faqResponses = {
            "agiza": "Unaweza kuagiza vifaa (inputs) kwa urahisi kupitia tovuti yetu au app ya simu. Nenda kwenye ‘Bidhaa’, chagua unachohitaji, kisha fuata maelekezo ya kuweka agizo.",
            "mkopo": "Kwa mfumo wetu wa mkopo, wakulima wanaostahili wanaweza kupata vifaa sasa, halafu walipa baada ya mavuno – bila shida!",
            "wasilisha": "Tunawasilisha vifaa kwa siku 3-5 za kazi kwa maeneo mengi Tanzania. Upate kilichohitajika karibu nawe!",
            "mawasiliano": "Tupigie kupitia WhatsApp (+254 700 123 456) au tutumie barua pepe (huduma@shambadirect.com). Tuko tayari kukusaidia!",
            "rasilimali": "Kwenye sehemu ya ‘Rasilimali’, utapata mafunzo, miongozo ya kilimo, na vitabu muhimu – zote kwa matumizi yako!"
        };

        // Common Swahili question variations for better NLP - Added more keywords for robust matching.
        const keywordMappings = {
            // Ordering
            "agiza": ["agiza", "nunua", "pata", "order", "kuagiza", "agizo", "namna ya kuagiza", "bidhaa", "vifaa"],
            // Credit System
            "mkopo": ["mkopo", "kulipa", "malipo", "deni", "salio", "credit", "mikopo"],
            // Delivery
            "wasilisha": ["wasilisha", "lete", "delivery", "fika", "mizigo", "usafirishaji"],
            // Contact
            "mawasiliano": ["mawasiliano", "piga", "ongea", "contact", "namba", "email", "whatsapp"],
            // Resources
            "rasilimali": ["rasilimali", "mafunzo", "miongozo", "vitabu", "jifunze", "elimu", "resources"]
        };

        // Small talk responses - Added common Swahili greetings and thanks.
        const smallTalkResponses = {
            "jambo": "Jambo! Nipo hapa kukusaidia. Una swali lolote kuhusu Shamba Bot?",
            "habari": "Nzuri sana! Nawe je? Niko tayari kukuhudumia. Unawezaje nisaidia?",
            "asante": "Karibu sana! Ni furaha yangu kukuhudumia.",
            "shukrani": "Raha tele! Niko hapa wakati wowote unaponihitaji.",
            "mambo": "Poa! Niko tayari kukusaidia. Una swali gani leo?",
            "salamu": "Salama kabisa! Niko Shamba Bot, nimefurahi kukuona."
        };

        const chatbotToggle = document.querySelector(".chatbot-toggle");
        const chatbotWindow = document.querySelector(".chatbot-window");
        const closeChat = document.querySelector(".close-chat");
        const chatForm = document.getElementById("chatForm");
        const chatInput = document.getElementById("chatInput");
        const chatMessages = document.getElementById("chatMessages");

        // Initial greeting on chatbot window open - Made more welcoming in Swahili.
        chatbotToggle.addEventListener("click", () => {
            chatbotWindow.classList.toggle("active");
            if (chatbotWindow.classList.contains("active")) {
                // Clear messages and add initial greeting each time it's opened
                chatMessages.innerHTML = ''; // Clear previous messages
                appendMessage("bot", "Habari rafiki mkulima! Mimi ni Shamba Bot, niko hapa kukusaidia na maswali yako kuhusu jukwaa letu. Unawezaje nikusaidie leo?");
            }
        });

        closeChat.addEventListener("click", () => {
            chatbotWindow.classList.remove("active");
        });

        chatForm.addEventListener("submit", e => {
            e.preventDefault();
            const userMsg = chatInput.value.trim();
            if (!userMsg) return;

            appendMessage("user", userMsg);
            respondTo(userMsg.toLowerCase()); // Convert to lowercase for matching
            chatInput.value = "";
        });

        function appendMessage(sender, message) {
            const div = document.createElement("div");
            div.className = sender + "-msg";
            div.innerText = message;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Optimized response logic for Swahili keywords and NLP improvements.
        function respondTo(msg) {
            let response = "Samahani, bado sijakuelewa vizuri. Tafadhali jaribu kuniuliza kuhusu kuagiza, mikopo, uwasilishaji, au mawasiliano. Karibu sana!"; // Polite Swahili error message

            // Check for small talk first
            for (const greeting in smallTalkResponses) {
                if (msg.includes(greeting)) {
                    response = smallTalkResponses[greeting];
                    setTimeout(() => appendMessage("bot", response), 600);
                    return; // Stop processing if small talk is matched
                }
            }

            // Check for FAQ responses using keyword mappings
            for (const key in keywordMappings) {
                const keywords = keywordMappings[key];
                for (let i = 0; i < keywords.length; i++) {
                    // Simple NLP: Check if the message includes any of the keywords
                    // You could enhance this with more sophisticated techniques if needed (e.g., Levenshtein distance for typos)
                    if (msg.includes(keywords[i])) {
                        response = faqResponses[key];
                        setTimeout(() => appendMessage("bot", response), 600);
                        return; // Stop processing once a match is found
                    }
                }
            }

            // If no specific match, send the default error message
            setTimeout(() => appendMessage("bot", response), 600);
        }