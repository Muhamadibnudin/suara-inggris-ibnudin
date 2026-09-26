import os
import torch
import gradio as gr
from TTS.api import TTS

# =========================
# DEVICE
# =========================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("================================")
print("MY VOICE CLONER")
print("================================")
print("Device:", device)

# =========================
# LOAD XTTS
# =========================

print("Loading XTTS-v2...")

tts = TTS(
    "tts_models/multilingual/multi-dataset/xtts_v2"
).to(device)

print("✅ XTTS-v2 loaded")


# =========================
# GENERATE
# =========================

def generate_voice(
    reference_audio,
    text,
    language
):

    if reference_audio is None:
        raise gr.Error(
            "Upload rekaman suara Anda terlebih dahulu."
        )

    if not text or not text.strip():
        raise gr.Error(
            "Masukkan teks terlebih dahulu."
        )

    os.makedirs("output", exist_ok=True)

    output_file = os.path.join(
        "output",
        "cloned_voice.wav"
    )

    print("Generating voice...")
    print("Language:", language)

    tts.tts_to_file(
        text=text.strip(),
        speaker_wav=reference_audio,
        language=language,
        file_path=output_file
    )

    print("✅ Generated:", output_file)

    return output_file


# =========================
# API FUNCTION
# =========================

with gr.Blocks(
    title="My Voice Cloner"
) as app:

    gr.Markdown(
        """
        # 🎙️ My Voice Cloner

        Generate speech using your own voice.
        """
    )

    reference_audio = gr.Audio(
        label="Your Voice",
        type="filepath"
    )

    text = gr.Textbox(
        label="Text",
        placeholder="Type your text here...",
        lines=8
    )

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
        label="Language"
    )

    generate_button = gr.Button(
        "🔊 GENERATE VOICE",
        variant="primary"
    )

    output_audio = gr.Audio(
        label="Generated Voice",
        type="filepath"
    )

    generate_button.click(
        fn=generate_voice,
        inputs=[
            reference_audio,
            text,
            language
        ],
        outputs=output_audio,
        api_name="generate_voice"
    )


# =========================
# START
# =========================

app.launch(
    share=True,
    show_error=True
)
