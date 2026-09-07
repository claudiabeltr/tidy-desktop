# tidy-desktop

A lightweight desktop widget that lets you scatter customizable sticky notes across your screen. Built with Electron, HTML, CSS, and JavaScript — each note is an independent, borderless, always-on-top window with persistent storage.

## Download

Get the latest version from the [Releases page](https://github.com/claudiabeltr/tidy-desktop/releases).

> Windows SmartScreen may show a warning since this app isn't code-signed. Click **"More info" → "Run anyway"** to proceed

## Roadmap

### Phase 0:
- [x] Initial post-it design
- [x] Github repository created
- [x] Base Electron project structure

### Phase 1: Functional post-it
- [x] Borderless, transparent post-it window
- [x] Editable post-it: type text
- [x] Drag post-it around the screen
- [x] Close/delete an individual post-it

### Phase 2: Persistence
- [x] Save each post-it's content and position on app close
- [x] Restore all post-its on app launch
- [x] Auto-save changes, NO manual save

### Phase 3: User experience
- [x] Post-it menu
- [x] Resize post-it/sticker

### Phase 4: Distribution
- [x] App icon and branding
- [x] Package the app: electron-builder or electron-forge
- [x] Windows instaler .exe

### Future ideas (backlog)
- [ ] Linux build (AppImage / .deb)
- [ ] Multi-monitor support
- [ ] Customizable keyboard shortcuts
- [ ] Themes / skins for post-its
- [ ] Export/import notes