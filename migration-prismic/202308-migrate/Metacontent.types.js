import { imageSize } from "./variables";

export const seoDescription = {
  type: "Text",
  config: {
    label: "SEO Description",
    placeholder: "SEO Description",
  },
};
export const tweet = {
  type: "Text",
  fieldset: "Social network sharing",
  config: {
    placeholder: "Tweet",
    label: "Tweet (use #AXA in your sharing text)",
  },
};
export const sharingImage = {
  type: "Image",
  fieldset: `Sharing Image (${imageSize.desktopWidth}x${imageSize.desktopHeight})`,
  config: {
    placeholder: `${imageSize.desktopWidth}x${imageSize.desktopHeight}`,
    constraint: {
      width: imageSize.desktopWidth,
      height: imageSize.desktopHeight,
    },
  },
};
export const sharingDescription = {
  type: "Text",
  fieldset: "Sharing Description",
  config: {
    placeholder: "Sharing Description",
    label: "Sharing Description",
  },
};
export const title = {
  type: "Text",
  fieldset: "Main info of your page",
  config: {
    placeholder: "Your title",
    label: "Title",
  },
};
export const sectionReferrer = {
  type: "Select",
  config: {
    options: [
      "About us",
      "Commitments",
      "Insights",
      "Press",
      "Investor",
      "Careers",
    ],
    label: "Referrer",
    placeholder: "Choose your referrer",
  },
};
export const summary = {
  type: "Text",
  config: {
    label: "Summary",
    placeholder: "Your summary",
  },
};
export const summaryStructured = {
  type: "StructuredText",
  config: {
    label: "Summary video banner",
    placeholder: "Enter the video banner summary",
  },
};

export const metaContentFields = {
  seoDescription,
  tweet,
  sharingImage,
  sharingDescription,
  title,
  sectionReferrer,
  summary,
  summaryStructured,
};

export const getMetaContent = (
  fields = [
    "seoDescription",
    "tweet",
    "sharingImage",
    "sharingDescription",
    "title",
    "sectionReferrer",
    "summary",
    "summaryStructured",
  ]
) => ({
  $metaContent: {
    type: "Group",
    config: {
      repeat: false,
      fields: fields.reduce(
        (res, field) => ({ ...res, [field]: metaContentFields[field] }),
        {}
      ),
    },
  },
});
