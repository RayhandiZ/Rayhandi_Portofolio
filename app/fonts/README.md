# Fonts

Both faces are under the SIL Open Font License; the licence texts are next to them. Neither declares a Reserved Font Name, so the trimmed file keeps its name.

- `plus-jakarta-sans.woff2`: Plus Jakarta Sans, variable weight 200–800.
- `cormorant-italic.woff2`: Cormorant Garamond Italic 500, trimmed to the Latin range Google Fonts uses for its "latin" subset (Basic Latin, Latin-1, common punctuation and symbols). Cyrillic, Greek, and Vietnamese glyphs are left out. All OpenType features and the name table are kept; hinting is dropped. 21 KB, against 95 KB for the full TTF it was cut from.

To cut it again from the full font (Cormorant Garamond Italic from github.com/CatharsisFonts/Cormorant), with `fonttools` and `brotli` installed:

```sh
pyftsubset CormorantGaramond-MediumItalic.ttf \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --layout-features='*' --name-IDs='*' --name-languages='*' --no-hinting --flavor=woff2 \
  --output-file=cormorant-italic.woff2
```

A character outside that range (for example Cyrillic) falls back to Georgia.

## Share-image copies (`og/`)

`next/og`, which draws the link preview image in `lib/og-image.tsx`, reads TTF, OTF and WOFF but not WOFF2. `og/` holds TTF copies of the two files above, cut to the same Latin range with hinting dropped. The licence texts in this folder cover them too.

- `plus-jakarta-sans-600.ttf` and `plus-jakarta-sans-800.ttf`: static instances of the variable font at weights 600 and 800, 27 KB each.
- `cormorant-italic.ttf`: `cormorant-italic.woff2` as TTF, 70 KB.

To make them again from this folder, with `fonttools` and `brotli` installed:

```python
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

LATIN = "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"

def save(font, path):
    options = subset.Options()
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.hinting = False
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes(LATIN))
    subsetter.subset(font)
    font.flavor = None
    font.save(path)

for weight in (600, 800):
    font = instancer.instantiateVariableFont(TTFont("plus-jakarta-sans.woff2"), {"wght": weight})
    font["OS/2"].usWeightClass = weight
    save(font, f"og/plus-jakarta-sans-{weight}.ttf")
save(TTFont("cormorant-italic.woff2"), "og/cormorant-italic.ttf")
```
