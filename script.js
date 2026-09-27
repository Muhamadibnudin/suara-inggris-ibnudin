// ============================================================
// MY VOICE CLONER - WEBSITE FRONTEND
// GitHub Pages -> Google Colab XTTS-v2
// ============================================================


// ============================================================
// CONFIG
// ============================================================

const COLAB_URL =
    "https://8f7b5a1f89e073d8e3.gradio.live";

const GRADIO_CLIENT_URL =
    "https://cdn.jsdelivr.net/npm/@gradio/client@2.7.0/dist/index.min.js";

const API_ENDPOINT =
    "/generate_from_website";


// ============================================================
// ELEMENTS
// ============================================================

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
    document.getElementById("downloadResultBtn");


// ============================================================
// STATE
// ============================================================

let selectedVoiceFile =
    null;

let generatedAudioURL =
    null;

let gradioClient =
    null;


// ============================================================
// HELPERS
// ============================================================

function showError(message) {

    if (!errorBox) {
        alert(message);
        return;
    }

    errorBox.textContent =
        "❌ " + message;

    errorBox.style.display =
        "block";
}


function hideError() {

    if (!errorBox) {
        return;
    }

    errorBox.textContent =
        "";

    errorBox.style.display =
        "none";
}


function showLoading(message) {

    if (!loadingBox) {
        return;
    }

    loadingBox.textContent =
        message || "Generating...";

    loadingBox.style.display =
        "block";
}


function hideLoading() {

    if (!loadingBox) {
        return;
    }

    loadingBox.style.display =
        "none";
}


function showResult() {

    if (!resultBox) {
        return;
    }

    resultBox.style.display =
        "block";
}


function hideResult() {

    if (!resultBox) {
        return;
    }

    resultBox.style.display =
        "none";
}


// ============================================================
// CHARACTER COUNTER
// ============================================================

function updateCharacterCount() {

    if (!textInput || !charCount) {
        return;
    }

    const length =
        textInput.value.length;

    charCount.textContent =
        length + " / 5000";
}


if (textInput) {

    textInput.addEventListener(
        "input",
        updateCharacterCount
    );

    updateCharacterCount();
}


// ============================================================
// EXAMPLE TEXT
// ============================================================

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

            updateCharacterCount();
        }
    );
}


// ============================================================
// COPY TEXT
// ============================================================

if (copyTextBtn) {

    copyTextBtn.addEventListener(
        "click",
        async function () {

            if (!textInput) {
                return;
            }

            const text =
                textInput.value;

            if (!text) {

                showError(
                    "Tidak ada teks untuk disalin."
                );

                return;
            }

            try {

                await navigator.clipboard.writeText(
                    text
                );

                copyTextBtn.textContent =
                    "Copied!";

                setTimeout(
                    function () {

                        copyTextBtn.textContent =
                            "Copy";

                    },
                    1500
                );

            } catch (error) {

                showError(
                    "Gagal menyalin teks."
                );
            }
        }
    );
}


// ============================================================
// VOICE FILE
// ============================================================

if (voiceInput) {

    voiceInput.addEventListener(
        "change",
        function () {

            hideError();

            const file =
                voiceInput.files &&
                voiceInput.files[0];

            if (!file) {

                selectedVoiceFile =
                    null;

                return;
            }

            selectedVoiceFile =
                file;

            console.log(
                "Selected voice file:",
                file
            );


            // ------------------------------------------------
            // INFO
            // ------------------------------------------------

            if (voiceInfo) {

                const sizeMB =
                    (
                        file.size /
                        1024 /
                        1024
                    ).toFixed(2);

                voiceInfo.textContent =
                    `${file.name} • ${sizeMB} MB`;
            }


            // ------------------------------------------------
            // PREVIEW
            // ------------------------------------------------

            if (voicePreview) {

                try {

                    const previewURL =
                        URL.createObjectURL(
                            file
                        );

                    voicePreview.src =
                        previewURL;

                    voicePreview.style.display =
                        "block";

                } catch (error) {

                    console.warn(
                        "Voice preview error:",
                        error
                    );
                }
            }


            // ------------------------------------------------
            // DOWNLOAD ORIGINAL
            // ------------------------------------------------

            if (downloadVoiceBtn) {

                try {

                    const url =
                        URL.createObjectURL(
                            file
                        );

                    downloadVoiceBtn.href =
                        url;

                    downloadVoiceBtn.download =
                        file.name;

                    downloadVoiceBtn.style.display =
                        "inline-block";

                } catch (error) {

                    console.warn(
                        "Download original voice error:",
                        error
                    );
                }
            }
        }
    );
}


// ============================================================
// LOAD GRADIO CLIENT
// ============================================================

