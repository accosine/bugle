import type { FC } from "react";
import type { ConfigType } from "~/config.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { AmpConfig } from "~/components/Amp/types";
import type {
  AmpStoryData,
  AmpStoryPageData,
  AmpStoryGridLayerData,
  AmpMediaData,
} from "prismatic";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { prisma as db } from "~/db.server";
import AmpStory from "~/components/Amp/AmpStory";
import config from "~/config.server";
import { utf8_to_b64 } from "~/auxiliary";

export const meta: MetaFunction = ({
  data: {
    ampStory: { description, title },
  },
}) => {
  return {
    title,
    description,
  };
};

type AmpStoryLayerDataType = AmpStoryGridLayerData & {
  component: AmpMediaData[];
};

type AmpStoryPageDataType = AmpStoryPageData & {
  layers: AmpStoryLayerDataType[];
};

type AmpStoryDataType = AmpStoryData & { pages: AmpStoryPageDataType[] };

type LoaderStoryDataType = {
  ampStory: AmpStoryDataType | null;
};

type DecoratedLoaderStoryDataType = LoaderStoryDataType & {
  config: AmpConfig & ConfigType;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug = "" } = params;
  if (!slug) {
    return json({ ampStory: null, config });
  }

  const b64Slug = utf8_to_b64(slug);
  const data: LoaderStoryDataType =
    {
      ampStory: await db.ampStoryData.findFirst({
        where: {
          slugBase64: b64Slug,
        },
        include: {
          pages: {
            include: {
              layers: {
                include: { component: true },
              },
            },
          },
        },
      }),
    } || {};
  const { ampStory } = data;
  if (ampStory === null) {
    return json({ ampStory: null, config });
  }

  return json<DecoratedLoaderStoryDataType>({ ...data, config });
};

const Story: FC = () => {
  const { ampStory, config } = useLoaderData<DecoratedLoaderStoryDataType>();
  if (ampStory === null || config === null) {
    return null;
  }
  const { title = "", posterPortraitSrc = "", pages = [] } = ampStory;

  return (
    <AmpStory
      title={title}
      posterPortraitSrc={posterPortraitSrc}
      pages={pages}
      config={config}
    ></AmpStory>
  );
};

export default Story;
