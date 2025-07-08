from io import BytesIO
from PIL import Image
import win32clipboard

def copy_image_to_clipboard(img_bytes: bytes):
    im = Image.open(BytesIO(img_bytes))
    output = BytesIO()
    im.convert("RGB").save(output, "BMP")
    data = output.getvalue()[14:]
    output.close()

    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardData(win32clipboard.CF_DIB, data)
    win32clipboard.CloseClipboard()