async function loadGradioClient() {

    if (gradioClient) {
        return gradioClient;
    }

    showLoading(
        "Menghubungkan ke server AI..."
    );

    try {

        const module =
            await import(
                GRADIO_CLIENT_URL
            );


        if (!module.Client) {

            throw new Error(
                "Gradio Client tidak ditemukan."
            );
        }


        const Client =
            module.Client;


        gradioClient =
            await Client.connect(
                COLAB_URL
            );


        console.log(
            "Gradio connected:",
            gradioClient
        );


        return gradioClient;

    } catch (error) {

        console.error(
            "Gradio connection error:",
            error
        );


        throw new Error(
            "Tidak dapat terhubung ke server Colab. Pastikan runtime Colab masih aktif dan URL Gradio masih berlaku."
        );
    }
}


// ============================================================
// GET GRADIO FILE URL
// ============================================================

function extractAudioURL(result) {

    console.log(
        "Extracting audio from result:",
        result
    );


    if (!result) {
        return null;
    }


    // --------------------------------------------------------
    // RESULT DATA
    // --------------------------------------------------------

    const data =
        result.data;


    if (Array.isArray(data)) {

        for (
            const item of data
        ) {

            const found =
                extractAudioURL(
                    item
                );

            if (found) {
                return found;
            }
        }
    }


    // --------------------------------------------------------
    // STRING
    // --------------------------------------------------------

    if (
        typeof result ===
        "string"
    ) {

        if (
            result.startsWith(
                "http://"
            ) ||
            result.startsWith(
                "https://"
            ) ||
            result.startsWith(
                "blob:"
            ) ||
            result.startsWith(
                "data:"
            )
        ) {

            return result;
        }
    }


    // --------------------------------------------------------
    // OBJECT
    // --------------------------------------------------------

    if (
        typeof result ===
        "object"
    ) {


        // ----------------------------------------------------
        // URL
        // ----------------------------------------------------

        if (
            typeof result.url ===
            "string"
        ) {

            return result.url;
        }


        // ----------------------------------------------------
        // PATH
        // ----------------------------------------------------

        if (
            typeof result.path ===
            "string"
        ) {

            return result.path;
        }


        // ----------------------------------------------------
        // FILE URL
        // ----------------------------------------------------

        if (
            result.file &&
            typeof result.file.url ===
            "string"
        ) {

            return result.file.url;
        }


        // ----------------------------------------------------
        // FILE PATH
        // ----------------------------------------------------

        if (
            result.file &&
            typeof result.file.path ===
            "string"
        ) {

            return result.file.path;
        }


        // ----------------------------------------------------
        // DATA URL
        // ----------------------------------------------------

        if (
            result.data &&
            typeof result.data.url ===
            "string"
        ) {

            return result.data.url;
        }


        // ----------------------------------------------------
        // DATA PATH
        // ----------------------------------------------------

        if (
            result.data &&
            typeof result.data.path ===
            "string"
        ) {

            return result.data.path;
        }


        // ----------------------------------------------------
        // VALUE
        // ----------------------------------------------------

        if (
            typeof result.value ===
            "string"
        ) {

            return result.value;
        }
    }


    return null;
}


// ============================================================
// NORMALIZE GRADIO URL
// ============================================================

function normalizeAudioURL(url) {

    if (!url) {
        return null;
    }


    // --------------------------------------------------------
    // ALREADY USABLE
    // --------------------------------------------------------

    if (
        url.startsWith(
            "http://"
        ) ||
        url.startsWith(
            "https://"
        ) ||
        url.startsWith(
            "blob:"
        ) ||
        url.startsWith(
            "data:"
        )
    ) {

        return url;
    }


    // --------------------------------------------------------
    // RELATIVE URL
    // --------------------------------------------------------

    if (
        url.startsWith("/")
    ) {

        return (
            COLAB_URL +
            url
        );
    }


    // --------------------------------------------------------
    // GRADIO FILE PATH
    // --------------------------------------------------------

    if (
        url.startsWith(
            "file="
        )
    ) {

        return (
            COLAB_URL +
            "/gradio_api/file=" +
            encodeURIComponent(
                url.substring(5)
            )
        );
    }


    return url;
}


// ============================================================
// GENERATE VOICE
// ============================================================

