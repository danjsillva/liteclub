"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { transpose } from "chord-transposer";
import classNames from "classnames";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [originalKey, setOriginalKey] = useState<string>("");
  const [currentKey, setCurrentKey] = useState<string>("");

  const keys = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "F#",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("u")) {
      setUrl(params.get("u"));
    }
  }, []);

  useEffect(() => {
    if (url) {
      getData(url);
    }
  }, [url]);

  const getData = async (url: string) => {
    const response = await axios.get(
      "/api/cifraclub?u=" +
        encodeURIComponent(url + "#tabs=false&footerChords=false"),
    );

    const data = response.data;
    const cifraClubDocument = document.createElement("html");

    cifraClubDocument.innerHTML = data;

    const title = cifraClubDocument.querySelector("title");
    const element = cifraClubDocument.querySelector("pre");

    if (!title || !element) {
      return;
    }

    document.title = title.textContent;

    const key = transpose(element.outerHTML).getKey().description;

    setOriginalKey(key);
    setCurrentKey(key);
    setTitle(title.textContent);
    setHtml(element.outerHTML);
  };

  async function changeToneTo(key: string) {
    const element = document.querySelector("pre");

    if (!element) {
      return;
    }

    const temp = transpose(element.textContent)
      .toKey(key)
      .tokens.map((token) =>
        token.map((line) =>
          typeof line === "object" ? `<b>${line.toString()}</b>` : line,
        ),
      );

    const teste = transpose(temp);

    element.innerHTML = teste;

    setCurrentKey(key);
  }

  return (
    <main className="px-5 py-10">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-5 py-3 bg-zinc-800"
      />

      <h1 className="text-3xl font-bold mt-5">{title}</h1>

      <section className="flex flex-wrap gap-1 mt-5">
        {keys.map((key: string) => (
          <button
            key={key}
            onClick={(e) => changeToneTo(key)}
            className={classNames("w-12 h-12 bg-zinc-800", {
              "bg-zinc-100 text-zinc-900": key === currentKey,
            })}
          >
            {key}
          </button>
        ))}
      </section>

      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className={classNames("mt-5")}
      ></div>
    </main>
  );
}
