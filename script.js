// =====================================================
// MY VOICE CLONER
// GitHub Pages -> Gradio -> Google Colab -> XTTS-v2
// =====================================================


// =====================================================
// COLAB URL
// =====================================================

const COLAB_URL =
    "https://3a921a77aba1b849b6.gradio.live";


// =====================================================
// GRADIO CLIENT VERSION
// =====================================================

const GRADIO_CLIENT_URL =
    "https://cdn.jsdelivr.net/npm/@gradio/client@2.7.0/dist/index.min.js";


// =====================================================
// START AFTER HTML LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "============================================"
        );

        console.log(
            "MY VOICE CLONER JAVASCRIPT STARTED"
        );

        console.log(
            "Colab URL:",
            COLAB_URL
        );

        console.log(
            "============================================"
        );


        // =================================================
        // ELEMENTS
        // =================================================

        const textInput =
            document.getElementById(
                "textInput"
            );

        const charCount =
            document.getElementById(
                "charCount"
            );

        const exampleBtn =
            document.getElementById(
                "exampleBtn"
            );

        const copyTextBtn =
            document.getElementById(
                "copyTextBtn"
            );

        const voiceInput =
            document.getElementById(
                "voiceInput"
            );

        const voiceInfo =
            document.getElementById(
                "voiceInfo"
            );

        const voicePreview =
            document.getElementById(
                "voicePreview"
            );

        const downloadVoiceBtn =
            document.getElementById(
                "downloadVoiceBtn"
            );

        const generateBtn =
            document.getElementById(
                "generateBtn"
            );

        const loadingBox =
            document.getElementById(
                "loadingBox"
            );

        const errorBox =
            document.getElementById(
                "errorBox"
            );

        const outputAudio =
            document.getElementById(
                "outputAudio"
            );

        const resultBox =
            document.getElementById(
                "resultBox"
            );

        const downloadResultBtn =
            document.getElementById(
                "downloadResultBtn"
            );


        // =================================================
        // CHECK HTML ELEMENTS
        // =================================================

        if (!textInput) {

            console.error(
                "❌ textInput tidak ditemukan."
            );

        }

        if (!voiceInput) {

            console.error(
                "❌ voiceInput tidak ditemukan."
            );

        }

        if (!generateBtn) {

            console.error(
                "❌ generateBtn tidak ditemukan."
            );

            return;

        }


        // =================================================
        // SELECTED VOICE FILE
        // =================================================

        let selectedVoiceFile =
            null;


        // =================================================
        // CHARACTER COUNTER
        // =================================================

        function updateCounter() {

            if (!textInput) {

                return;

            }


            const length =
                textInput.value.length;


            if (charCount) {

                charCount.textContent =
                    length;

            }

        }


        if (textInput) {

            textInput.addEventListener(
                "input",
                updateCounter
            );

        }


        // =================================================
        // EXAMPLE BUTTON
        // =================================================

        if (exampleBtn) {

            exampleBtn.addEventListener(
                "click",
                function () {

                    if (!textInput) {

                        return;

                    }


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
        // COPY TEXT
        // =================================================

        if (copyTextBtn) {

            copyTextBtn.addEventListener(
                "click",
                async function () {

                    if (!textInput) {

                        return;

                    }


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
        // VOICE UPLOAD
        // =================================================

        if (voiceInput) {

            voiceInput.addEventListener(
                "change",
                function () {

                    const file =
                        voiceInput.files[0];


                    if (!file) {

                        selectedVoiceFile =
                            null;

                        return;

                    }


                    // -------------------------------------
                    // CHECK AUDIO FILE
                    // -------------------------------------

                    if (
                        !file.type ||
                        !file.type.startsWith(
                            "audio/"
                        )
                    ) {

                        alert(
                            "Please select an audio file."
                        );


                        voiceInput.value =
                            "";


                        selectedVoiceFile =
                            null;


                        return;

                    }


                    // -------------------------------------
                    // SAVE FILE
                    // -------------------------------------

                    selectedVoiceFile =
                        file;


                    const sizeMB =
                        (
                            file.size /
                            (
                                1024 *
                                1024
                            )
                        ).toFixed(2);


                    console.log(
                        "Voice selected:",
                        file.name
                    );

                    console.log(
                        "Voice type:",
                        file.type
                    );

                    console.log(
                        "Voice size:",
                        file.size
                    );


                    // -------------------------------------
                    // DISPLAY INFORMATION
                    // -------------------------------------

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
                            <br>
                            <strong>Type:</strong>
                            ${escapeHtml(file.type || "unknown")}
                        `;

                    }


                    // -------------------------------------
                    // AUDIO PREVIEW
                    // -------------------------------------

                    if (voicePreview) {

                        try {

                            const objectURL =
                                URL.createObjectURL(
                                    file
                                );


                            voicePreview.src =
                                objectURL;


                            voicePreview.classList.remove(
                                "hidden"
                            );


                        } catch (error) {

                            console.error(
                                "Preview error:",
                                error
                            );

                        }

                    }


                    // -------------------------------------
                    // DOWNLOAD ORIGINAL
                    // -------------------------------------

                    if (downloadVoiceBtn) {

                        downloadVoiceBtn.classList.remove(
                            "hidden"
                        );

                    }

                }
            );

        }


        // =================================================
        // DOWNLOAD ORIGINAL VOICE
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
        // GENERATE VOICE
        // =================================================

        generateBtn.addEventListener(
            "click",
            async function () {


                console.log(
                    "============================================"
                );

                console.log(
                    "GENERATE BUTTON CLICKED"
                );

                console.log(
                    "============================================"
                );


                // =========================================
                // CHECK COLAB URL
                // =========================================

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


                // =========================================
                // CHECK TEXT
                // =========================================

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


                // =========================================
                // CHECK VOICE
                // =========================================

                if (!selectedVoiceFile) {

                    showError(
                        "Please upload your voice sample first."
                    );

                    return;

                }


                // =========================================
                // FILE INFORMATION
                // =========================================

                console.log(
                    "Text length:",
                    text.length
                );

                console.log(
                    "Voice file:",
                    selectedVoiceFile.name
                );

                console.log(
                    "Voice type:",
                    selectedVoiceFile.type
                );

                console.log(
                    "Voice size:",
                    selectedVoiceFile.size
                );


                // =========================================
                // DISABLE BUTTON
                // =========================================

                generateBtn.disabled =
                    true;


                generateBtn.textContent =
                    "⏳ Connecting...";


                if (loadingBox) {

                    loadingBox.classList.remove(
                        "hidden"
                    );

                }


                if (errorBox) {

                    errorBox.classList.add(
                        "hidden"
                    );

                }


                // =========================================
                // CLEAR OLD RESULT
                // =========================================

                if (outputAudio) {

                    outputAudio.pause();

                    outputAudio.removeAttribute(
                        "src"
                    );

                    outputAudio.load();

                    outputAudio.classList.add(
                        "hidden"
                    );

                }


                if (downloadResultBtn) {

                    downloadResultBtn.classList.add(
                        "hidden"
                    );

                    downloadResultBtn.removeAttribute(
                        "href"
                    );

                }


                if (resultBox) {

                    resultBox.innerHTML = `
                        <div class="result-icon">
                            🔌
                        </div>

                        <p>
                            Connecting to Google Colab...
                        </p>

                        <p class="small-text">
                            Please wait.
                        </p>
                    `;

                }


                try {


                    // =====================================
                    // LOAD GRADIO CLIENT
                    // =====================================

                    console.log(
                        "Loading Gradio client..."
                    );


                    const module =
                        await import(
                            GRADIO_CLIENT_URL
                        );


                    console.log(
                        "Gradio module loaded:",
                        module
                    );


                    const Client =
                        module.Client;


                    const handle_file =
                        module.handle_file;


                    if (!Client) {

                        throw new Error(
                            "Gradio Client tidak ditemukan."
                        );

                    }


                    if (!handle_file) {

                        throw new Error(
                            "handle_file tidak ditemukan."
                        );

                    }


                    console.log(
                        "✓ Client tersedia"
                    );

                    console.log(
                        "✓ handle_file tersedia"
                    );


                    // =====================================
                    // CONNECT TO COLAB
                    // =====================================

                    generateBtn.textContent =
                        "🔌 Connecting...";


                    if (resultBox) {

                        resultBox.innerHTML = `
                            <div class="result-icon">
                                🔌
                            </div>

                            <p>
                                Connecting to Google Colab...
                            </p>

                            <p class="small-text">
                                Connecting to Gradio server...
                            </p>
                        `;

                    }


                    console.log(
                        "Connecting to:",
                        COLAB_URL
                    );


                    const client =
                        await Client.connect(
                            COLAB_URL
                        );


                    console.log(
                        "============================================"
                    );

                    console.log(
                        "✓ CONNECTED TO GRADIO"
                    );

                    console.log(
                        "============================================"
                    );


                    // =====================================
                    // VIEW API
                    // =====================================

                    try {

                        const apiInfo =
                            await client.view_api();


                        console.log(
                            "Gradio API information:",
                            apiInfo
                        );


                    } catch (apiError) {

                        console.warn(
                            "view_api() gagal:",
                            apiError
                        );

                    }


                    // =====================================
                    // UPDATE UI
                    // =====================================

                    generateBtn.textContent =
                        "📤 Uploading...";


                    if (resultBox) {

                        resultBox.innerHTML = `
                            <div class="result-icon">
                                📤
                            </div>

                            <p>
                                Sending voice sample to Colab...
                            </p>

                            <p class="small-text">
                                Please wait while the file is uploaded.
                            </p>
                        `;

                    }


                    // =====================================
                    // PREPARE FILE
                    // =====================================

                    console.log(
                        "Preparing voice file..."
                    );


                    const voiceFile =
                        handle_file(
                            selectedVoiceFile
                        );


                    console.log(
                        "Voice file prepared:",
                        voiceFile
                    );


                    // =====================================
                    // CALL XTTS ENDPOINT
                    // =====================================

                    console.log(
                        "Calling /generate_from_website ..."
                    );


                    generateBtn.textContent =
                        "⚙️ Processing...";


                    if (resultBox) {

                        resultBox.innerHTML = `
                            <div class="result-icon">
                                ⚙️
                            </div>

                            <p>
                                XTTS-v2 is generating your voice...
                            </p>

                            <p class="small-text">
                                Please wait. This can take some time.
                            </p>
                        `;

                    }


                    const result =
                        await client.predict(
                            "/generate_from_website",
                            [
                                voiceFile,
                                text,
                                "en"
                            ]
                        );


                    // =====================================
                    // LOG RESULT
                    // =====================================

                    console.log(
                        "============================================"
                    );

                    console.log(
                        "GRADIO RESULT"
                    );

                    console.log(
                        result
                    );

                    console.log(
                        "============================================"
                    );


                    // =====================================
                    // CHECK RESULT
                    // =====================================

                    if (
                        !result ||
                        !result.data
                    ) {

                        throw new Error(
                            "Colab tidak mengembalikan data."
                        );

                    }


                    const output =
                        result.data[0];


                    console.log(
                        "Output audio:",
                        output
                    );


                    if (!output) {

                        throw new Error(
                            "Colab tidak mengembalikan file audio."
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
                        output.file &&
                        output.file.url
                    ) {

                        audioURL =
                            output.file.url;

                    }


                    else if (
                        output.data &&
                        output.data.url
                    ) {

                        audioURL =
                            output.data.url;

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
                            "Format file audio dari Colab tidak dikenali."
                        );

                    }


                    console.log(
                        "Audio URL:",
                        audioURL
                    );


                    // =====================================
                    // SHOW AUDIO
                    // =====================================

                    if (outputAudio) {

                        outputAudio.src =
                            audioURL;


                        outputAudio.classList.remove(
                            "hidden"
                        );


                        outputAudio.load();

                    }


                    // =====================================
                    // SHOW DOWNLOAD BUTTON
                    // =====================================

                    if (downloadResultBtn) {

                        downloadResultBtn.href =
                            audioURL;


                        downloadResultBtn.download =
                            "cloned_voice.wav";


                        downloadResultBtn.classList.remove(
                            "hidden"
                        );

                    }


                    // =====================================
                    // SUCCESS MESSAGE
                    // =====================================

                    if (resultBox) {

                        resultBox.innerHTML = `
                            <div class="result-icon">
                                🎉
                            </div>

                            <p>
                                Voice generation completed!
                            </p>

                            <p class="small-text">
                                Your cloned voice is ready.
                            </p>
                        `;

                    }


                    console.log(
                        "============================================"
                    );

                    console.log(
                        "✅ VOICE GENERATION SUCCESS"
                    );

                    console.log(
                        "============================================"
                    );


                }


                catch (error) {


                    console.error(
                        "============================================"
                    );

                    console.error(
                        "❌ GENERATION ERROR"
                    );

                    console.error(
                        error
                    );

                    console.error(
                        "============================================"
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


                    if (resultBox) {

                        resultBox.innerHTML = `
                            <div class="result-icon">
                                ❌
                            </div>

                            <p>
                                Generation failed.
                            </p>

                            <p class="small-text">
                                ${escapeHtml(message)}
                            </p>
                        `;

                    }

                }


                finally {


                    generateBtn.disabled =
                        false;


                    generateBtn.textContent =
                        "🚀 Generate Voice";


                    if (loadingBox) {

                        loadingBox.classList.add(
                            "hidden"
                        );

                    }

                }

            }
        );


        // =================================================
        // SHOW ERROR
        // =================================================

        function showError(
            message
        ) {

            if (errorBox) {

                errorBox.textContent =
                    message;


                errorBox.classList.remove(
                    "hidden"
                );

            }


            if (loadingBox) {

                loadingBox.classList.add(
                    "hidden"
                );

            }


            if (generateBtn) {

                generateBtn.disabled =
                    false;


                generateBtn.textContent =
                    "🚀 Generate Voice";

            }


            console.error(
                "ERROR:",
                message
            );

        }


        // =================================================
        // FILE EXTENSION
        // =================================================

        function getFileExtension(
            filename
        ) {

            if (!filename) {

                return ".wav";

            }


            const index =
                filename.lastIndexOf(
                    "."
                );


            if (index === -1) {

                return ".wav";

            }


            return filename.substring(
                index
            );

        }


        // =================================================
        // ESCAPE HTML
        // =================================================

        function escapeHtml(
            text
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                String(text);


            return div.innerHTML;

        }


        // =================================================
        // INITIAL
        // =================================================

        updateCounter();


        console.log(
            "============================================"
        );

        console.log(
            "✓ My Voice Cloner initialized."
        );

        console.log(
            "============================================"
        );

    }
);
