// EDIT THE HOME PAGE HERE. No layout or rendering code is needed.
// Change these fields to update the banner shown on the hub.
export const banner = {
  label: 'THE GASHER COLLECTION',
  headline: 'Good stuff.',
  highlight: 'No big plan.',
  description: 'Games, useful links, and a few things worth clicking around for.',
  buttonText: 'BROWSE GAMES',
  buttonLink: '#games'
};

// Add a card by copying an object and editing its values.
// category must be: games, media, tools, or social.
// Use page for an internal hub page, or url for an external link.
export const items = [
  { title: 'Games Portal', desc: 'Classic web arcade games collection', icon: 'fa-gamepad', color: '#00f7ff', category: 'games', badge: 'Popular', page: 'games' },
  { title: 'Top Popular', desc: 'Most played community favorites', icon: 'fa-fire-flame-curved', color: '#ff6c75', category: 'games', badge: 'Trending', page: 'popular', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/popular-gameseeewf' },
  { title: 'Online Arena', desc: 'Multiplayer games with friends', icon: 'fa-vr-cardboard', color: '#ffab40', category: 'games', page: 'online-arena', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/online-games' },
  { title: 'Movie Section', desc: 'Stream movies and shows together', icon: 'fa-clapperboard', color: '#ff5c9a', category: 'media', page: 'movie-section', maintenance: true, url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/movie-section' },
  { title: 'Soundboard', desc: 'Sound effects, clips & sound bytes', icon: 'fa-sliders', color: '#e080fa', category: 'media', page: 'soundboard', maintenance: true, url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/soundboard' },
  { title: 'Secure Proxy', desc: 'Unfiltered web browsing portal', icon: 'fa-shield-halved', color: '#69f0ae', category: 'tools', page: 'secure-proxy', maintenance: true, url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/proxies' },
  { title: 'Newsletter', desc: 'Dev news, updates & site releases', icon: 'fa-newspaper', color: '#64ffda', category: 'tools', page: 'newsletter', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/news-4-9' },
  { title: 'Support Center', desc: 'Report issues, bugs & game requests', icon: 'fa-headset', color: '#69a7ff', category: 'social', page: 'support-center', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/supportreport' },
  { title: 'Community Chat', desc: 'Hang out and chat live with peers', icon: 'fa-comments', color: '#18ffff', category: 'social', page: 'community-chat', maintenance: true, url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/chat' },
  { title: 'Rate Us', desc: 'Submit site reviews and ratings', icon: 'fa-star', color: '#ffd166', category: 'social', page: 'rate-us', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/rate-us' },
  { title: 'Credits', desc: 'Special thanks to creators & staff', icon: 'fa-code-branch', color: '#ff8a65', category: 'social', page: 'credits', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/credits' },
  { title: 'Shopping Links', desc: 'Deals, merch & online shop directory', icon: 'fa-bag-shopping', color: '#ff6c75', category: 'tools', page: 'shopping-links', maintenance: true, url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/shopping-links' },
  { title: 'Miscellaneous', desc: 'Random apps, easter eggs & extras', icon: 'fa-cubes', color: '#a7ffeb', category: 'tools', page: 'miscellaneous', url: 'https://sites.google.com/4j.lane.edu/gashergamesedu-17/miscellaneous' }
];
