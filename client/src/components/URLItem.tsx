import React from "react";
import { Url } from "./URLsList";
import log from '../utils/logger'

interface Props {
  children?: React.ReactChild | React.ReactNode;
  url: Url;
}

const UrlItem: React.FC<Props> = ({ children, url }) => {
  const [urlItem, setUrlItem] = React.useState<Url>(url);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(urlItem.shortUrl);
  };

  log("UrlItem Rendered");
  return (
    <div>
      <span>Long URL: {urlItem.longUrl}</span> |Short URL:
      <a href={urlItem.shortUrl} target="_blank" rel="noreferrer">
        {urlItem.shortUrl}
      </a>{" "}
      |<span>Count: {urlItem.count}</span>
    </div>
  );
};

export default UrlItem;
