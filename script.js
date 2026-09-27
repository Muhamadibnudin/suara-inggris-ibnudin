// =====================================================
// MY VOICE CLONER
// GitHub Pages -> Gradio -> Google Colab -> XTTS-v2
// =====================================================


// =====================================================
// COLAB URL
// =====================================================

// GANTI dengan URL .gradio.live milik Anda.
//
// Contoh:
// const COLAB_URL =
//     "https://12345abcdef.gradio.live";

const COLAB_URL =
    "https://abc123456789.gradio.live";


// =====================================================
// START AFTER HTML LOADED
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "My Voice Cloner JavaScript loaded."
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
        // CHECK ELEMENTS
        // =================================================

        if (!textInput) {

            console.error(
                "textInput tidak ditemukan."
            );

        }

        if (!voiceInput) {

            console.error(
                "voiceInput tidak ditemukan."
            );

        }

        if (!generateBtn) {

            console.error(
                "generateBtn tidak ditemukan."
            );

            return;

        }


        // =================================================
        // SELECTED VOICE
        // =================================================

        let selectedVoiceFile = null;


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
        // EXAMPLE
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


                    if (
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
                // DISABLE BUTTON
                // -----------------------------------------

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


                    const {
                        Client,
                        handle_file
                    } = await import(
                        "https://cdn.jsdelivr.net/npm/@gradio/client@2.2.0/dist/index.js"
                    );


                    console.log(
                        "Gradio client loaded."
                    );


                    // =====================================
                    // CONNECT
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
                                ${escapeHtml(COLAB_URL)}
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
                        "Connected to Gradio."
                    );


                    // =====================================
                    // UPLOAD / GENERATE
                    // =====================================

                    generateBtn.textContent =
                        "📤 Sending...";


                    if (resultBox) {

                        resultBox.innerHTML = `
                            <div class="result-icon">
                                📤
                            </div>

                            <p>
                                Sending voice sample to Colab...
                            </p>

                            <p class="small-text">
                                XTTS-v2 will process it next.
                            </p>
                        `;

                    }


                    console.log(
                        "Sending request..."
                    );


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


                    // =====================================
                    // GET OUTPUT
                    // =====================================

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
                                Do not close this page.
                            </p>
                        `;

                    }


                    const output =
                        result &&
                        result.data
                            ? result.data[0]
                            : null;


                    console.log(
                        "Output:",
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


                    if (!audioURL) {

                        console.log(
                            "Unknown output:",
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
                    // DISPLAY RESULT
                    // =====================================

                    if (outputAudio) {

                        outputAudio.src =
                            audioURL;


                        outputAudio.classList.remove(
                            "hidden"
                        );

                    }


                    if (downloadResultBtn) {

                        downloadResultBtn.href =
                            audioURL;


                        downloadResultBtn.classList.remove(
                            "hidden"
                        );

                    }


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
                        "VOICE GENERATION SUCCESS"
                    );


                }


                catch (error) {


                    console.error(
                        "Generation error:",
                        error
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
                                Lihat pesan error berwarna merah.
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

        }


        // =================================================
        // FILE EXTENSION
        // =================================================

        function getFileExtension(
            filename
        ) {

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
                text;


            return div.innerHTML;

        }


        // =================================================
        // INITIAL
        // =================================================

        updateCounter();


        console.log(
            "My Voice Cloner initialized."
        );

    }
);
