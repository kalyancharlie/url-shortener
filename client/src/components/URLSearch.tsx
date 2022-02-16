import React, { useEffect, useRef, useState } from "react";
import validUrl from "valid-url";
import log from "../utils/logger";
import { ThreeDots } from "react-loader-spinner";
import { MdOutlineContentCopy } from "react-icons/md";

interface Props {
  children?: React.ReactChild | React.ReactNode;
}

interface ShortenUrlAPIResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: { shortUrl: null | string };
}

interface Error {
  isError: boolean;
  message: string;
}

const SHORTEN_URL_ENDPOINT = "/api/v1/shorten";

const URLSearch: React.FC<Props> = ({ children }) => {
  const [longUrl, setLongUrl] = useState<string>("");
  const [outputLongUrl, setOutputLongUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>({
    isError: false,
    message: "Invalid URL",
  });
  const errorToast = useRef<HTMLDivElement>(null);
  const outputDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    log("URLSearch Rendered");
  });

  // Validate URL
  const validateUrl = (url: string): boolean => {
    try {
      return validUrl.isUri(url) ? true : false;
    } catch (err) {
      log("validation error");
      log(err);
      return false;
    }
  };

  // Copy to clipboard
  const copyToClipboard = (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      e.preventDefault();
      navigator.clipboard.writeText(shortUrl);
      // copy to clipboard
      // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
      
    } catch(e) {
      log("copy to clipboard error");
      log(e);
    }
  }


  // Get Short URL from API
  const getShortUrl = async (longUrl: string) => {
    try {
      setLoading(true);
      const response = await fetch(SHORTEN_URL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      });
      const json: ShortenUrlAPIResponse = await response.json();
      log(json);
      if (!json) {
        throw new Error("No response from server");
      }
      if (!json.status) {
        return setError({ ...error, isError: true, message: json.message });
      }
      if (!json.data.shortUrl) {
        return setError({
          ...error,
          isError: true,
          message: "Internal Server Error",
        });
      }
      setShortUrl(json.data.shortUrl);
      setError({ ...error, isError: false, message: "" });
      log('setting long url')
      setOutputLongUrl(longUrl)
      setLongUrl("");
    } catch (err) {
      log("get short url error");
      log(err);
      setError({ ...error, isError: true, message: "Failed to Shorten" });
    } finally {
      setLoading(false);
    }
  };

  // Toast Effect
  useEffect(() => {
    log("inside error check useffect")
    if(error.isError) {
    errorToast?.current?.classList?.remove?.("d-none");
    setTimeout(() => {
      errorToast?.current?.classList?.add?.("show-error-toast");
    }, 100)
      let interTime: NodeJS.Timeout;
      const timerId = setTimeout(() => {
        errorToast?.current?.classList?.remove?.("show-error-toast");
        interTime = setTimeout(() => {
          errorToast?.current?.classList?.add?.("d-none");
        }, 900);
      }, 5000);
      return () => {
        clearTimeout(interTime);
        clearTimeout(timerId);
      };
    }
    
  }, [error]);

  // Short Url Effect
  useEffect(() => {
    if(!shortUrl) return

  }, [shortUrl])

  // Handle Shorten URL
  const handleShortenUrl = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      if (!validateUrl(longUrl)) {
        return setError({ ...error, isError: true, message: "Invalid URL" });
      }
      getShortUrl(longUrl);
    } catch (err) {
      log("shorten url handler");
      log(err);
      setError({ ...error, isError: true, message: "Failed to Shorten" });
    }
  };
  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          className="search-input-url"
          type="text"
          placeholder="Enter URL to shorten"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setLongUrl(e.target.value);
          }}
        />
        <button onClick={handleShortenUrl} className="btn-grad search-btn">
          {loading ? (
            <ThreeDots
              height="17"
              width="35"
              color="#15184d"
              ariaLabel="loading"
            />
          ) : (
            "Shorten"
          )}
        </button>
      </div>
      <div className="search-output-container">
        <div
          className="search-error-container d-none"
          ref={errorToast}
        >
          {error.isError && <p>{error.message}</p>}
        </div>
        <div className={shortUrl ? 'search-output' : 'search-output d-none'}>
            <div className="search-output-contents">
              <div className="long-url-container" title={outputLongUrl}>
                <p className="long-url">{outputLongUrl}</p>
              </div>
              <div className="short-url-container" title="Your shortened URL">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="short-url"
                >
                  {shortUrl}
                </a>
              </div>
              <div
                title="Click to copy the Short URL"
                className="copy-icon-container"
                onClick={copyToClipboard}
              >
                <MdOutlineContentCopy className="copy-icon" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default URLSearch;
