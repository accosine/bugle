import type { FC } from "react";
import type { LoaderFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";
import type { ConfigType } from "~/config.server";
import type { PageData } from "prismatic";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { marked } from "marked";
import { prisma as db } from "~/db.server";
import config from "~/config.server";
import { utf8_to_b64 } from "~/auxiliary";

type LoaderPageDataType = {
  page: PageData | null;
};

type LoaderJsonReturnType = PageData & { config: ConfigType };

export const meta: MetaFunction = ({ data }) => {
  const { title, description } = data || { title: "no title" };

  return {
    title,
    description,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  marked.setOptions({
    renderer: new marked.Renderer(),
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
  });

  const { slug = "" } = params;
  if (!slug) {
    return json({ page: null, config, title: "ladida" });
  }

  const b64Slug = utf8_to_b64(slug);

  const data: LoaderPageDataType =
    {
      page: await db.pageData.findUnique({
        where: {
          slugBase64: b64Slug,
        },
      }),
    } || {};

  const { page } = data;

  if (page === null) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const htmlMarkup = await marked.parse(page.content);
  return json<LoaderJsonReturnType>({ ...page, config, content: htmlMarkup });
};

const Page: FC = () => {
  const { content, config } = useLoaderData<LoaderJsonReturnType>();
  if (content === null || config === null) {
    return null;
  }
  return <div id="page" dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Page;
