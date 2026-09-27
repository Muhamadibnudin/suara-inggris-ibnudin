// ============================================================
// MY VOICE CLONER - WEBSITE FRONTEND
// GitHub Pages -> Google Colab XTTS-v2
// ============================================================


// ============================================================
// CONFIG
// ============================================================

const COLAB_URL =
    "https://3a921a77aba1b849b6.gradio.live";

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
            "Tidak dapat terhubung ke server Colab. Pastikan runtime Colab masih aktif."
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
    // result.data
    // --------------------------------------------------------

    const data =
        result.data;


    if (Array.isArray(data)) {

        for (
            const item of data
        ) {

            const found =
                extractAudioURL(
                    {
                        data: item
                    }
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

        // url
        if (
            typeof result.url ===
            "string"
        ) {

            return result.url;
        }


        // path
        if (
            typeof result.path ===
            "string"
        ) {

            return result.path;
        }


        // file.url
        if (
            result.file &&
            typeof result.file.url ===
            "string"
        ) {

            return result.file.url;
        }


        // file.path
        if (
            result.file &&
            typeof result.file.path ===
            "string"
        ) {

            return result.file.path;
        }


        // data.url
        if (
            result.data &&
            typeof result.data.url ===
            "string"
        ) {

            return result.data.url;
        }


        // data.path
        if (
            result.data &&
            typeof result.data.path ===
            "string"
        ) {

            return result.data.path;
        }


        // value
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

function normalizeAudioURL(
    url
) {

    if (!url) {
        return null;
    }

    // already usable
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


    // relative URL
    if (
        url.startsWith("/")
    ) {

        return (
            COLAB_URL +
            url
        );
    }


    // local Gradio path
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

    // --------------------------------------------------------
    // CHECK TEXT
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // CHECK VOICE
    // --------------------------------------------------------

    if (!selectedVoiceFile) {

        showError(
            "Upload rekaman suara terlebih dahulu."
        );

        return;
    }


    // --------------------------------------------------------
    // CHECK BUTTON
    // --------------------------------------------------------

    if (generateBtn) {

        generateBtn.disabled =
            true;

        generateBtn.dataset.originalText =
            generateBtn.textContent;

        generateBtn.textContent =
            "Generating...";
    }


    try {

        showLoading(
            "Menghubungkan ke AI..."
        );


        // ----------------------------------------------------
        // CONNECT
        // ----------------------------------------------------

        const client =
            await loadGradioClient();


        // ----------------------------------------------------
        // FILE
        // ----------------------------------------------------

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


        const voiceFile =
            handle_file(
                selectedVoiceFile
            );


        // ----------------------------------------------------
        // GENERATE
        // ----------------------------------------------------

        showLoading(
            "AI sedang membuat suara... Tunggu beberapa saat."
        );


        console.log(
            "Calling endpoint:",
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


        // ----------------------------------------------------
        // RAW RESULT
        // ----------------------------------------------------

        console.log(
            "RAW GRADIO RESULT:",
            result
        );


        // ----------------------------------------------------
        // EXTRACT
        // ----------------------------------------------------

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


        if (!audioURL) {

            console.error(
                "Gradio response tidak dikenali:",
                result
            );

            throw new Error(
                "Server berhasil merespons tetapi URL audio hasil tidak ditemukan."
            );
        }


        // ----------------------------------------------------
        // OUTPUT AUDIO
        // ----------------------------------------------------

        generatedAudioURL =
            audioURL;


        if (outputAudio) {

            outputAudio.src =
                audioURL;

            outputAudio.controls =
                true;

            outputAudio.style.display =
                "block";

            outputAudio.load();
        }


        // ----------------------------------------------------
        // DOWNLOAD RESULT
        // ----------------------------------------------------

        if (downloadResultBtn) {

            downloadResultBtn.href =
                audioURL;

            downloadResultBtn.download =
                "my-cloned-voice.wav";

            downloadResultBtn.style.display =
                "inline-block";
        }


        // ----------------------------------------------------
        // SHOW RESULT
        // ----------------------------------------------------

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

        console.error(
            "VOICE GENERATION ERROR:",
            error
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


console.log(
    "========================================"
);

console.log(
    "MY VOICE CLONER FRONTEND LOADED"
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
    "========================================"
);
