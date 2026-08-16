# Periodic Table Practice v20 Hosted 

Interactive periodic-table learning game.

## GitHub Pages setup

Upload these files to the root of the repository:

- `index.html`
- `styles.css`
- `app.js`
- `settings.json`

Then in GitHub:

1. Open **Settings**
2. Select **Pages**
3. Under **Build and deployment**, choose **Deploy from a branch**
4. Select branch **main**
5. Select folder **/(root)**
6. Save

GitHub Pages will publish the site from the repository.

## Mode settings

The preset learning modes are controlled in `settings.json`.

Example:

```json
"beginner": {
  "tableColours": true,
  "elementColours": true,
  "atomicNumbers": true,
  "tooltips": true,
  "lockControls": true
}
```

- `tableColours`: colour the blank periodic table by category
- `elementColours`: colour element tiles by category
- `atomicNumbers`: show atomic numbers
- `tooltips`: enable element hover information
- `lockControls`: prevent the preset options being changed

`customDefaults` controls the starting values for Custom mode.

## Version

v20 is the first hosted/GitHub Pages version.
