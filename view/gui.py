# view/gui.py
import os
import base64
import requests
import flet as ft

from view.constants import THEME, API_HOST, API_PORT
from view.utils.clipboard import copy_image_to_clipboard

API_URL = f"http://{API_HOST}:{API_PORT}"

def main(page: ft.Page):
    page.title = "QR Generator"
    page.bgcolor = THEME["bg"]

    data_input = ft.TextField(
        label="Texto/URL del QR",
        width=300,
        color=THEME["text"],
        bgcolor="#1e1e1e",
    )

    qr_image = ft.Image(width=300, height=300)
    status   = ft.Text("", color=THEME["text"])
    current  = {"bytes": None}

    def on_generate(e):
        txt = data_input.value.strip()
        if not txt:
            status.value = "Ingresa un texto o URL."
            page.update()
            return

        r = requests.post(f"{API_URL}/generate", json={"data": txt})
        if r.ok:
            js = r.json()
            img_b64 = js["image_b64"]
            current["bytes"] = base64.b64decode(img_b64)
            qr_image.src = f"data:image/png;base64,{img_b64}"
            status.value = "QR generado."
        else:
            status.value = f"Error: {r.text}"
        page.update()

    def on_copy(e):
        if current["bytes"]:
            copy_image_to_clipboard(current["bytes"])
            status.value = "Imagen copiada al portapapeles."
            page.update()

    def on_save(e):
        if not current["bytes"]:
            return
        def save_result(evt: ft.FilePickerResultEvent):
            if evt.file_path:
                with open(evt.file_path, "wb") as f:
                    f.write(current["bytes"])
                status.value = f"Guardado en {evt.file_path}"
                page.overlay.clear()
                page.update()

        picker = ft.FilePicker(save_file_name="qr.png", on_result=save_result)
        page.overlay.append(picker)
        picker.open = True
        page.update()

    buttons = ft.Row(
        [
            ft.ElevatedButton("Generar", on_click=on_generate, bgcolor=THEME["highlight"]),
            ft.ElevatedButton("Copiar Imagen", on_click=on_copy, bgcolor=THEME["btn_secondary"][1]),
            ft.ElevatedButton("Guardar",       on_click=on_save,  bgcolor=THEME["btn_secondary"][1]),
        ],
        alignment="spaceAround",
        width=300,
    )

    page.add(data_input, buttons, qr_image, status)

def run_gui():
    ft.app(target=main)
