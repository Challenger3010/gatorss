import { XMLParser } from "fast-xml-parser";
import { exit } from "node:process";

type RSSFeed = {
  rss: {
    channel: {
      title: string;
      link: string;
      description: string;
      item: RSSItem[];
    };
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedUrl: string) {
  const response = await fetch(feedUrl, {
    method: "GET",
    headers: {
      "User-Agent": "gatorss",
    },
  });

  if (!response.ok) {
    console.log("Something went wrong");
    process.exit(1);
  }

  let text = await response.text();

  let parser = new XMLParser();
  let parsedText: RSSFeed = parser.parse(text);

  if (!parsedText.rss.channel) {
    throw new Error("Channel is missing");
  }

  let channel = parsedText.rss.channel;
  let { title, link, description } = channel;

  if (!channel.item) {
    throw new Error("Items are missing");
  }
  let items: RSSItem[] | [];

  if (Array.isArray(channel.item)) {
    items = channel.item;
  } else {
    items = [];
  }
  let res = [];

  for (const item of items) {
    if (!item.title && !item.description && !item.link && !item.pubDate) {
      continue;
    }

    let { title, description, link, pubDate } = item;

    res.push({
      title: title,
      description: description,
      link: link,
      pubDate: pubDate,
    });
  }

  let newFeed: RSSFeed = {
    rss: {
      channel: {
        title: title,
        description: description,
        link: link,
        item: res,
      },
    },
  };

  return newFeed;
}
