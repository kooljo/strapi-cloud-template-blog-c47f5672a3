import { metaContentFields } from "./Metacontent.types";

/** Convert to new meta-content group */
export function withMetaContent(content, lang) {
  return {
    [`metaContent_${lang}`]: [
      Object.keys(metaContentFields).reduce(
        (res, field) => ({
          ...res,
          ...(content[`${field}_${lang}`]
            ? {
                [field]: content[`${field}_${lang}`],
              }
            : {}),
        }),
        {}
      ),
    ],
  };
}

/** Convert to new cover slice */
export function withCoverSlice(content, lang) {
  let cover = {
    key: "coverTextOnly",
    value: {
      "non-repeat": {
        anchorId: content[`anchors_${lang}`]?.anchorsId,
        title: content[`title_${lang}`],
        subtitle: content[`summary_${lang}`],
      },
    },
  };

  if (content[`banner_${lang}`] || content["banner_en"]) {
    cover = {
      key: "cover",
      value: {
        repeat: [
          {
            bannerButtonName: content[`bannerButtonName_${lang}`],
            bannerButtonLink: content[`bannerButtonLink_${lang}`],
          },
        ],
        "non-repeat": {
          anchorId: content[`anchors_${lang}`]?.anchorsId,
          title: content[`title_${lang}`],
          subtitle: content[`summary_${lang}`],
          video: content[`video_${lang}`],
          banner: content[`banner_${lang}`] || content["banner_en"],
        },
      },
    };
  }

  return cover;
}

/** Convert to new slice */
export function withGenericSlice(slice) {
  const { key, ...rest } = slice;
  if (key.split("$")[0] === "ctaBlock") {
    return {
      key: key.split("$")[0],
      value: {
        repeat: [],
        "non-repeat": { ...rest.value?.[0] },
      },
    };
  }
  return { key: key.split("$")[0], ...rest };
}
