"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

import Image from "next/image";

type SharedProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

type FillProps = SharedProps & {
  fill: true;
  width?: never;
  height?: never;
};

type FixedSizeProps = SharedProps & {
  fill?: false;
  width: number;
  height: number;
};

type CommerceImageProps = FillProps | FixedSizeProps;

function isRemoteImage(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export default function CommerceImage(props: CommerceImageProps) {
  const { src, alt, className, priority } = props;

  if (isRemoteImage(src)) {
    if (props.fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        width={props.width}
        height={props.height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }

  return <Image {...props} />;
}
