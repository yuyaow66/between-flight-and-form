# between-flight-and-form

Static website migrated from the owner’s Cargo site. Publish main branch / (root) with GitHub Pages. No build step required.

Edit the HTML files and styles.css directly. Assets are stored locally. The title uses self-hosted Nanum Pen; body text uses self-hosted PP Grafier. Font files are in assets/fonts, with CSS variables at the top of styles.css. Nanum Pen’s OFL license is included. PP Grafier is the original user-uploaded webfont; retain your applicable webfont license for publication.

The pigeon animation and its interaction instructions are removed. Original project text and images are retained; the former animation-description paragraph is omitted.

## Fish interaction

The home page uses the owner's isolated watercolor fish in `assets/fish.webp`, rendered from the editable vector master in the sibling `fish-vector` folder. Click the fish (or focus it and press Enter/Space) three times to separate it into four parts. Start again resets it. The knife is an inline SVG in index.html; layout and timing are in styles.css and site.js. Reduced-motion preferences are respected.
