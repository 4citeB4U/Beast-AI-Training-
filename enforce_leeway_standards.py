import os
import datetime

HEADER_TEMPLATE = """/*
LEEWAY HEADER — DO NOT REMOVE

REGION: {region}
TAG: {tag}

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph={glyph}

5WH:
WHAT = {what}
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = {where}
WHEN = {when}
HOW = Autonomous Agent Engineering

AGENTS:
VECTOR
ARIA
WARD
GOVERNOR

LICENSE:
MIT
*/

"""

def get_metadata(filepath, filename):
    region = "PRODUCT.BEAST.UNKNOWN"
    tag = "UI.BEAST.UNKNOWN"
    glyph = "file"
    what = f"BEAST AI Component: {filename}"

    if 'views' in filepath:
        region = "PRODUCT.BEAST.VIEW"
        tag = f"UI.BEAST.VIEW.{filename.upper().replace('.TSX', '')}"
        glyph = "layout"
    elif 'components' in filepath:
        region = "PRODUCT.BEAST.COMPONENT"
        tag = f"UI.BEAST.COMPONENT.{filename.upper().replace('.TSX', '')}"
        glyph = "component"
    elif 'services' in filepath:
        region = "AI.BEAST.SERVICE"
        tag = f"AI.BEAST.SERVICE.{filename.upper().replace('.TS', '')}"
        glyph = "cpu"
    elif 'types' in filepath:
        region = "CORE.BEAST.TYPES"
        tag = "CORE.BEAST.SCHEMA"
        glyph = "database"
    
    return region, tag, glyph, what

def process_files():
    src_dir = r"d:\beast-ai-learning\src"
    now = datetime.datetime.now().strftime("%Y-%m-%d")
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if "LEEWAY HEADER" in content:
                    continue
                
                rel_path = os.path.relpath(filepath, r"d:\beast-ai-learning")
                region, tag, glyph, what = get_metadata(rel_path, file)
                
                header = HEADER_TEMPLATE.format(
                    region=region,
                    tag=tag,
                    glyph=glyph,
                    what=what,
                    where=rel_path.replace('\\', '/'),
                    when=now
                )
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(header + content)
                print(f"Applied Leeway Standard to: {rel_path}")

if __name__ == "__main__":
    process_files()
