# ============================================================
# MY VOICE CLONER
# XTTS-v2 + Gradio
# ============================================================

import os
import uuid
import torch
import gradio as gr

from TTS.api import TTS


# ============================================================
# DEVICE
# ============================================================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("============================================")
print("        MY VOICE CLONER - XTTS-v2")
print("============================================")
print("Device:", device)

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
else:
    print("WARNING: CUDA tidak tersedia.")

print("============================================")


# ============================================================
# LOAD XTTS-V2
# ============================================================

print("Loading XTTS-v2...")
print("Mohon tunggu...")

tts = TTS(
    "tts_models/multilingual/multi-dataset/xtts_v2"
).to(device)

print("============================================")
print("XTTS-v2 berhasil dimuat")
print("============================================")


# ============================================================
# GENERATE VOICE
# ============================================================

def generate_voice(
    reference_audio,
    text,
    language
):

    print("")
    print("============================================")
    print("NEW GENERATION REQUEST")
    print("============================================")

    # -------------------------
    # CHECK AUDIO
    # -------------------------

    if reference_audio is None:
        raise gr.Error(
            "Upload rekaman suara terlebih dahulu."
        )

    # -------------------------
    # CHECK TEXT
    # -------------------------

    if not text or not text.strip():
        raise gr.Error(
            "Masukkan teks terlebih dahulu."
        )

    # -------------------------
    # DEFAULT LANGUAGE
    # -------------------------

    if not language:
        language = "en"

    # -------------------------
    # CHECK FILE
    # -------------------------

    if not os.path.exists(reference_audio):
        raise gr.Error(
            "File rekaman suara tidak ditemukan."
        )

    # -------------------------
    # OUTPUT DIRECTORY
    # -------------------------

    os.makedirs(
        "output",
        exist_ok=True
    )

    # -------------------------
    # UNIQUE OUTPUT
    # -------------------------

    filename = (
        "cloned_voice_"
        + uuid.uuid4().hex
        + ".wav"
    )

    output_file = os.path.join(
        "output",
        filename
    )

    # -------------------------
    # LOG
    # -------------------------

    print("Reference audio :", reference_audio)
    print("Language        :", language)
    print("Text length     :", len(text.strip()))
    print("Output file     :", output_file)

    print("--------------------------------------------")
    print("Generating voice...")
    print("--------------------------------------------")

    # -------------------------
    # XTTS GENERATION
    # -------------------------

    try:

        tts.tts_to_file(
            text=text.strip(),
            speaker_wav=reference_audio,
            language=language,
            file_path=output_file
        )

    except Exception as e:

        print("")
        print("❌ XTTS ERROR")
        print("Error:", e)
        print("")

        raise gr.Error(
            f"Gagal membuat suara: {str(e)}"
        )

    # -------------------------
    # CHECK OUTPUT
    # -------------------------

    if not os.path.exists(output_file):

        raise gr.Error(
            "Audio selesai diproses tetapi file WAV tidak ditemukan."
        )

    file_size = os.path.getsize(
        output_file
    )

    if file_size <= 0:

        raise gr.Error(
            "File WAV kosong."
        )

    # -------------------------
    # SUCCESS
    # -------------------------

    print("")
    print("============================================")
    print("✅ VOICE GENERATION SUCCESS")
    print("============================================")
    print("Output:", output_file)
    print("Size:", file_size, "bytes")
    print("============================================")
    print("")

    return output_file


# ============================================================
# GRADIO INTERFACE
# ============================================================

with gr.Blocks(
    title="My Voice Cloner"
) as app:

    gr.Markdown(
        """
        # 🎙️ My Voice Cloner

        Generate speech using your own voice with XTTS-v2.
        """
    )

    # -------------------------
    # VOICE
    # -------------------------

    reference_audio = gr.Audio(
        label="🎤 Your Voice",
        type="filepath"
    )

    # -------------------------
    # TEXT
    # -------------------------

    text = gr.Textbox(
        label="📝 Text",
        placeholder="Type your English text here...",
        lines=8
    )

    # -------------------------
    # LANGUAGE
    # -------------------------

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

    # -------------------------
    # BUTTON
    # -------------------------

    generate_button = gr.Button(
        "🔊 GENERATE VOICE",
        variant="primary"
    )

    # -------------------------
    # OUTPUT
    # -------------------------

    output_audio = gr.Audio(
        label="🔊 Generated Voice",
        type="filepath"
    )

    # -------------------------
    # API
    # -------------------------

    generate_button.click(
        fn=generate_voice,

        inputs=[
            reference_audio,
            text,
            language
        ],

        outputs=[
            output_audio
        ],

        api_name="generate_voice"
    )


# ============================================================
# START GRADIO
# ============================================================

print("")
print("============================================")
print("Starting Gradio...")
print("============================================")

app.launch(
    share=True,
    show_error=True
)
