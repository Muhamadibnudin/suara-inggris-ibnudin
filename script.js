const textInput = document.getElementById("textInput");

const charCount = document.getElementById("charCount");

const exampleBtn =
    document.getElementById("exampleBtn");

const copyTextBtn =
    document.getElementById("copyTextBtn");

const voiceInput =
    document.getElementById("voiceInput");

const voiceInfo =
    document.getElementById("voiceInfo");

const voicePreview =
    document.getElementById("voicePreview");

const downloadVoiceBtn =
    document.getElementById("downloadVoiceBtn");


// ================================
// CHARACTER COUNTER
// ================================

function updateCounter() {

    const length =
        textInput.value.length;

    charCount.textContent = length;
}

textInput.addEventListener(
    "input",
    updateCounter
);


// ================================
// EXAMPLE ENGLISH SCRIPT
// ================================

exampleBtn.addEventListener(
    "click",
    function () {

        textInput.value =
`Hello everyone.

Welcome to my channel.

Today I want to share an interesting story with you.

Thank you for listening, and I hope you enjoy this episode.

See you in the next video.`;

        updateCounter();

    }
);


// ================================
// COPY TEXT
// ================================

copyTextBtn.addEventListener(
    "click",
    async function () {

        const text =
            textInput.value.trim();

        if (!text) {

            alert(
                "Please enter your English script first."
            );

            return;
        }

        try {

            await navigator.clipboard.writeText(
                text
            );

            copyTextBtn.textContent =
                "✓ Copied";

            setTimeout(
                function () {

                    copyTextBtn.textContent =
                        "Copy Text";

                },
                1500
            );

        } catch (error) {

            alert(
                "Could not copy automatically. Please select and copy the text manually."
            );

        }

    }
);


// ================================
// VOICE FILE
// ================================

let selectedVoiceFile = null;

voiceInput.addEventListener(
    "change",
    function () {

        const file =
            voiceInput.files[0];

        if (!file) {

            selectedVoiceFile = null;

            return;
        }

        if (!file.type.startsWith("audio/")) {

            alert(
                "Please select an audio file."
            );

            voiceInput.value = "";

            return;
        }

        selectedVoiceFile = file;

        const sizeMB =
            (
                file.size /
                (1024 * 1024)
            ).toFixed(2);

        voiceInfo.classList.remove(
            "hidden"
        );

        voiceInfo.innerHTML = `
            <strong>Selected:</strong>
            ${escapeHtml(file.name)}
            <br>
            <strong>Size:</strong>
            ${sizeMB} MB
        `;

        const objectURL =
            URL.createObjectURL(file);

        voicePreview.src =
            objectURL;

        voicePreview.classList.remove(
            "hidden"
        );

        downloadVoiceBtn.classList.remove(
            "hidden"
        );

    }
);


// ================================
// DOWNLOAD VOICE SAMPLE
// ================================

downloadVoiceBtn.addEventListener(
    "click",
    function () {

        if (!selectedVoiceFile) {

            alert(
                "Please select your voice recording first."
            );

            return;
        }

        const url =
            URL.createObjectURL(
                selectedVoiceFile
            );

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "my-voice-reference" +
            getFileExtension(
                selectedVoiceFile.name
            );

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(
            function () {

                URL.revokeObjectURL(url);

            },
            1000
        );

    }
);


// ================================
// HELPER
// ================================

function getFileExtension(filename) {

    const index =
        filename.lastIndexOf(".");

    if (index === -1) {
        return ".wav";
    }

    return filename.substring(index);
}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================================
// INITIALIZE
// ================================

updateCounter();
