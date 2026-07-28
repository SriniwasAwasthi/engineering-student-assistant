import os
import shutil
from PIL import Image, ImageDraw

def circular_crop(img):
    img = img.convert("RGBA")
    size = img.size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size[0], size[1]), fill=255)
    result = Image.new("RGBA", size, (0, 0, 0, 0))
    result.paste(img, (0, 0), mask=mask)
    return result

def make_adaptive_foreground(img, canvas_size):
    logo_size = int(canvas_size * 0.68)  # Fits nicely in the safe zone
    resized_logo = img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    round_logo = circular_crop(resized_logo)
    
    foreground = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    offset = (canvas_size - logo_size) // 2
    foreground.paste(round_logo, (offset, offset), mask=round_logo)
    return foreground

def main():
    src_path = r"C:\Users\sriaw\.gemini\antigravity-ide\brain\9e374216-2e22-4e20-8603-7b3144fd5eaf\media__1781930593127.jpg"
    workspace_src = r"e:\W c One Drive\ENgg\src\assets\app-icon.jpg"
    
    # 1. Copy source to workspace assets
    os.makedirs(os.path.dirname(workspace_src), exist_ok=True)
    shutil.copy2(src_path, workspace_src)
    print(f"Copied source icon to {workspace_src}")
    
    # 2. Open source image
    img = Image.open(workspace_src)
    
    res_path = r"e:\W c One Drive\ENgg\android\app\src\main\res"
    
    if not os.path.exists(res_path):
        print("Error: Android res folder not found. Ensure 'npx cap add android' has completed.")
        return
        
    # Mipmap densities and sizes
    # Format: folder: (legacy_size, adaptive_canvas_size)
    densities = {
        "mipmap-mdpi": (48, 108),
        "mipmap-hdpi": (72, 162),
        "mipmap-xhdpi": (96, 216),
        "mipmap-xxhdpi": (144, 324),
        "mipmap-xxxhdpi": (192, 432)
    }
    
    for folder, (legacy_size, adaptive_size) in densities.items():
        folder_path = os.path.join(res_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # Legacy square launcher icon
        resized_legacy = img.resize((legacy_size, legacy_size), Image.Resampling.LANCZOS)
        resized_legacy.save(os.path.join(folder_path, "ic_launcher.png"), "PNG")
        
        # Legacy circular launcher icon
        round_legacy = circular_crop(resized_legacy)
        round_legacy.save(os.path.join(folder_path, "ic_launcher_round.png"), "PNG")
        
        # Adaptive foreground launcher icon
        foreground = make_adaptive_foreground(img, adaptive_size)
        foreground.save(os.path.join(folder_path, "ic_launcher_foreground.png"), "PNG")
        
        print(f"Generated icons for {folder}: legacy={legacy_size}px, adaptive={adaptive_size}px")
        
    # 3. Update adaptive background color
    bg_xml_path = os.path.join(res_path, "values", "ic_launcher_background.xml")
    if os.path.exists(bg_xml_path):
        # Set to dark background to match the dark outer sphere of the icon
        bg_content = """<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#050505</color>
</resources>
"""
        with open(bg_xml_path, "w", encoding="utf-8") as f:
            f.write(bg_content)
        print("Updated ic_launcher_background.xml to dark color (#050505)")

if __name__ == "__main__":
    main()
