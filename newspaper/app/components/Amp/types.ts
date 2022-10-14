export type AmpMediaType = {
  height: number;
  width: number;
  poster: string;
  src: string;
  type: string;
};

export type AmpStoryLayerType = {
  template: "fill" | "vertical" | "horizontal" | "thirds";
  gridArea: "middleThird" | "lowerThird" | "upperThird" | null;
  component: AmpMediaType[];
};

export type AmpStoryPageType = {
  id: number;
  autoAdvanceAfter: string | null;
  backgroundAudio: string | null;
  layers: AmpStoryLayerType[];
};

export type AmpStoryType = {
  posterPortraitSrc: string;
  title: string;
  pages: AmpStoryPageType[];
};

export type AmpConfig = {
  publisher: string;
  publisherLogo: string;
  mediaPath: string;
  imageDir: string;
  videoDir: string;
};
