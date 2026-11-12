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
