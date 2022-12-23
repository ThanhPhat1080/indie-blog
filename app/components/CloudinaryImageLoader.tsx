import * as React from "react";
import type { ClientLoader, ImagePosition } from "remix-image";
import Image from "remix-image";
import ROUTERS from "~/constants/routers";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

const numberToHex = (num: number): string =>
  ("0" + Number(num).toString(16)).slice(-2).toUpperCase();
const positionMap: Record<ImagePosition, string> = {
  "center bottom": "south",
  "center center": "center",
  "center top": "north",
  "left bottom": "south_west",
  "left center": "west",
  "left top": "north_west",
  "right bottom": "south_east",
  "right center": "east",
  "right top": "north_east",
  bottom: "south",
  center: "center",
  left: "west",
  right: "east",
  top: "north",
};

const cloudinaryLoader: ClientLoader = (src, loaderUrl, loaderOptions) => {
  const params = [];

  if (loaderOptions.background) {
    params.push(
      `b_rgb:${
        numberToHex(loaderOptions.background[0]) +
        numberToHex(loaderOptions.background[1]) +
        numberToHex(loaderOptions.background[2]) +
        numberToHex(loaderOptions.background[3])
      }`
    );
  }

  if (loaderOptions.crop) {
    params.push(`c_crop`);
    params.push(`g_north_west`);
    params.push(`h_${loaderOptions.crop.height}`);
    params.push(`w_${loaderOptions.crop.width}`);
    params.push(`x_${loaderOptions.crop.x}`);
    params.push(`y_${loaderOptions.crop.y}`);
  }

  if (loaderOptions.rotate) {
    params.push(`a_${loaderOptions.rotate}`);
  }

  if (loaderOptions.blurRadius) {
    params.push(`e_blur:${loaderOptions.blurRadius}`);
  }

  if (loaderOptions.fit === "outside") {
    params.push("c_fit");

    if (loaderOptions.width && loaderOptions.height) {
      params.push(`w_${Math.max(loaderOptions.width, loaderOptions.height)}`);
      params.push(`h_${Math.max(loaderOptions.width, loaderOptions.height)}`);
    } else if (loaderOptions.width) {
      params.push(`w_${loaderOptions.width}`);
    } else if (loaderOptions.height) {
      params.push(`h_${loaderOptions.height}`);
    }
  } else {
    if (loaderOptions.fit === "contain") {
      params.push("c_pad");
    } else if (loaderOptions.fit === "cover") {
      params.push("c_fill");
    } else if (loaderOptions.fit === "fill") {
      params.push("c_scale");
    } else if (loaderOptions.fit === "inside") {
      params.push("c_fit");
    }

    if (loaderOptions.width) {
      params.push(`w_${loaderOptions.width}`);
    }

    if (loaderOptions.height) {
      params.push(`h_${loaderOptions.height}`);
    }
  }

  if (loaderOptions.position) {
    params.push(
      `g_${positionMap[loaderOptions.position as ImagePosition] || "center"}`
    );
  }

  params.push(`q_${loaderOptions.quality || "auto"}`);

  if (loaderOptions.contentType) {
    params.push(
      "f_",
      loaderOptions.contentType.replace("image/", "").replace("jpeg", "jpg")
    );
  } else {
    params.push("f_auto");
  }

  const paramsString = params.join(",") + "/";
  return `${loaderUrl}${paramsString}${normalizeSrc(src)}`;
};

type typeResponsive = {
  size: {
    width: number;
    height?: number;
  };
  maxWidth?: number;
}[];

type propsType = {
  alt: string;
  src: string;
  options?: object;
  responsive?: typeResponsive;
  width?: string;
  height?: string;
  className?: string;
};

export const CloudinaryImageLoader = ({
  alt,
  src,
  options,
  responsive = [],
  width = "",
  height = "",
  className,
}: propsType) => {

  return (
    <div
      className="relative inline-flex"
      style={{ backgroundColor: "#ddd", width: "100%", height: "100%" }}
    >
      <div className="absolute-center z-0">
        <svg
          className="h-8 w-8 animate-spin text-slate-600 "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      <Image
        alt={alt}
        src={src}
        loaderUrl={ROUTERS.LOADER_CLOUDINARY_IMAGE}
        loader={cloudinaryLoader}
        options={options}
        responsive={responsive}
        width={width}
        height={height}
        className={className}
        style={{ minHeight: "100%", minWidth: "100%", zIndex: 1 }}
      />
    </div>
  );
};

export default React.memo(CloudinaryImageLoader);
