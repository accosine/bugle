import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { ConfigType } from "~/config.server";
import type { AmpStoryData } from "prismatic";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import config from "~/config.server";
import { prisma as db } from "~/db.server";

type LoaderStoryDataType = {
  ampStories: AmpStoryData[] | null;
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://cdn.ampproject.org/amp-story-player-v0.css",
    },
  ];
};

export const loader: LoaderFunction = async () => {
  const ampStories = await db.ampStoryData.findMany({
    take: 5,
    select: {
      slugOriginal: true,
      poster: true,
    },
    orderBy: {
      dateCreated: "desc",
    },
  });
  return json({ ...config, ampStories });
};

export default function Index() {
  const { ampStories, imageDir, mediaPath } = useLoaderData<
    ConfigType & LoaderStoryDataType
  >();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.ampproject.org/amp-story-player-v0.js";
    script.async = true;
    script.onload = () => {
      const player = document.querySelector("amp-story-player");
      // @ts-ignore: Ignore for the time being
      if (player?.isReady) {
        console.log('Player is "isReady"!');
      }
    };
    document.body.appendChild(script);
  }, []);

  const playerConfig =
    '{ "display": { "attribution": "auto" }, "behavior": { "autoplay": true, "pageScroll": false },"controls": [ { "name": "skip-to-next" } ]}';

  return (
    <amp-story-player
      style={{
        layout: "responsive",
        width: "100%",
        height: "100%",
      }}
    >
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: `${playerConfig}`,
        }}
      />
      {ampStories ? (
        ampStories.map((story) => (
          <a href={`/story/${story.slugOriginal}`} key={story.slugOriginal}>
            <img
              data-amp-story-player-poster-img
              src={`//${mediaPath}/${imageDir}/${story.poster}`}
              width="370"
              height="622"
              loading="lazy"
              alt="bla"
            />
          </a>
        ))
      ) : (
        <p>No Stories available</p>
      )}
    </amp-story-player>
  );
}
