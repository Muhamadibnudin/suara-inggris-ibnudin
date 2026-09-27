// =====================================================
// MY VOICE CLONER
// GitHub Pages -> Gradio -> Google Colab -> XTTS-v2
// =====================================================


// =====================================================
// 1. GOOGLE COLAB GRADIO URL
// =====================================================
//
// GANTI URL DI BAWAH DENGAN URL .gradio.live DARI COLAB
//
// Contoh:
// const COLAB_URL = "https://abc123xyz.gradio.live";
//
// JANGAN tambahkan /gradio_api
// JANGAN tambahkan /generate_voice
//

const COLAB_URL =
    "PASTE_URL_GRADIO_COLAB_DI_SINI";


// =====================================================
// 2. ELEMENT HELPER
// =====================================================

function getElement(id) {
    return document.getElementById(id);
}


// =====================================================
// 3. INITIALIZE WEBSITE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "===================================="
        );

        console.log(
            "MY VOICE CLONER"
        );

        console.log(
            "JavaScript loaded successfully"
        );

        console.log(
            "===================================="
        );


        // -------------------------------------------------
        // ELEMENTS
        // -------------------------------------------------

        const textInput =
            getElement("textInput");

        const charCount =
            getElement("charCount");

        const exampleBtn =
            getElement("exampleBtn");

        const copyTextBtn =
            getElement("copyTextBtn");

        const voiceInput =
            getElement("voiceInput");

        const voiceInfo =
            getElement("voiceInfo");

        const voicePreview =
            getElement("voicePreview");

        const downloadVoiceBtn =
            getElement("downloadVoiceBtn");

        const generateBtn =
            getElement("generateBtn");

        const loadingBox =
            getElement("loadingBox");

        const errorBox =
            getElement("errorBox");

        const outputAudio =
            getElement("outputAudio");

        const resultBox =
            getElement("resultBox");

        const downloadResultBtn =
            getElement("downloadResultBtn");


        // -------------------------------------------------
        // CHECK IMPORTANT GENERATE ELEMENTS
        // -------------------------------------------------

        if (!generateBtn) {

            console.error(
                "ERROR: #generateBtn tidak ditemukan."
            );

            return;
        }

        if (!loadingBox) {

            console.error(
                "ERROR: #loadingBox tidak ditemukan."
            );

            return;
        }

        if (!errorBox) {

            console.error(
                "ERROR: #errorBox tidak ditemukan."
            );

            return;
        }

        if (!outputAudio) {

            console.error(
                "ERROR: #outputAudio tidak ditemukan."
            );

            return;
        }

        if (!resultBox) {

            console.error(
                "ERROR: #resultBox tidak ditemukan."
            );

            return;
        }

        if (!downloadResultBtn) {

            console.error(
                "ERROR: #downloadResultBtn tidak ditemukan."
            );

            return;
        }


        // =================================================
        // 4. VARIABLES
        // =================================================

        let selectedVoiceFile = null;


        // =================================================
        // 5. CHARACTER COUNTER
        // =================================================

        function updateCounter() {

            if (!textInput || !charCount) {
                return;
            }

            const length =
                textInput.value.length;

            charCount.textContent =
                length;
        }


        if (textInput) {

            textInput.addEventListener(
                "input",
                updateCounter
            );

        }


        // =================================================
        // 6. EXAMPLE BUTTON
        // =================================================

        if (exampleBtn && textInput) {

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

        }


        // =================================================
        // 7. COPY TEXT
        // =================================================

        if (copyTextBtn && textInput) {

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

                        console.error(
                            "Copy error:",
                            error
                        );

                        alert(
                            "Could not copy automatically."
                        );
                    }

                }
            );

        }


        // =================================================
        // 8. VOICE INPUT
        // =================================================

        if (voiceInput) {

            voiceInput.addEventListener(
                "change",
                function () {

                    const file =
                        voiceInput.files &&
                        voiceInput.files[0];

                    if (!file) {

                        selectedVoiceFile =
                            null;

                        return;
                    }


                    // -------------------------------------
                    // CHECK AUDIO
                    // -------------------------------------

                    if (
                        !file.type ||
                        !file.type.startsWith("audio/")
                    ) {

                        alert(
                            "Please select an audio file."
                        );

                        voiceInput.value = "";

                        selectedVoiceFile =
                            null;

                        return;
                    }


                    // -------------------------------------
                    // SAVE FILE
                    // -------------------------------------

                    selectedVoiceFile =
                        file;


                    // -------------------------------------
                    // SHOW FILE INFORMATION
                    // -------------------------------------

                    const sizeMB =
                        (
                            file.size /
                            (1024 * 1024)
                        ).toFixed(2);


                    if (voiceInfo) {

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

                    }


                    // -------------------------------------
                    // AUDIO PREVIEW
                    // -------------------------------------

                    if (voicePreview) {

                        const objectURL =
                            URL.createObjectURL(
                                file
                            );

                        voicePreview.src =
                            objectURL;

                        voicePreview.classList.remove(
                            "hidden"
                        );

                    }


                    // -------------------------------------
                    // DOWNLOAD ORIGINAL
                    // -------------------------------------

                    if (downloadVoiceBtn) {

                        downloadVoiceBtn.classList.remove(
                            "hidden"
                        );

                    }


                    console.log(
                        "Voice selected:",
                        file.name
                    );

                }
            );

        }


        // =================================================
        // 9. DOWNLOAD ORIGINAL VOICE
        // =================================================

        if (downloadVoiceBtn) {

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
                        document.createElement(
                            "a"
                        );


                    link.href =
                        url;

                    link.download =
                        "my-voice-reference" +
                        getFileExtension(
                            selectedVoiceFile.name
                        );


                    document.body.appendChild(
                        link
                    );

                    link.click();

                    link.remove();


                    setTimeout(
                        function () {

                            URL.revokeObjectURL(
                                url
                            );

                        },
                        1000
                    );

                }
            );

        }


        // =================================================
        // 10. GENERATE VOICE
        // =================================================

        generateBtn.addEventListener(
            "click",
            async function () {

                console.log(
                    "Generate button clicked"
                );


                // -----------------------------------------
                // CHECK COLAB URL
                // -----------------------------------------

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


                // -----------------------------------------
                // CHECK TEXT
                // -----------------------------------------

                const text =
                    textInput
                        ? textInput.value.trim()
                        : "";


                if (!text) {

                    showError(
                        "Please enter your English script."
                    );

                    return;
                }


                // -----------------------------------------
                // CHECK VOICE
                // -----------------------------------------

                if (!selectedVoiceFile) {

                    showError(
                        "Please upload your voice sample first."
                    );

                    return;
                }


                // -----------------------------------------
                // START LOADING
                // -----------------------------------------

                setLoading(
                    true
                );


                try {

                    // =====================================
                    // LOAD GRADIO CLIENT
                    // =====================================

                    console.log(
                        "Loading Gradio Client..."
                    );


                    const gradioModule =
                        await import(
                            "https://cdn.jsdelivr.net/npm/@gradio/client@2.2.0/dist/index.js"
                        );


                    const Client =
                        gradioModule.Client;

                    const handle_file =
                        gradioModule.handle_file;


                    if (!Client) {

                        throw new Error(
                            "Gradio Client tidak berhasil dimuat."
                        );

                    }


                    if (!handle_file) {

                        throw new Error(
                            "handle_file dari Gradio Client tidak ditemukan."
                        );

                    }


                    // =====================================
                    // CONNECT
                    // =====================================

                    console.log(
                        "Connecting to Colab:"
                    );

                    console.log(
                        COLAB_URL
                    );


                    const client =
                        await Client.connect(
                            COLAB_URL
                        );


                    console.log(
                        "✅ Connected to Colab"
                    );


                    // =====================================
                    // PREPARE VOICE FILE
                    // =====================================

                    console.log(
                        "Uploading voice reference..."
                    );


                    const voiceFile =
                        handle_file(
                            selectedVoiceFile
                        );


                    // =====================================
                    // SEND REQUEST
                    // =====================================

                    console.log(
                        "Sending request to XTTS-v2..."
                    );


                    const result =
                        await client.predict(
                            "/generate_voice",
                            {
                                reference_audio:
                                    voiceFile,

                                text:
                                    text,

                                language:
                                    "en"
                            }
                        );


                    // =====================================
                    // SHOW RAW RESULT
                    // =====================================

                    console.log(
                        "Colab result:",
                        result
                    );


                    // =====================================
                    // CHECK RESULT
                    // =====================================

                    if (
                        !result ||
                        !result.data ||
                        !result.data.length
                    ) {

                        throw new Error(
                            "Colab tidak mengembalikan hasil audio."
                        );

                    }


                    const output =
                        result.data[0];


                    console.log(
                        "Audio output:",
                        output
                    );


                    if (!output) {

                        throw new Error(
                            "Audio output kosong."
                        );

                    }


                    // =====================================
                    // FIND AUDIO URL
                    // =====================================

                    let audioURL =
                        null;


                    if (
                        typeof output ===
                        "string"
                    ) {

                        audioURL =
                            output;

                    }


                    else if (
                        output.url
                    ) {

                        audioURL =
                            output.url;

                    }


                    else if (
                        output.path
                    ) {

                        audioURL =
                            output.path;

                    }


                    else if (
                        output.file
                    ) {

                        audioURL =
                            output.file;

                    }


                    // =====================================
                    // CHECK AUDIO URL
                    // =====================================

                    if (!audioURL) {

                        console.error(
                            "Unknown output format:",
                            output
                        );

                        throw new Error(
                            "Format audio dari Colab tidak dikenali."
                        );

                    }


                    console.log(
                        "Audio URL:",
                        audioURL
                    );


                    // =====================================
                    // DISPLAY AUDIO
                    // =====================================

                    outputAudio.src =
                        audioURL;

                    outputAudio.controls =
                        true;

                    outputAudio.classList.remove(
                        "hidden"
                    );


                    // =====================================
                    // DOWNLOAD BUTTON
                    // =====================================

                    downloadResultBtn.href =
                        audioURL;

                    downloadResultBtn.download =
                        "cloned_voice.wav";

                    downloadResultBtn.classList.remove(
                        "hidden"
                    );


                    // =====================================
                    // SUCCESS MESSAGE
                    // =====================================

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


                    console.log(
                        "===================================="
                    );

                    console.log(
                        "✅ GENERATION SUCCESS"
                    );

                    console.log(
                        "===================================="
                    );


                }

                catch (error) {

                    console.error(
                        "===================================="
                    );

                    console.error(
                        "❌ GENERATION ERROR"
                    );

                    console.error(
                        error
                    );

                    console.error(
                        "===================================="
                    );


                    let message =
                        "Generation failed.";


                    if (
                        error &&
                        error.message
                    ) {

                        message +=
                            " " +
                            error.message;

                    }


                    showError(
                        message
                    );

                }


                finally {

                    setLoading(
                        false
                    );

                }

            }
        );


        // =================================================
        // 11. LOADING FUNCTION
        // =================================================

        function setLoading(
            loading
        ) {

            if (loading) {

                generateBtn.disabled =
                    true;

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

            }

            else {

                generateBtn.disabled =
                    false;

                generateBtn.textContent =
                    "🚀 Generate Voice";


                loadingBox.classList.add(
                    "hidden"
                );

            }

        }


        // =================================================
        // 12. ERROR FUNCTION
        // =================================================

        function showError(
            message
        ) {

            console.error(
                message
            );


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


        // =================================================
        // 13. FILE EXTENSION
        // =================================================

        function getFileExtension(
            filename
        ) {

            const index =
                filename.lastIndexOf(
                    "."
                );


            if (
                index === -1
            ) {

                return ".wav";

            }


            return filename.substring(
                index
            );

        }


        // =================================================
        // 14. ESCAPE HTML
        // =================================================

        function escapeHtml(
            text
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                text;


            return div.innerHTML;

        }


        // =================================================
        // 15. INITIALIZE
        // =================================================

        updateCounter();


        console.log(
            "Website initialization complete."
        );


    }
);
