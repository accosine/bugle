// TODO: better types
export {};

interface AmpStoryPlayer {
  style?: object;
  children: any;
}

interface AmpImg {
  alt: string;
  src: string;
  width?: string;
  height?: string;
  layout: string;
}

interface AmpVideo {
  width: string;
  height: string;
  layout: string;
  poster: string;
  children: any;
  autoplay: string;
}

interface AmpStory {
  standalone: string;
  title: string;
  publisher: string;
  "publisher-logo-src": string;
  "poster-portrait-src": string;
  children: any;
}

interface AmpStoryPage {
  id: string;
  children: any;
}

interface AmpStoryGridLayer {
  template: "fill" | "vertical" | "horizontal" | "thirds";
  children: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "amp-img": AmpImg;
      "amp-video": AmpVideo;
      "amp-story": AmpStory;
      "amp-story-grid-layer": AmpStoryGridLayer;
      "amp-story-page": AmpStoryPage;
      "amp-story-player": AmpStoryPlayer;
    }
  }
}
