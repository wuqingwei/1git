---
"@1git/gpuix": minor
---

Add an initial Linux port: build the patched GPUIX addon on Linux, open browsers and files with xdg-open, copy with wl-copy/xclip/xsel, prompt SSH host trust and passwords with zenity, and package a self-contained Linux tarball with `bun run package:linux`. Five macOS-only native methods are moved to a macOS-only impl block on Linux so the addon compiles there; on Linux those features fall back through the existing renderer guards. Command-only shortcuts now accept Control on Linux: workspace shortcuts (Cmd+P/O/R/W/1-9 and arrows), repository filter (Cmd+F), quick-switcher close (Cmd+P), commit submit (Cmd+Enter), and Cmd-click multiselect toggle, with shortcut labels showing Ctrl off macOS. macOS behaviour is unchanged.
