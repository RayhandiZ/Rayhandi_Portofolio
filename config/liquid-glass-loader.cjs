/* Build-time edits to @zakisheriff/liquid-glass, applied by Turbopack (see next.config.ts). The files in
   node_modules stay as published. The package is pinned to one version in package.json: if an edit stops
   matching after an upgrade, the build fails here rather than quietly shipping the defaults these replace. */

const EDITS = [
  {
    // Lens tracks (GlassNav, GlassSegmented) without dispersion: the rim stays white and labels under a
    // dragged lens get no magenta and green fringes.
    name: "lens dispersion",
    from: 'zoom, dispersion: 1, copy: "refract", copyOnly: true',
    to: 'zoom, dispersion: 0, copy: "refract", copyOnly: true',
  },
  {
    // A dragged lens stops centred on the first and last item instead of rubber-banding past them.
    name: "lens overshoot",
    from: /const give = Math\.min\(14, slot \* 0\.12\);\s*if \(raw < 0\) return rubberband\(raw, give, 0\.55\);\s*if \(raw > max\) return max \+ rubberband\(raw - max, give, 0\.55\);/,
    to: "if (raw < 0) return 0;\n      if (raw > max) return max;",
  },
];

module.exports = function liquidGlassLoader(source) {
  let output = String(source);
  for (const { name, from, to } of EDITS) {
    const edited = output.replace(from, to);
    if (edited === output)
      throw new Error(
        `liquid-glass-loader: the "${name}" edit no longer matches ${this.resourcePath}. ` +
          "Check config/liquid-glass-loader.cjs against the installed @zakisheriff/liquid-glass.",
      );
    output = edited;
  }
  return output;
};
