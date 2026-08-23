"use client";

import { useState } from "react";
import { displayHost, hrefFor } from "@/lib/owner-display";

export function OwnerAvatar({
  name,
  image,
  color,
  url,
  size = 32,
}: {
  name: string;
  image?: string;
  color?: string;
  url?: string;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  const src = image && !broken ? image : "";
  const dim = `${size}px`;

  const mark = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      onError={() => setBroken(true)}
      className="shrink-0 rounded-lg object-cover"
      referrerPolicy="no-referrer"
      style={{ width: dim, height: dim }}
    />
  ) : url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${displayHost(url)}&sz=128`}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-lg bg-white object-cover"
      style={{ width: dim, height: dim }}
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg text-white"
      style={{ width: dim, height: dim, background: color || "#141414", fontSize: size * 0.4 }}
    >
      {(name || "?").slice(0, 1).toUpperCase()}
    </span>
  );

  if (!url) return mark;

  return (
    <a
      href={hrefFor(url)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title={`Visit ${displayHost(url)}`}
      className="shrink-0"
    >
      {mark}
    </a>
  );
}

export function OwnerLink({
  url,
  name,
  className = "",
}: {
  url?: string;
  name: string;
  className?: string;
}) {
  const label = url ? displayHost(url) || name : name;
  if (!url) {
    return <span className={className}>{label}</span>;
  }
  return (
    <a
      href={hrefFor(url)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`underline underline-offset-2 ${className}`}
    >
      {label}
    </a>
  );
}
