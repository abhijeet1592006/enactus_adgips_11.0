"""Compress all images in static folder to reduce Vercel bundle size."""
import os
from PIL import Image
import glob

STATIC_DIR = r"D:\enactus_adgips\enactus2\enactus\static"
MAX_DIMENSION = 1920
MAX_DIMENSION_PNG = 1200
JPEG_QUALITY = 82
PNG_COMPRESS_LEVEL = 9


def compress_image(filepath):
    try:
        ext = os.path.splitext(filepath)[1].lower()
        if ext not in ('.jpg', '.jpeg', '.png'):
            return

        img = Image.open(filepath)
        orig_size = os.path.getsize(filepath)

        if ext == '.png' and img.mode == 'RGBA':
            bg = Image.new('RGB', img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[3])
            img = bg

        if img.mode not in ('RGB', 'L'):
            img = img.convert('RGB')

        w, h = img.size
        max_dim = MAX_DIMENSION_PNG if ext == '.png' else MAX_DIMENSION
        if w > max_dim or h > max_dim:
            ratio = min(max_dim / w, max_dim / h)
            new_size = (int(w * ratio), int(h * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        if ext in ('.jpg', '.jpeg'):
            img.save(filepath, 'JPEG', quality=JPEG_QUALITY, optimize=True)
        elif ext == '.png':
            img.save(filepath, 'PNG', optimize=True, compress_level=PNG_COMPRESS_LEVEL)

        new_size = os.path.getsize(filepath)
        saved = orig_size - new_size
        if saved > 0:
            print(f"  {os.path.basename(filepath)}: {orig_size/1024:.0f}KB -> {new_size/1024:.0f}KB (saved {saved/1024:.0f}KB)")
    except Exception as e:
        print(f"  ERROR {filepath}: {e}")


def main():
    total_orig = 0
    total_new = 0
    count = 0

    patterns = [
        os.path.join(STATIC_DIR, 'images', '**', '*.jpg'),
        os.path.join(STATIC_DIR, 'images', '**', '*.jpeg'),
        os.path.join(STATIC_DIR, 'images', '**', '*.png'),
    ]

    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            if os.path.isfile(filepath):
                orig = os.path.getsize(filepath)
                compress_image(filepath)
                new = os.path.getsize(filepath)
                total_orig += orig
                total_new += new
                count += 1

    print(f"\nProcessed {count} images")
    print(f"Total: {total_orig/1024/1024:.2f}MB -> {total_new/1024/1024:.2f}MB")
    print(f"Saved: {(total_orig-total_new)/1024/1024:.2f}MB")


if __name__ == '__main__':
    main()
