// =====================================================
// GOOGLE COLAB BACKEND
// =====================================================

// SETELAH COLAB BERHASIL DIJALANKAN,
// MASUKKAN URL .GRADIO.LIVE DI SINI.
//
// Contoh:
// const COLAB_URL = "https://abc123.gradio.live";

const COLAB_URL =
    "PASTE_URL_GRADIO_COLAB_DI_SINI";


// =====================================================
// ELEMENTS
// =====================================================

const textInput =
    document.getElementById("textInput");

const charCount =
    document.getElementById("charCount");

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

const generateBtn =
    document.getElementById("generateBtn");

const loadingBox =
    document.getElementById("loadingBox");

const errorBox =
    document.getElementById("errorBox");

const outputAudio =
    document.getElementById("outputAudio");

const resultBox =
    document.getElementById("resultBox");

const downloadResultBtn =
    document.getElementById(
        "downloadResultBtn"
    );


// =====================================================
// VOICE FILE
// =====================================================

let selectedVoiceFile = null;


// =====================================================
// CHARACTER COUNTER
// =====================================================

function updateCounter() {

    const length =
        textInput.value.length;

    charCount.textContent =
        length;
}

textInput.addEventListener(
    "input",
    updateCounter
);


// =====================================================
// EXAMPLE
// =====================================================

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


// =====================================================
// COPY
// =====================================================

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
                "Could not copy automatically."
            );
        }
    }
);


// =====================================================
// VOICE INPUT
// =====================================================

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


// =====================================================
// DOWNLOAD ORIGINAL VOICE
// =====================================================

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


// =====================================================
// GENERATE VOICE
// =====================================================

generateBtn.addEventListener(
    "click",
    async function () {

        // -------------------------------
        // CHECK COLAB URL
        // -------------------------------

        if (
            !COLAB_URL ||
            COLAB_URL.includes(
                "PASTE_URL"
            )
        ) {

            showError(
                "Google Colab belum terhubung. Masukkan URL .gradio.live dari Colab ke script.js."
            );

            return;
        }


        // -------------------------------
        // CHECK TEXT
        // -------------------------------

        const text =
            textInput.value.trim();

        if (!text) {

            showError(
                "Please enter your English script."
            );

            return;
        }


        // -------------------------------
        // CHECK VOICE
        // -------------------------------

        if (!selectedVoiceFile) {

            showError(
                "Please upload your voice sample first."
            );

            return;
        }


        // -------------------------------
        // UI LOADING
        // -------------------------------

        generateBtn.disabled = true;

        generateBtn.textContent =
            "⏳ Generating...";

        loadingBox.classList.remove(
            "hidden"
        );

        errorBox.classList.add(
            "hidden"
        );

        outputAudio.classList.add(
            "hidden"
        );

        downloadResultBtn.classList.add(
            "hidden"
        );


        try {

            // =================================================
            // LOAD GRADIO CLIENT
            // =================================================

            const {
                Client,
                handle_file
            } = await import(
                "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.js"
            );


            // =================================================
            // CONNECT TO COLAB
            // =================================================

            console.log(
                "Connecting to:",
                COLAB_URL
            );

            const client =
                await Client.connect(
                    COLAB_URL
                );


            console.log(
                "Connected to Colab"
            );


            // =================================================
            // SEND TO XTTS
            // =================================================

            const result =
                await client.predict(
                    "/generate_voice",
                    {
                        reference_audio:
                            handle_file(
                                selectedVoiceFile
                            ),

                        text:
                            text,

                        language:
                            "en"
                    }
                );


            console.log(
                "Colab result:",
                result
            );


            // =================================================
            // GET RESULT
            // =================================================

            const output =
                result.data[0];


            if (!output) {

                throw new Error(
                    "Colab tidak mengembalikan audio."
                );
            }


            // =================================================
            // RESULT URL
            // =================================================

            let audioURL;


            if (
                typeof output ===
                "string"
            ) {

                audioURL =
                    output;

            } else if (
                output.url
            ) {

                audioURL =
                    output.url;

            } else if (
                output.path
            ) {

                audioURL =
                    output.path;

            } else {

                throw new Error(
                    "Format audio dari Colab tidak dikenali."
                );
            }


            // =================================================
            // DISPLAY RESULT
            // =================================================

            outputAudio.src =
                audioURL;

            outputAudio.classList.remove(
                "hidden"
            );

            downloadResultBtn.href =
                audioURL;

            downloadResultBtn.classList.remove(
                "hidden"
            );

            resultBox.innerHTML = `
                <div class="result-icon">
                    ✅
                </div>

                <p>
                    Voice generation completed!
                </p>

                <p class="small-text">
                    Your cloned voice is ready.
                </p>
            `;


        } catch (error) {

            console.error(
                "Generation error:",
                error
            );

            showError(
                "Generation failed: " +
                (
                    error.message ||
                    "Unknown error"
                )
            );

        } finally {

            generateBtn.disabled =
                false;

            generateBtn.textContent =
                "🚀 Generate Voice";

            loadingBox.classList.add(
                "hidden"
            );
        }
    }
);


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.classList.remove(
        "hidden"
    );

    loadingBox.classList.add(
        "hidden"
    );

    generateBtn.disabled =
        false;

    generateBtn.textContent =
        "🚀 Generate Voice";
}


// =====================================================
// HELPERS
// =====================================================

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

    div.textContent =
        text;

    return div.innerHTML;
}


// =====================================================
// INITIALIZE
// =====================================================

updateCounter();
