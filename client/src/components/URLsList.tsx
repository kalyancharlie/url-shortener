import React, { useState, useEffect } from "react";
import UrlItem from "./URLItem";
import log from '../utils/logger';

interface Props {
  children?: React.ReactChild | React.ReactNode;
}

export interface Url {
  longUrl: string;
  shortUrl: string;
  count: number;

}

const UrlsList: React.FC<Props> = ({children}) => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  // Get Top URLs
  const getTopUrls = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/v1/popular");
      const json: {data: Url[]} = await response.json();
      if (!json) {
        throw new Error("No response from server");
      }
      setUrls(json.data);
    } catch (err) {
      log("Error getting top urls");
      log(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    console.log("PopularUrlsList Rendered");
    // getTopUrls();
  }, []);

  return (
    <div className="popular-urls-container">
      <h2>PopularUrlsList</h2>
      {loading ? <div>Loading...</div> : null}
      {urls.map((url: Url, ind: number) => {
        return <UrlItem key={ind} url={url} />;
      })}
    </div>
  );
};

export default UrlsList;