async function generateVoice() {

    hideError();

    hideResult();


    // ========================================================
    // CHECK TEXT INPUT
    // ========================================================

    if (!textInput) {

        showError(
            "Text input tidak ditemukan."
        );

        return;
    }


    const text =
        textInput.value.trim();


    if (!text) {

        showError(
            "Masukkan teks terlebih dahulu."
        );

        return;
    }


    if (text.length > 5000) {

        showError(
            "Teks terlalu panjang. Maksimal 5000 karakter."
        );

        return;
    }


    // ========================================================
    // CHECK VOICE
    // ========================================================

    if (!selectedVoiceFile) {

        showError(
            "Upload rekaman suara terlebih dahulu."
        );

        return;
    }


    // ========================================================
    // DISABLE BUTTON
    // ========================================================

    if (generateBtn) {

        generateBtn.disabled =
            true;

        generateBtn.dataset.originalText =
            generateBtn.textContent;

        generateBtn.textContent =
            "Generating...";
    }


    try {


        // ====================================================
        // CONNECT TO COLAB
        // ====================================================

        showLoading(
            "Menghubungkan ke AI..."
        );


        const client =
            await loadGradioClient();


        // ====================================================
        // LOAD FILE HANDLER
        // ====================================================

        showLoading(
            "Mengupload rekaman suara..."
        );


        const module =
            await import(
                GRADIO_CLIENT_URL
            );


        const handle_file =
            module.handle_file;


        if (!handle_file) {

            throw new Error(
                "Fungsi handle_file tidak tersedia."
            );
        }


        // ====================================================
        // PREPARE VOICE FILE
        // ====================================================

        const voiceFile =
            handle_file(
                selectedVoiceFile
            );


        // ====================================================
        // GENERATE
        // ====================================================

        showLoading(
            "AI sedang membuat suara... Tunggu beberapa saat."
        );


        console.log(
            "========================================"
        );

        console.log(
            "GENERATING VOICE"
        );

        console.log(
            "========================================"
        );

        console.log(
            "Colab:",
            COLAB_URL
        );

        console.log(
            "Endpoint:",
            API_ENDPOINT
        );

        console.log(
            "Text:",
            text
        );

        console.log(
            "Voice:",
            selectedVoiceFile.name
        );


        const result =
            await client.predict(
                API_ENDPOINT,
                [
                    voiceFile,
                    text,
                    "en"
                ]
            );


        // ====================================================
        // RAW RESPONSE
        // ====================================================

        console.log(
            "========================================"
        );

        console.log(
            "RAW GRADIO RESULT:"
        );

        console.log(
            result
        );

        console.log(
            "========================================"
        );


        // ====================================================
        // EXTRACT AUDIO URL
        // ====================================================

        let audioURL =
            extractAudioURL(
                result
            );


        audioURL =
            normalizeAudioURL(
                audioURL
            );


        console.log(
            "Extracted audio URL:",
            audioURL
        );


        // ====================================================
        // CHECK AUDIO URL
        // ====================================================

        if (!audioURL) {

            console.error(
                "Gradio response tidak dikenali:",
                result
            );


            throw new Error(
                "Server berhasil membuat response tetapi URL audio hasil tidak ditemukan."
            );
        }


        // ====================================================
        // SAVE GENERATED URL
        // ====================================================

        generatedAudioURL =
            audioURL;


        // ====================================================
        // AUDIO PLAYER
        // ====================================================

        if (outputAudio) {

            outputAudio.src =
                audioURL;

            outputAudio.controls =
                true;

            outputAudio.style.display =
                "block";

            outputAudio.load();
        }


        // ====================================================
        // DOWNLOAD BUTTON
        // ====================================================

        if (downloadResultBtn) {

            downloadResultBtn.href =
                audioURL;

            downloadResultBtn.download =
                "my-cloned-voice.wav";

            downloadResultBtn.style.display =
                "inline-block";
        }


        // ====================================================
        // SHOW RESULT
        // ====================================================

        showResult();


        showLoading(
            "✅ Suara berhasil dibuat!"
        );


        setTimeout(
            function () {

                hideLoading();

            },
            1500
        );


    } catch (error) {


        // ====================================================
        // ERROR
        // ====================================================

        console.error(
            "========================================"
        );

        console.error(
            "VOICE GENERATION ERROR"
        );

        console.error(
            error
        );

        console.error(
            "========================================"
        );


        let message =
            "Pembuatan gagal.";


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


        hideLoading();


    } finally {


        // ====================================================
        // ENABLE BUTTON
        // ====================================================

        if (generateBtn) {

            generateBtn.disabled =
                false;


            if (
                generateBtn.dataset.originalText
            ) {

                generateBtn.textContent =
                    generateBtn.dataset.originalText;
            }
        }
    }
}


// ============================================================
// GENERATE BUTTON
// ============================================================

if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        generateVoice
    );
}


// ============================================================
// INITIAL STATE
// ============================================================

hideError();

hideLoading();

hideResult();

updateCharacterCount();


// ============================================================
// START MESSAGE
// ============================================================

console.log(
    "========================================"
);

console.log(
    "MY VOICE CLONER FRONTEND LOADED"
);

console.log(
    "========================================"
);

console.log(
    "Colab URL:",
    COLAB_URL
);

console.log(
    "API Endpoint:",
    API_ENDPOINT
);

console.log(
    "Gradio Client:",
    GRADIO_CLIENT_URL
);

console.log(
    "========================================"
);
