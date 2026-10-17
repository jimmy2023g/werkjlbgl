# Editing the hub

The homepage banner and collection cards are managed in [`site-content.js`](site-content.js). Edit the values there to change the banner or add a card; the hub layout and rendering code do not need edits. The in-site Settings page includes the quick steps and a card example.

Cards support a title, description (`desc`), Font Awesome icon, accent color, and category (`games`, `media`, `tools`, or `social`). Use `url` for an external destination, or `page` for an internal hub view. For example:

```js
{ title: "New Card", desc: "What it links to", icon: "fa-star", color: "#d8ef70", category: "tools", url: "https://example.com" }
```

## Adding a game

Game tiles are listed separately in [`games.js`](games.js). To add a game, copy its HTML file into the project, then add one entry to the `games` array.

### A single HTML file

Put the file in `games/`, then add:

```js
{ title: "My Game", url: "games/my-game.html", icon: "fa-gamepad", color: "#65e8d0" }
```

### A game with its own files

Put the files together, with the game's entry file named `index.html`:

```text
games/my-game/
  index.html
  style.css
  game.js
  assets/
```

Then use `url: "games/my-game/index.html"`. Keep the game's CSS, scripts, and images in that folder and use relative paths from its `index.html`.

Optional tile details: `image` sets a thumbnail and `featured: true` includes the game in the Featured filter. Local files open in the hub tab; `https://` links open in a new tab.
