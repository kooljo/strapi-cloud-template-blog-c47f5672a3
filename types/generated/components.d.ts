import type { Schema, Attribute } from '@strapi/strapi';

export interface FooterMenu extends Schema.Component {
  collectionName: 'components_footer_menus';
  info: {
    displayName: 'menu';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
  };
}

export interface FooterSecondaryMenu extends Schema.Component {
  collectionName: 'components_footer_secondary_menus';
  info: {
    displayName: 'secondaryMenu';
  };
  attributes: {
    title: Attribute.String;
    link: Attribute.String;
  };
}

export interface FooterSocialMenu extends Schema.Component {
  collectionName: 'components_footer_social_menus';
  info: {
    displayName: 'socialMenu';
  };
  attributes: {
    name: Attribute.Enumeration<
      ['Facebook', 'LInkedin', 'Youtube', 'Instagram', 'Twitter']
    >;
    link: Attribute.String;
  };
}

export interface SharedBannerButton extends Schema.Component {
  collectionName: 'components_shared_banner_buttons';
  info: {
    displayName: 'bannerButton';
  };
  attributes: {
    bannerButtonName: Attribute.String;
    bannerButtonLink: Attribute.String;
  };
}

export interface SharedMetacontent extends Schema.Component {
  collectionName: 'components_shared_metacontents';
  info: {
    displayName: 'metacontent';
    icon: 'apps';
  };
  attributes: {
    seoDescription: Attribute.Text;
    tweet: Attribute.Text;
    sharingImage: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    sharingDescription: Attribute.Text;
    title: Attribute.String;
    sectionReferrer: Attribute.Enumeration<
      ['About us', 'Commitments', 'Insights', 'Press', 'Investor', 'Careers']
    >;
    summary: Attribute.Text;
    summaryStructured: Attribute.Text;
  };
}

export interface SlicesCoverColorBackground extends Schema.Component {
  collectionName: 'components_slices_cover_color_backgrounds';
  info: {
    displayName: 'coverColorBackground';
  };
  attributes: {
    anchorId: Attribute.String;
    title: Attribute.String;
    subtitle: Attribute.String;
    shortTitle: Attribute.String;
    video: Attribute.Text & Attribute.CustomField<'plugin::oembed.oembed'>;
  };
}

export interface SlicesCoverTextOnly extends Schema.Component {
  collectionName: 'components_slices_cover_text_onlies';
  info: {
    displayName: 'coverTextOnly';
    icon: 'apps';
  };
  attributes: {
    anchorId: Attribute.String;
    title: Attribute.String;
    subtitle: Attribute.String;
    shortTitle: Attribute.String;
  };
}

export interface SlicesCover extends Schema.Component {
  collectionName: 'components_cover_covers';
  info: {
    displayName: 'cover';
    icon: 'apps';
    description: '';
  };
  attributes: {
    anchorId: Attribute.String;
    title: Attribute.String;
    subtitle: Attribute.String;
    shortTitle: Attribute.Text;
    banner: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    video: Attribute.Text & Attribute.CustomField<'plugin::oembed.oembed'>;
    backgroundVideoMp4: Attribute.String;
    backgroundVideoWebm: Attribute.String;
    bannerButton: Attribute.Component<'shared.banner-button', true>;
  };
}

export interface SlicesParagraph extends Schema.Component {
  collectionName: 'components_slices_paragraphs';
  info: {
    displayName: 'paragraph';
    icon: 'apps';
  };
  attributes: {
    anchorPoint: Attribute.String;
    text: Attribute.Blocks;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'footer.menu': FooterMenu;
      'footer.secondary-menu': FooterSecondaryMenu;
      'footer.social-menu': FooterSocialMenu;
      'shared.banner-button': SharedBannerButton;
      'shared.metacontent': SharedMetacontent;
      'slices.cover-color-background': SlicesCoverColorBackground;
      'slices.cover-text-only': SlicesCoverTextOnly;
      'slices.cover': SlicesCover;
      'slices.paragraph': SlicesParagraph;
    }
  }
}
