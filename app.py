# ============================================================
# MY VOICE CLONER
# XTTS-v2 + Gradio 6
# BACKEND UNTUK WEBSITE GITHUB PAGES
# ============================================================

import os
import uuid
import traceback
import torch
import gradio as gr

from TTS.api import TTS


# ============================================================
# CONFIG
# ============================================================

APP_TITLE = "My Voice Cloner"

OUTPUT_DIR = os.path.abspath("output")

os.makedirs(OUTPUT_DIR, exist_ok=True)


# ============================================================
# DEVICE
# ============================================================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("")
print("=" * 60)
print("        MY VOICE CLONER - XTTS-v2")
print("=" * 60)

print("Python       :", __import__("sys").version)
print("PyTorch      :", torch.__version__)
print("CUDA         :", torch.cuda.is_available())
print("Device       :", device)

if torch.cuda.is_available():
    print("GPU          :", torch.cuda.get_device_name(0))

print("Output folder:", OUTPUT_DIR)

print("=" * 60)


# ============================================================
# LOAD XTTS
# ============================================================

print("")
print("Loading XTTS-v2...")
print("Mohon tunggu...")
print("")

tts = TTS(
    "tts_models/multilingual/multi-dataset/xtts_v2"
).to(device)

print("")
print("=" * 60)
print("XTTS-v2 BERHASIL DIMUAT")
print("=" * 60)
print("")


# ============================================================
# GENERATE FUNCTION
# ============================================================

def generate_from_website(
    reference_audio,
    text,
    language
):
    print("")
    print("=" * 60)
    print("NEW GENERATION REQUEST")
    print("=" * 60)

    # --------------------------------------------------------
    # CHECK AUDIO
    # --------------------------------------------------------

    if reference_audio is None:
        print("ERROR: reference audio kosong")
        raise gr.Error(
            "Silakan upload rekaman suara terlebih dahulu."
        )

    # --------------------------------------------------------
    # CHECK TEXT
    # --------------------------------------------------------

    if text is None:
        text = ""

    text = str(text).strip()

    if not text:
        print("ERROR: text kosong")
        raise gr.Error(
            "Silakan masukkan teks terlebih dahulu."
        )

    # --------------------------------------------------------
    # LANGUAGE
    # --------------------------------------------------------

    if not language:
        language = "en"

    language = str(language)

    # --------------------------------------------------------
    # AUDIO PATH
    # --------------------------------------------------------

    audio_path = reference_audio

    print("Reference audio:", audio_path)
    print("Language       :", language)
    print("Text length    :", len(text))

    # --------------------------------------------------------
    # CHECK FILE
    # --------------------------------------------------------

    if not os.path.exists(audio_path):
        print("ERROR: file audio tidak ditemukan")

        raise gr.Error(
            "File rekaman suara tidak ditemukan di server."
        )

    file_size = os.path.getsize(audio_path)

    print("Audio size     :", file_size, "bytes")

    if file_size <= 0:
        raise gr.Error(
            "File rekaman suara kosong."
        )

    # --------------------------------------------------------
    # OUTPUT FILE
    # --------------------------------------------------------

    filename = (
        "cloned_voice_"
        + uuid.uuid4().hex
        + ".wav"
    )

    output_file = os.path.join(
        OUTPUT_DIR,
        filename
    )

    print("Output file    :", output_file)

    # --------------------------------------------------------
    # GENERATE
    # --------------------------------------------------------

    print("")
    print("-" * 60)
    print("Generating XTTS-v2...")
    print("-" * 60)

    try:

        tts.tts_to_file(
            text=text,
            speaker_wav=audio_path,
            language=language,
            file_path=output_file
        )

    except Exception as e:

        print("")
        print("=" * 60)
        print("❌ XTTS ERROR")
        print("=" * 60)

        print("Error:", str(e))

        traceback.print_exc()

        print("=" * 60)

        raise gr.Error(
            "XTTS gagal membuat suara: "
            + str(e)
        )

    # --------------------------------------------------------
    # CHECK OUTPUT
    # --------------------------------------------------------

    if not os.path.exists(output_file):

        print("ERROR: output WAV tidak ditemukan")

        raise gr.Error(
            "Audio berhasil diproses tetapi file output tidak ditemukan."
        )

    output_size = os.path.getsize(
        output_file
    )

    print("")
    print("=" * 60)
    print("✅ GENERATION SUCCESS")
    print("=" * 60)

    print("Output :", output_file)
    print("Size   :", output_size, "bytes")

    print("=" * 60)
    print("")

    if output_size <= 0:

        raise gr.Error(
            "File audio hasil generasi kosong."
        )

    # --------------------------------------------------------
    # RETURN FILE PATH
    # --------------------------------------------------------

    return output_file


# ============================================================
# GRADIO UI
# ============================================================

with gr.Blocks(
    title=APP_TITLE
) as app:

    gr.Markdown(
        """
        # 🎙️ My Voice Cloner

        Generate speech using your own voice with XTTS-v2.
        """
    )

    # --------------------------------------------------------
    # INPUT AUDIO
    # --------------------------------------------------------

    reference_audio = gr.Audio(
        label="🎤 Your Voice",
        type="filepath"
    )

    # --------------------------------------------------------
    # TEXT
    # --------------------------------------------------------

    text = gr.Textbox(
        label="📝 Text",
        placeholder=(
            "Type your English text here..."
        ),
        lines=8
    )

    # --------------------------------------------------------
    # LANGUAGE
    # --------------------------------------------------------

    language = gr.Dropdown(
        choices=[
            ("English", "en"),
            ("Indonesian", "id"),
            ("Spanish", "es"),
            ("French", "fr"),
            ("German", "de"),
            ("Italian", "it"),
            ("Portuguese", "pt"),
            ("Polish", "pl"),
            ("Turkish", "tr"),
            ("Russian", "ru"),
            ("Chinese", "zh-cn"),
            ("Japanese", "ja"),
            ("Korean", "ko")
        ],
        value="en",
        label="🌎 Language"
    )

    # --------------------------------------------------------
    # BUTTON
    # --------------------------------------------------------

    generate_button = gr.Button(
        "🔊 GENERATE VOICE",
        variant="primary"
    )

    # --------------------------------------------------------
    # OUTPUT
    # --------------------------------------------------------

    output_audio = gr.Audio(
        label="🔊 Generated Voice",
        type="filepath"
    )

    # --------------------------------------------------------
    # API ENDPOINT
    # --------------------------------------------------------

    generate_button.click(
        fn=generate_from_website,

        inputs=[
            reference_audio,
            text,
            language
        ],

        outputs=[
            output_audio
        ],

        api_name="generate_from_website"
    )


# ============================================================
# START SERVER
# ============================================================

print("")
print("=" * 60)
print("STARTING GRADIO SERVER")
print("=" * 60)
print("")

app.launch(
    share=True,
    show_error=True
)
