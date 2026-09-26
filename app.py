import os
import torch
import gradio as gr
from TTS.api import TTS

# =========================
# LOAD MODEL
# =========================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("Loading XTTS-v2...")
print("Device:", device)

tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

tts.to(device)

# =========================
# GENERATE VOICE
# =========================

def generate_voice(
    reference_audio,
    text,
    language,
    speed
):
    if reference_audio is None:
        raise gr.Error("Upload rekaman suara Anda terlebih dahulu.")

    if not text.strip():
        raise gr.Error("Masukkan teks terlebih dahulu.")

    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)

    output_file = os.path.join(
        output_dir,
        "cloned_voice.wav"
    )

    # XTTS menghasilkan suara berdasarkan
    # rekaman referensi
    tts.tts_to_file(
        text=text,
        speaker_wav=reference_audio,
        language=language,
        file_path=output_file,
        speed=speed
    )

    return output_file


# =========================
# USER INTERFACE
# =========================

with gr.Blocks(title="My Voice Cloner") as app:

    gr.Markdown(
        """
        # 🎙️ My Voice Cloner

        Clone suara sendiri dan ubah teks menjadi audio.
        """
    )

    with gr.Row():

        with gr.Column():

            reference_audio = gr.Audio(
                label="Rekaman Suara Anda",
                type="filepath"
            )

            text = gr.Textbox(
                label="Teks",
                placeholder=(
                    "Masukkan teks yang ingin diucapkan..."
                ),
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
                label="Bahasa"
            )

            speed = gr.Slider(
                minimum=0.5,
                maximum=1.5,
                value=1.0,
                step=0.05,
                label="Kecepatan"
            )

            generate_button = gr.Button(
                "🔊 GENERATE VOICE",
                variant="primary"
            )

        with gr.Column():

            output_audio = gr.Audio(
                label="Hasil",
                type="filepath"
            )

    generate_button.click(
        fn=generate_voice,
        inputs=[
            reference_audio,
            text,
            language,
            speed
        ],
        outputs=output_audio
    )


# =========================
# START
# =========================

app.launch(
    share=True
          )
