/**
 * Nexyyra Events — hand-maintained image curation.
 *
 * `npm run media:sync` rebuilds `brand-images.generated.ts` from Google Drive,
 * but it knows nothing about what is IN a photo. This file is the layer that
 * does: every Drive photo is keyed by its Drive file ID (the `<id>` in
 * `https://lh3.googleusercontent.com/d/<id>=w1920`) with descriptive alt text,
 * the roles it can play on the site, a 1–5 quality score, a focal point for
 * `object-position`, and where text can safely sit over it. It survives
 * media:sync untouched because the sync never writes here — it only reads.
 *
 * Two layers live here:
 *  1. `IMAGE_CURATION_SOURCE` — the hand-written notes per photo (alt, scene,
 *     quality, focal string, faces, near-duplicates). Legacy helpers
 *     (`curatedIds`, `curationFor`, …) read this and feed `media:regen`.
 *  2. The V6 contract (`CurationAsset`, `IMAGE_CURATION`, `assetsByRole`, …)
 *     at the bottom — derived from layer 1 plus the V6 role table, captions
 *     and the cover exports that `npm run media:covers` writes back here.
 *
 * Adding a photo: upload it to Drive, run `npm run media:sync`, copy the file
 * ID from the new URL in `public/media-manifest.json`, add an entry to
 * `IMAGE_CURATION_SOURCE` and `DRIVE_FILES` (alt must describe the picture and
 * claim nothing about clients, venues by name, or cities), give it a caption
 * in `V6_NOTES`, then run `npm run media:regen` (legacy map) and, if it holds
 * a cover role, `npm run media:covers`. Photos without an entry still work —
 * they fall back to the folder-based picks and a generic alt — they just
 * never win a curated slot.
 */

export const IMAGE_ROLES = [
  "hero",
  "og",
  "about",
  "contact",
  "wedding",
  "couple-moment",
  "destination",
  "venue",
  "decor",
  "catering",
  "gallery",
  "blog",
  "bento-tile",
  "detail-closeup",
  "reception-stage",
  "entrance-pathway",
  "lounge-seating",
  "stage-av",
  "production",
  "corporate-like",
  "conference-like",
  "launch-like",
  "exhibition-like",
  "concert-like",
  "celebrity-like",
  "fashion-like",
  "birthday-like",
] as const;

export type ImageRole = (typeof IMAGE_ROLES)[number];

export type ImageScene =
  | "guests-crowd"
  | "floral-decor"
  | "reception-stage"
  | "stage-av"
  | "detail-closeup"
  | "venue-interior"
  | "venue-exterior"
  | "garden-outdoor"
  | "entrance-pathway"
  | "couple-moment"
  | "lounge-seating"
  | "mandap-ceremony"
  | "other";

export type ImageOrientation = "landscape" | "portrait";
export type TextSafeArea = "none" | "top" | "bottom" | "left" | "right";
export type ImageQuality = 1 | 2 | 3 | 4 | 5;

export interface ImageCuration {
  /** Descriptive alt text — what is visible, nothing about who or where. */
  alt: string;
  /** Slots this photo may fill. Empty = never auto-placed (e.g. rotated frames). */
  roles: readonly ImageRole[];
  scene: ImageScene;
  orientation: ImageOrientation;
  /** 1 = unusable, 3 = solid, 5 = showcase. */
  quality: ImageQuality;
  /** CSS `object-position` value, e.g. "50% 55%". */
  focal: string;
  /** True when a face is the subject — avoided for hero/about/contact. */
  facesProminent: boolean;
  /** Side of the frame that is calm enough to carry headline text. */
  textSafeArea: TextSafeArea;
  /** Another ID this photo is a near-identical frame of; the two never share a page. */
  nearDuplicateOf?: string;
}

export const DRIVE_CDN = "https://lh3.googleusercontent.com/d/";

/** Source photo for public/images/hero/hero-poster*.webp (scripts/build-hero-og.ts). */
export const HERO_POSTER_ID = "1FMEA0jCZXKEfSl7QRzbslrjYDW50Kn3i";
/** Source photo for public/brand/nexyyra-og*.png. */
export const OG_IMAGE_ID = "1lJbfeSwmJtcckYFyav_XCLban-GILGHX";

/** Alt for any image we cannot identify — still describes what the site shows. */
export const GENERIC_IMAGE_ALT =
  "Event décor, venue styling and stage production by Nexyyra Events";

/** Locally served crops that are really one of the curated Drive photos. */
export const LOCAL_IMAGE_IDS: Record<string, string> = {
  "/images/hero/hero-poster.webp": HERO_POSTER_ID,
  "/images/hero/hero-poster-mobile.webp": HERO_POSTER_ID,
};

export const IMAGE_CURATION_SOURCE: Record<string, ImageCuration> = {
  "1jolQvQLpHIKY9U8M4XjNt7hRgAPhGJ4y": {
    alt: "Guest in a lilac embroidered outfit before a gold-trimmed sofa and arched window in a chandelier-lit hall",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 35%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1Lre8QEM1XfO56HuhSAbtVTv8IMfISOI0": {
    alt: "Colourful fabric umbrella with garlands beside a red telephone-booth photo prop crowned with pastel flowers",
    roles: ["decor", "birthday-like"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 2,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1BdaCjf0Xk-Vvh43QOi-YhKe8ioHZy0Ai": {
    alt: "Man in a pale grey blazer adjusting his cuff before a blurred pink floral arch under warm lights",
    roles: ["wedding", "gallery", "fashion-like"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 4,
    focal: "50% 35%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1IBndYZaO7Blhz2OAMA1A3RlkIhxYVxnj": {
    alt: "Smiling guest in an embroidered rust-orange sharara before a pink floral arch and painted figurines",
    roles: ["wedding", "gallery", "fashion-like"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 30%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1lVUcnKgYd5oy6NbI8G-1hZeEHSIm4VAU": {
    alt: "Baby lifted above celebrating guests beneath a canopy of pink hanging blossom strands",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "40% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1C7GenQpCkyJjkL2lo-BlnjAuMKSobSNp": {
    alt: "Guests in pink and mauve outfits dancing beneath pink blossom strands at a daytime celebration",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "45% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "14olXTN-QcacQSSq1zELaNJlTODM-lxZR": {
    alt: "Two men in a black suit and a red blazer dancing on a chequered floor under blue stage haze",
    roles: ["wedding", "gallery", "concert-like"],
    scene: "reception-stage",
    orientation: "portrait",
    quality: 3,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1k4I1GTnmk3-_t214ogS54Z12MqI4C5Bx": {
    alt: "Laughing guest in a red blazer seated in a cream banquet hall with a blurred arched window behind",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1D8_JM11YOZhdtQ_iyLylF0rW3zfIBNg5": {
    alt: "Performer in a dark tuxedo on a chequered stage before an LED wall of radiating blue light with sparklers",
    roles: ["wedding", "concert-like", "launch-like", "production", "gallery"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 4,
    focal: "45% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1qwBHFO4XSdHXCh1ZYQ_AF8MSHAwlpHJx": {
    alt: "Singer with a microphone performing before a large LED screen under stage lighting rigs",
    roles: ["concert-like", "production", "gallery", "celebrity-like"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 3,
    focal: "45% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1B2YSBTH_da2ETWf9xOVJ68lPx--TC_n3": {
    alt: "Guests in yellow kurtas inflating blue balloons before a pastel pink floral window backdrop",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "40% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1c5nKDx-AEuP223fKQFSOe0j_-bzLUn1D": {
    alt: "Lilac shuttered window cut-out with pastel panes crowned by a pink and peach hydrangea arch",
    roles: ["decor", "detail-closeup", "bento-tile", "birthday-like", "gallery"],
    scene: "detail-closeup",
    orientation: "portrait",
    quality: 4,
    focal: "50% 30%",
    facesProminent: false,
    textSafeArea: "bottom",
  },
  "13_DE-DhPwCcwbEqkxrg43QwIOKUbqlxU": {
    alt: "Men in cream kurtas and turbans dancing with raised arms as drummers play dhols outdoors",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1gwXQ4oHSU0CRUbhtY4n-EM1GFrhb1OQ5": {
    alt: "Couple holding hands on a chequered stage before an LED wall heart graphic framed by spark fountains",
    roles: ["wedding", "couple-moment", "production", "gallery"],
    scene: "couple-moment",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "15Q40rODdvH5deDWto01k3xADqdPpkzxN": {
    alt: "Two dancers on a chequered stage before a geometric purple and blue LED wall with crossing beams",
    roles: ["wedding", "concert-like", "production", "gallery"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1kDdjV4TpcglIMteJOjBrAB2JOsALq3Mq": {
    alt: "Banquet stage set with purple LED panel walls, fairy-light curtains and moving-head lights under a chandelier",
    roles: [
      "corporate-like",
      "conference-like",
      "concert-like",
      "launch-like",
      "production",
      "stage-av",
      "venue",
    ],
    scene: "stage-av",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "19QeXWtgUx4lZ011H80dLGgbi3V-kkuXs": {
    alt: "Rows of chairs in cream and gold patterned covers inside a marble banquet hall being set up",
    roles: ["venue", "corporate-like", "conference-like"],
    scene: "venue-interior",
    orientation: "landscape",
    quality: 2,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1SqaF7yzJN702yZJIeGWSIDcSj7wTvclY": {
    alt: "Ganesh idol within a pink rose floral arch flanked by white elephant statues in a pink-lit hall",
    roles: ["wedding", "decor", "gallery", "bento-tile", "venue"],
    scene: "floral-decor",
    orientation: "landscape",
    quality: 4,
    focal: "50% 45%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1x2ZofgOiIejQyTr7xL6qtp8qnckzPLVt": {
    alt: "Guests in yellow and red outfits laughing around a man seated on the floor at a daytime celebration",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  // Served rotated 90° by Drive — kept out of every slot until re-uploaded upright.
  "1XYbv4-arup_WjLyF7fD3s7QgwSWWOi-2": {
    alt: "Smiling man holding pink balloons beside a pool edge, frame rotated sideways",
    roles: [],
    scene: "other",
    orientation: "landscape",
    quality: 1,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  // Served rotated 90° by Drive.
  "11nnAr-0ypHWl-33dsaH0moueOGnyelT9": {
    alt: "Woman in a gold saree beneath a rainbow streamer canopy, frame rotated sideways",
    roles: [],
    scene: "other",
    orientation: "landscape",
    quality: 1,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S": {
    alt: "Resort pool beneath a rainbow lantern canopy with a pastel floral backdrop and a flower-filled boat",
    roles: ["hero", "destination", "wedding", "venue", "decor", "og", "gallery", "birthday-like"],
    scene: "garden-outdoor",
    orientation: "landscape",
    quality: 4,
    focal: "50% 40%",
    facesProminent: false,
    textSafeArea: "bottom",
  },
  "1zZDjOmcrunL0OabHO-dPYLCH3xPZlLEy": {
    alt: "Pastel pink stage with floral-crowned window cut-outs, a red loveseat and banks of yellow and pink flowers",
    roles: ["hero", "wedding", "decor", "birthday-like", "og", "bento-tile", "gallery"],
    scene: "reception-stage",
    orientation: "landscape",
    quality: 4,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1cTbFJyaHuZm30OX4ioPvEEe58bSna77s": {
    alt: "Two arched illustrated photo-booth boards in bright pink and yellow against a wooden slat wall",
    roles: ["decor", "birthday-like", "gallery", "bento-tile"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 3,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1FMEA0jCZXKEfSl7QRzbslrjYDW50Kn3i": {
    alt: "Sky-blue entrance gate with a coral layered arch and tall floral pillars opening onto a pastel geometric pathway",
    roles: ["hero", "destination", "wedding", "decor", "og", "bento-tile", "gallery", "birthday-like"],
    scene: "entrance-pathway",
    orientation: "landscape",
    quality: 5,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "left",
  },
  "1I0TH9jcxQFoXm0YzG4f4rFWaiTzlixW0": {
    alt: "Crossed hands with intricate bridal henna, including an initials motif on the palm, resting on teal fabric",
    roles: ["wedding", "detail-closeup", "bento-tile", "gallery", "blog"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 4,
    focal: "40% 45%",
    facesProminent: false,
    textSafeArea: "right",
  },
  "1Zo6GuTxQdRWp4MrgkMkAUwtG6o_Mhlbh": {
    alt: "Woman in a red embroidered lehenga standing before a white arched window with hanging florals",
    roles: ["wedding", "gallery"],
    scene: "couple-moment",
    orientation: "portrait",
    quality: 3,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1d0Jb2dsajZWuHiVv4YtB3GciOhwME5CA": {
    alt: "Man in a navy blazer leaning against a cream panelled wall",
    roles: ["gallery", "fashion-like"],
    scene: "other",
    orientation: "portrait",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1SGW0HH_6JgU_xpOMsyt3SL0R6MkB0URk": {
    alt: "Woman in a white embroidered gown standing before a pink floral arch on a marble floor",
    roles: ["wedding", "gallery", "decor"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 4,
    focal: "50% 40%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1NlfcO9YcD7KCqQMnA1os0APUATuZA4B-": {
    alt: "Two women in orange and red embroidered outfits smiling before a pink floral arch",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 40%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1jp3Isbt0QXMRfMfoYlYskPUh8sXnLh_m": {
    alt: "Groom on a rearing decorated white horse beneath a blue canopy with pink hanging florals",
    roles: ["wedding", "gallery", "production"],
    scene: "entrance-pathway",
    orientation: "portrait",
    quality: 3,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1Wgb3A9TwWEfvw1S7pn241sQwH1CODEsq": {
    alt: "Laughing woman in a navy and silver lehenga dancing under warm ballroom lights",
    roles: ["wedding", "gallery", "birthday-like"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 3,
    focal: "40% 40%",
    facesProminent: true,
    textSafeArea: "left",
  },
  "16RpMQBuJ6B3Qk1eq2N_LU4juvQG9wpP8": {
    alt: "Two men in a black suit and a red jacket laughing in a cream-toned hall",
    roles: ["gallery", "corporate-like"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "19WR9ZGNa8lmSdMaQ94dFU2mqysVIjrxX": {
    alt: "Seated man in a red jacket smiling inside a bright cream banquet hall",
    roles: ["gallery", "corporate-like"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1YpB0RlKWFSPUiie47muoTcB_93UpUwk1": {
    alt: "Woman in a black saree on a checkered stage before a glowing blue LED video wall",
    roles: ["production", "stage-av", "gallery", "concert-like"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "13TF35eWflnClnh1Z_aNV-fkkMFMYt1YU": {
    alt: "Six men in matching cream kurtas and printed jackets lined up in a white banquet hall",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1akR7zJ8Lg01GWB8WtvWwO1Z9krIVXDxM": {
    alt: "Yellow vintage scooter prop beside a slatted wall covered in colourful pop-art posters",
    roles: ["decor", "gallery", "bento-tile", "birthday-like"],
    scene: "detail-closeup",
    orientation: "portrait",
    quality: 4,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1nVjxfKzy1gAWPaviMZRfg9cAwEvv8fN1": {
    alt: "Pastel pink backdrop with painted shutters and a hot-pink daybed surrounded by marigolds",
    roles: ["decor", "wedding", "gallery", "bento-tile"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 4,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1BF7N2wiB4ddjOZEj_6VSiX_Ot9qRkjuT": {
    alt: "Women in lavender, grey and teal outfits dancing on a checkered floor in a white hall",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1VIAcBZrkLhzQwQoO1VDxYEv8MLOTrxsV": {
    alt: "Couple dancing on a hazy stage before a purple and blue kaleidoscopic LED wall",
    roles: ["production", "stage-av", "concert-like", "gallery", "og"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 4,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1XTyhxvPesVuTo6p5iWr3BFX9LrBC5C9W": {
    alt: "Performers on a stage between cold-spark fountains with a blue galaxy LED backdrop",
    roles: ["production", "stage-av", "corporate-like", "concert-like", "hero", "og", "launch-like"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 4,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1Jao-9BpbzYW1q7yEBvgSvkgFNtFQgrOm": {
    alt: "White columned banquet hall exterior with its entrance dressed in pink florals",
    roles: ["venue", "gallery"],
    scene: "venue-exterior",
    orientation: "landscape",
    quality: 2,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1ULB06kE7vj6_riTJFUTT63dJhgg5jerY": {
    alt: "Grey tufted sofa in front of a mirrored panel framed by a pastel floral arch",
    roles: ["decor", "wedding", "venue", "gallery", "bento-tile"],
    scene: "lounge-seating",
    orientation: "landscape",
    quality: 4,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "10yDcl4wHuk6mMImwCaB6WPwMWmAoRfW5": {
    alt: "Entrance archway covered in pink roses and greenery opening into a marble foyer",
    roles: ["decor", "venue", "wedding", "gallery", "bento-tile"],
    scene: "entrance-pathway",
    orientation: "landscape",
    quality: 4,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "1jnDexINl4RAHm5reI6PmJic9mEs-GBbi": {
    alt: "Henna-covered hands holding a stack of gold and jewelled bangles",
    roles: ["wedding", "gallery", "detail-closeup", "bento-tile"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 4,
    focal: "35% 45%",
    facesProminent: false,
    textSafeArea: "right",
  },
  // Served rotated 90° by Drive — no roles until re-uploaded upright.
  "1Bp-ufOZ5JN8W2c9TAuUd2DduiMUwNmRP": {
    alt: "Man in a pink sequined kurta and sunglasses dancing with his arm raised",
    roles: [],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1Puxtl0TgR_Ckj4cooCOzbxJ_-Wij8ZZR": {
    alt: "Women in colourful sarees beside a carnival game table under a rainbow tassel canopy",
    roles: ["gallery"],
    scene: "garden-outdoor",
    orientation: "landscape",
    quality: 2,
    focal: "50% 40%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1kkQ489KInK9cUILQqaMKSKfW1Ox_qzXp": {
    alt: "Hot-pink daybeds with floral bolsters in front of rows of gold chiavari chairs",
    roles: ["decor", "venue", "gallery"],
    scene: "lounge-seating",
    orientation: "landscape",
    quality: 3,
    focal: "50% 65%",
    facesProminent: false,
    textSafeArea: "top",
  },
  // Same pastel stage as 1zZDjOmc…, tighter crop.
  "1cxcQICygS2bmhqZVXEDZvhQ4peicSuhB": {
    alt: "Pastel pink stage backdrop with painted shutters, floral arches and a red daybed",
    roles: ["decor", "wedding", "gallery", "bento-tile", "og"],
    scene: "reception-stage",
    orientation: "landscape",
    quality: 4,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "none",
    nearDuplicateOf: "1zZDjOmcrunL0OabHO-dPYLCH3xPZlLEy",
  },
  "1zeuLostJ9lEvQXgaYzTPOeuPsbbN3CSd": {
    alt: "Red scalloped archway walkway with hanging tassels and flower planters on a lawn",
    roles: ["decor", "destination", "wedding", "gallery", "bento-tile", "og"],
    scene: "entrance-pathway",
    orientation: "landscape",
    quality: 4,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "147PGDAUEppxiw0JurWGNJvQnG12ru2Ax": {
    alt: "Two gold rings in open boxes on a turquoise tray beside a pink rose",
    roles: ["wedding", "gallery", "detail-closeup"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 3,
    focal: "30% 45%",
    facesProminent: false,
    textSafeArea: "right",
  },
  "1gPjYLh5nG39vdxbIp8g6ippQwAOsFiEP": {
    alt: "Three pairs of outstretched arms showing intricate mehndi designs",
    roles: ["wedding", "gallery", "detail-closeup"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 3,
    focal: "50% 40%",
    facesProminent: false,
    textSafeArea: "bottom",
  },
  "1XX4ZFPFfM1Ag8H6bqFLcPxfFhZmBxy6_": {
    alt: "Man in embellished navy tuxedo standing before cream classical columns",
    roles: ["fashion-like", "gallery", "celebrity-like"],
    scene: "other",
    orientation: "portrait",
    quality: 4,
    focal: "50% 35%",
    facesProminent: true,
    textSafeArea: "right",
  },
  "1cV9LAUnE0wYIoXUiI9LzePnu9-aq-el5": {
    alt: "Man in black suit before a pink floral arch with glowing chandelier bokeh",
    roles: ["wedding", "gallery", "fashion-like"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 4,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1nOmnEux005RG_eleiTI2VBO3MywfCgiF": {
    alt: "Group of five guests in formal wear posing in front of a pink floral arch",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 3,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "131RPh47oY4c9iflke0JALMHs_znZzrb1": {
    alt: "Outdoor ceremony stage with white arched panels, pink florals and deity idol under open sky",
    roles: ["wedding", "destination", "venue", "decor", "gallery"],
    scene: "mandap-ceremony",
    orientation: "landscape",
    quality: 3,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1KQeemHAZE4FTuPr5CCmDplnxlTDIVSwJ": {
    alt: "Man in blue embroidered kurta and turban beneath a red speaker truss in daylight",
    roles: ["wedding", "production", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "40% 55%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1fZhXmq8-0BqPxt6OdZw0VTBgqAAOE6gP": {
    alt: "Women dancing in a warm gold ballroom with sparkling ceiling lights",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1xdKykEm6R_oJeS9PMa4Jq3Fg5iPKsRFK": {
    alt: "Performer in navy tuxedo on a haze-lit stage with blue beams and LED wall",
    roles: ["concert-like", "production", "gallery"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 3,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "12KS16q3XePrJAmq3DCsgwkvDmCP_tN8M": {
    alt: "Man in grey sherwani holding a toddler before a pastel floral arch",
    roles: ["wedding", "gallery", "birthday-like"],
    scene: "other",
    orientation: "portrait",
    quality: 4,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1i0f-0uwvJ9MmhqDhZ1_N60DznRunbMFk": {
    alt: "Man in red blazer in front of a pastel hydrangea flower wall",
    roles: ["wedding", "fashion-like", "gallery"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 4,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1_VCvemG8yQw53fQHCvfeTqOpfYtcqT26": {
    alt: "Wedding ritual with groom in ivory sherwani and bride in red beside a ceremonial fire",
    roles: ["wedding", "gallery"],
    scene: "mandap-ceremony",
    orientation: "landscape",
    quality: 3,
    focal: "60% 55%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1TXKFtw-TXFFXY2kXE2m5ooLKiuYycCaY": {
    alt: "Red lattice booth prop with pastel flowers against a slatted wall of printed panels",
    roles: ["decor", "gallery"],
    scene: "detail-closeup",
    orientation: "portrait",
    quality: 2,
    focal: "45% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  // Served rotated 90° by Drive.
  "1rghsSq1veekVcruy8n8ZdELlqf5VL2Ac": {
    alt: "Painted deity statue in a glass case, image rotated sideways",
    roles: [],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 1,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "none",
  },
  "10MM4vWWBP3BM-v5iA1I_7wNlK2Zs1esn": {
    alt: "Men in suits performing on a stage lit by a blue LED wall and moving lights",
    roles: ["corporate-like", "concert-like", "production", "gallery", "wedding"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 3,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1wK62jlGIj2YtnMCENMBr_omj-zmZPlWu": {
    alt: "Performers dancing on stage in front of a red LED wall with beam lights",
    roles: ["concert-like", "production", "gallery", "wedding"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 3,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1A4y3g3k1tqUMGUSsVsxERWHQUYsXt9o-": {
    alt: "Dancers on a stage with cold-spark fountains and a blue LED grid wall",
    roles: ["concert-like", "production", "corporate-like", "og", "gallery", "wedding"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 4,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1VpfNcwb3XG1-UMc4CkwV4gdlSZrTJpfe": {
    alt: "Outdoor stage with mirror-mosaic elephants, pink carpet steps and white floral arches",
    roles: ["destination", "decor", "venue", "wedding", "gallery", "bento-tile"],
    scene: "reception-stage",
    orientation: "landscape",
    quality: 3,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1kfdbQXzMTtx5l4Cbd0NMcnHsSrNjb3-I": {
    alt: "Rows of floral-print sofas in an ivory ballroom with gold carpet and chandeliers",
    roles: ["venue", "corporate-like", "decor", "gallery"],
    scene: "lounge-seating",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1WGAbmBmlDNt9ktQUZ6VJu9xMLWIz6Ghb": {
    alt: "Singer in pink with live band beside a white floral arch",
    roles: ["concert-like", "production", "gallery"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 3,
    focal: "55% 50%",
    facesProminent: true,
    textSafeArea: "left",
  },
  "1HB7jXfFqtqIQmepN6DXbpUDHVdBtXw4t": {
    alt: "Guests in yellow and red outfits dancing at a daytime outdoor celebration",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 3,
    focal: "45% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1Z4EC3l425F-Bm6-uZTQ7EcIyMNv8HElK": {
    alt: "Smiling man in floral kurta holding pink balloons against a pastel backdrop",
    roles: ["gallery", "birthday-like"],
    scene: "couple-moment",
    orientation: "landscape",
    quality: 2,
    focal: "55% 35%",
    facesProminent: true,
    textSafeArea: "right",
  },
  "14Q8S6tU76seiJLeD1SU2RkiiNUYT4SP7": {
    alt: "Pastel pink backdrop with shuttered window cut-outs and yellow flower sculptures by a pool",
    roles: ["destination", "decor", "birthday-like", "gallery", "bento-tile", "og"],
    scene: "floral-decor",
    orientation: "landscape",
    quality: 4,
    focal: "55% 65%",
    facesProminent: false,
    textSafeArea: "left",
  },
  "17DxJ-fiRjOAPYvrFS7fihCNj0MlCrnk2": {
    alt: "Sunflower arrangements and a giant yellow flower sculpture against pastel windows",
    roles: ["decor", "bento-tile", "gallery", "birthday-like"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 4,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "none",
  },
  // Same daybed terrace as 1kkQ489K…, shot from the other end.
  "1n3lfTSgS-952kOnOZVv8tTz0PPrTfRC2": {
    alt: "Hot-pink daybeds and rows of gold chiavari chairs on an outdoor terrace",
    roles: ["venue", "decor", "corporate-like", "destination", "gallery"],
    scene: "lounge-seating",
    orientation: "landscape",
    quality: 3,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "none",
    nearDuplicateOf: "1kkQ489KInK9cUILQqaMKSKfW1Ox_qzXp",
  },
  "1EEZdabeWrt_sl3wuhZn-VvdSMIx6VA8B": {
    alt: "Colourful entrance walkway with pink wavy arches, hanging tassels and floral urns",
    roles: [
      "destination",
      "decor",
      "hero",
      "og",
      "gallery",
      "bento-tile",
      "launch-like",
      "exhibition-like",
    ],
    scene: "entrance-pathway",
    orientation: "landscape",
    quality: 4,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1lJbfeSwmJtcckYFyav_XCLban-GILGHX": {
    alt: "Ivory ballroom stage with white floral arches, chandeliers and a pink loveseat",
    roles: [
      "hero",
      "wedding",
      "venue",
      "decor",
      "corporate-like",
      "og",
      "gallery",
      "about",
      "contact",
      "bento-tile",
    ],
    scene: "reception-stage",
    orientation: "landscape",
    quality: 5,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1KEqaLeJksvJosN1aOKzcS3PUPPwAP9n2": {
    alt: "White columned banquet hall entrance with a hanging crystal chandelier and pastel floral garland",
    roles: ["venue", "destination", "gallery"],
    scene: "venue-exterior",
    orientation: "portrait",
    quality: 3,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1j0YyNmOmxaQgyf-PPidHeDt6HqSFKO9U": {
    alt: "Man in a maroon suit leaning against a cream pillar in a bright hall with floral décor behind",
    roles: ["fashion-like", "gallery"],
    scene: "other",
    orientation: "portrait",
    quality: 4,
    focal: "40% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "11axnLN9spQalDPsRZ1rp-yi4aSBfCv1b": {
    alt: "Woman in a peach embroidered lehenga before a pink and white floral arch with painted puppet props",
    roles: ["wedding", "gallery", "fashion-like"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 4,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "19crBMzcuGs1rlilGEUVSz33OFlMFKVW6": {
    alt: "Groom in white sherwani amid turbaned guests and a drumming band party under a pink floral canopy",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1FqNW42khgP5Up_G4ZozVFJJMMurM2efO": {
    alt: "Guests dancing in front of a groom on a white horse beneath a colourful umbrella and pink blossoms",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "portrait",
    quality: 3,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "15AHF2dZmKTu9eOeUMwHJxcGMfPtpdUgg": {
    alt: "Man in a dark suit on a chequered dance floor in a purple-lit chandeliered ballroom",
    roles: ["gallery", "corporate-like"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 2,
    focal: "50% 60%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1UM3lZyQAgw0tiI98LvepPjPUTJVgLrQR": {
    alt: "Man in grey sherwani dancing with a young girl on a chequered stage before a pink and blue LED wall",
    roles: ["wedding", "birthday-like", "gallery", "stage-av"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 4,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "right",
  },
  "1o1IWmyv-yYZ0Z4QsHo61hWbK9TKYEULs": {
    alt: "Man in a navy suit dancing on a chequered stage before a blue LED wall with cold sparklers",
    roles: ["wedding", "concert-like", "gallery", "stage-av"],
    scene: "stage-av",
    orientation: "portrait",
    quality: 4,
    focal: "45% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "16Eykph--U-ba7ipzamXX2JCoPf35qq2d": {
    alt: "Woman in a pale lilac lehenga seated on floral lounge sofas in a warm cream hall",
    roles: ["gallery", "wedding"],
    scene: "lounge-seating",
    orientation: "portrait",
    quality: 3,
    focal: "50% 60%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1rgTOZsvrHLbDIHDBCG5nwRPHoAFS_pFA": {
    alt: "Man in a yellow kurta holding blue balloons before a pastel pink backdrop with painted windows",
    roles: ["wedding", "birthday-like", "gallery"],
    scene: "other",
    orientation: "portrait",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1aOjM7cEE5U8ZbLOntuAmRP99tqvL2X7v": {
    alt: "Pastel pink wall with coloured shuttered windows, floral arches and bright mixed flower arrangements",
    roles: ["decor", "wedding", "gallery", "bento-tile", "og"],
    scene: "floral-decor",
    orientation: "portrait",
    quality: 4,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1gf-QbXJ6DRKfEqt1oQVwJRn0MmUsem3s": {
    alt: "Men in white kurtas and turbans posing on a sunlit forecourt with a pink floral canopy behind",
    roles: ["wedding", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 45%",
    facesProminent: true,
    textSafeArea: "bottom",
  },
  "1jpuXW6aP8fn-cQu1OO-ZEjnzpGqpeH7c": {
    alt: "Two dancers on a chequered stage before a purple and blue LED wall with cold-spark fountains",
    roles: ["wedding", "concert-like", "stage-av", "production", "gallery", "og"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 4,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1A9WrCcP4KvxWDstDHdypHn2sDvC0je_w": {
    alt: "Two dancers in lilac and red on a chequered stage before a blue LED wall with sparkler fountains",
    roles: ["wedding", "stage-av", "production", "gallery"],
    scene: "stage-av",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1wHacY8pfh5VniudcsZnXbsq4QwOy_1Mg": {
    alt: "Bride in pink embroidered lehenga and kundan jewellery smiling beside a groom in white sherwani",
    roles: ["wedding", "couple-moment", "gallery"],
    scene: "couple-moment",
    orientation: "portrait",
    quality: 4,
    focal: "45% 40%",
    facesProminent: true,
    textSafeArea: "none",
  },
  // Served rotated 90° by Drive.
  "111D7Zr1bnrXQRG16rGrLhIzaQw1YeVJ6": {
    alt: "Man in a black blazer with arms folded inside a cream ornate hall",
    roles: [],
    scene: "other",
    orientation: "landscape",
    quality: 1,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1lT00v7aMGMqSg8_rr1ooLteStd366itK": {
    alt: "Rows of peach floral lounge sofas in a cream and gold banquet hall with chandeliers",
    roles: ["venue", "lounge-seating", "corporate-like", "gallery"],
    scene: "venue-interior",
    orientation: "landscape",
    quality: 3,
    focal: "50% 50%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1LVol5mo2COi0uTusmsMN8heF6G3y6sRE": {
    alt: "Guests dining from brass thalis on gilded tables and carved chairs in a white banquet hall",
    roles: ["catering", "gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 55%",
    facesProminent: true,
    textSafeArea: "top",
  },
  "1GtY7ck6bcQEMTJsCR5C7xAWS7jSPomr9": {
    alt: "Couple in mint-green outfits seated in a flower-lined navy boat on a foam-covered pool in warm haze",
    roles: ["hero", "wedding", "destination", "couple-moment", "og", "gallery"],
    scene: "couple-moment",
    orientation: "landscape",
    quality: 5,
    focal: "60% 55%",
    facesProminent: true,
    textSafeArea: "left",
  },
  "13k2vfjcw1gkE3_Oy-VzalisSoHi63pxi": {
    alt: "Group of women in bright silk sarees posing before round pop-art painted backdrops",
    roles: ["gallery"],
    scene: "guests-crowd",
    orientation: "landscape",
    quality: 2,
    focal: "50% 50%",
    facesProminent: true,
    textSafeArea: "none",
  },
  "1pBkjJhGY7jIYlRJSM9LbPtOZbCHf4yx1": {
    alt: "Row of hot-pink quilted daybeds with floral bolsters and gold chiavari chairs outdoors",
    roles: ["decor", "lounge-seating", "gallery"],
    scene: "lounge-seating",
    orientation: "landscape",
    quality: 3,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
  },
  "1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8": {
    alt: "Navy boat edged with red and white roses floating on a blue pool beside a floral stage",
    roles: ["decor", "destination", "gallery"],
    scene: "detail-closeup",
    orientation: "landscape",
    quality: 3,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "bottom",
  },
  "12O55-1UOeO22Iav2uwv6f9sOVbTFAl0l": {
    alt: "Outdoor stage with white curved petal backdrop, pastel hydrangea clusters and a pink daybed",
    roles: ["decor", "wedding", "destination", "reception-stage", "gallery", "bento-tile", "og"],
    scene: "reception-stage",
    orientation: "landscape",
    quality: 4,
    focal: "50% 60%",
    facesProminent: false,
    textSafeArea: "top",
  },
  // Same arch walkway as 1EEZdabe…, from the opposite end.
  "1AVFFp6b52g44XQBKAfl6NOFJEgs376JF": {
    alt: "Open-air walkway of coral-pink wavy arches with hanging white beads and flower urns",
    roles: ["hero", "decor", "entrance-pathway", "destination", "gallery", "og", "bento-tile"],
    scene: "entrance-pathway",
    orientation: "landscape",
    quality: 4,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
    nearDuplicateOf: "1EEZdabeWrt_sl3wuhZn-VvdSMIx6VA8B",
  },
  // Same ballroom set-up as 1lJbfe… shot moments apart — never show both together.
  "19U-aj1LF3a0WFAyfavaGmVx8kAg45-X-": {
    alt: "Ivory draped reception stage with floral arch, chandeliers, white rose pillars and a coral loveseat",
    roles: [
      "hero",
      "wedding",
      "reception-stage",
      "corporate-like",
      "decor",
      "venue",
      "og",
      "bento-tile",
      "gallery",
      "about",
    ],
    scene: "reception-stage",
    orientation: "landscape",
    quality: 5,
    focal: "50% 55%",
    facesProminent: false,
    textSafeArea: "top",
    nearDuplicateOf: "1lJbfeSwmJtcckYFyav_XCLban-GILGHX",
  },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export interface CuratedQuery {
  /** Drop photos below this score (default 3). */
  minQuality?: ImageQuality;
  /** Drop photos whose subject is a face. */
  excludeFaces?: boolean;
  /** Keep face shots but list them after everything else. */
  preferNoFaces?: boolean;
  orientation?: ImageOrientation;
  /** Only photos with a text-safe area (textSafeArea !== "none"). */
  textSafe?: boolean;
}

/** Drive CDN URL at a given width — the same shape media:sync writes. */
export function driveUrl(id: string, width = 1920): string {
  return `${DRIVE_CDN}${id}=w${width}`;
}

/** Original upload, full resolution (used by the poster/OG build script). */
export function driveOriginalUrl(id: string): string {
  return `${DRIVE_CDN}${id}=s0`;
}

const DRIVE_ID_RE = /lh3\.googleusercontent\.com\/d\/([A-Za-z0-9_-]+)/;
const DRIVE_QUERY_RE = /drive\.google\.com\/[^?]*\?(?:.*&)?id=([A-Za-z0-9_-]+)/;

/** Pull the Drive file ID out of a CDN/Drive URL or a known local crop. */
export function driveIdFromSrc(src: string | null | undefined): string | null {
  if (!src) return null;
  const local = LOCAL_IMAGE_IDS[src.split("?")[0]];
  if (local) return local;
  const match = DRIVE_ID_RE.exec(src) ?? DRIVE_QUERY_RE.exec(src);
  return match ? match[1] : null;
}

export function curationFor(id: string | null | undefined): ImageCuration | undefined {
  return id ? IMAGE_CURATION_SOURCE[id] : undefined;
}

export function curationForSrc(src: string | null | undefined): ImageCuration | undefined {
  return curationFor(driveIdFromSrc(src));
}

/** De-duplication key — near-identical frames share the key of the primary shot. */
export function curationGroup(id: string): string {
  return IMAGE_CURATION_SOURCE[id]?.nearDuplicateOf ?? id;
}

/**
 * IDs that can play `role`, best first (quality desc, then curation order).
 * Only IDs with a curation entry are ever returned.
 */
export function curatedIds(role: ImageRole, query: CuratedQuery = {}): string[] {
  const {
    minQuality = 3,
    excludeFaces = false,
    preferNoFaces = false,
    orientation,
    textSafe = false,
  } = query;

  const entries = Object.entries(IMAGE_CURATION_SOURCE).filter(([, c]) => {
    if (!c.roles.includes(role) || c.quality < minQuality) return false;
    if (excludeFaces && c.facesProminent) return false;
    if (orientation && c.orientation !== orientation) return false;
    if (textSafe && c.textSafeArea === "none") return false;
    return true;
  });

  // Array.prototype.sort is stable, so equal scores keep curation order.
  entries.sort(([, a], [, b]) => {
    if (preferNoFaces && a.facesProminent !== b.facesProminent) return a.facesProminent ? 1 : -1;
    return b.quality - a.quality;
  });

  return entries.map(([id]) => id);
}

export function altForId(id: string | null | undefined): string {
  return curationFor(id)?.alt ?? GENERIC_IMAGE_ALT;
}

/** Alt text for any image src — curated when we know the photo, generic otherwise. */
export function altForSrc(src: string | null | undefined): string {
  return curationForSrc(src)?.alt ?? GENERIC_IMAGE_ALT;
}

export function focalForId(id: string | null | undefined): string {
  return curationFor(id)?.focal ?? "50% 50%";
}

/** `object-position` for any image src — "50% 50%" when unknown. */
export function focalForSrc(src: string | null | undefined): string {
  return curationForSrc(src)?.focal ?? "50% 50%";
}

/** How many curated photos can fill each role (handy for reports and tests). */
export function roleCounts(): Record<ImageRole, number> {
  const counts = Object.fromEntries(IMAGE_ROLES.map((r) => [r, 0])) as Record<ImageRole, number>;
  for (const entry of Object.values(IMAGE_CURATION_SOURCE)) {
    for (const role of entry.roles) counts[role] += 1;
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/* V6 curation contract                                                */
/* ------------------------------------------------------------------ */
/*
 * Everything below is what the V6 pages type against (DESIGN.md §8). It is
 * derived from IMAGE_CURATION_SOURCE so the hand-written notes stay the one
 * place a photo is described; the only V6-specific hand input is the role
 * table (which photo plays which slot), the captions and a few judgement
 * overrides (people / busy / span). Covers are exported to local WebP by
 * `npm run media:covers`, which rewrites the MEDIA_EXPORTS block.
 */

export const SERVICE_SLUGS = [
  "wedding-planning",
  "destination-weddings",
  "corporate-events",
  "celebrity-management",
  "birthday-events",
  "conferences",
  "fashion-shows",
  "concert-management",
  "exhibitions",
  "brand-promotions",
  "product-launches",
  "event-production",
] as const;

/**
 * Services with no real photography in the library. Their covers are honest
 * staging / lighting / venue frames whose alt and caption say exactly what is
 * pictured; service pages for these slugs render no gallery
 * (`assetsForService` returns []) and never imply the service is pictured.
 */
export const NEEDS_REAL_PHOTOGRAPHY: string[] = [
  "conferences",
  "fashion-shows",
  "concert-management",
  "exhibitions",
  "brand-promotions",
  "product-launches",
  "celebrity-management",
];

/**
 * The service whose `index-frame-<slug>` the home ServicesIndex (`frame="groups"`)
 * mounts for each group — fixed here so the "no photo twice on the home page"
 * check in this package and the home package agree.
 */
export const INDEX_GROUP_LEADS = {
  celebrations: "wedding-planning",
  "corporate-brand": "corporate-events",
  "production-talent": "event-production",
} as const;

/** Blog categories in src/data/cms.ts `blogPosts`, as `blog-lead-<slug>` roles. */
export const BLOG_LEAD_CATEGORIES = [
  "Wedding Planning",
  "Destination Weddings",
  "Corporate Events",
  "Event Budgeting",
  "Event Trends",
  "Venue Selection",
] as const;

/** "Destination Weddings" → "blog-lead-destination-weddings". */
export function blogLeadRole(category: string): CurationRole {
  return `blog-lead-${category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

export type CurationRole = string;
export type CropRatio = "4:5" | "3:4" | "1:1";
export type CurationPeople = "none" | "distant" | "close";
export type CurationSpan = "wide" | "standard" | "tall";

export type CurationAsset = {
  /** Google Drive file id — the `<id>` in the lh3 URL. */
  id: string;
  /** Id in public/media-manifest.json (folder-prefixed camera name). */
  manifestId: string;
  /** lh3 `=w1920` URL. */
  src: string;
  /** Pixel size of `src` (the 1920 variant), not of the upload. */
  width: number;
  height: number;
  roles: CurationRole[];
  /** 0–1, for `object-position` and the cover export crop. */
  focal: { x: number; y: number };
  cropSafe: CropRatio[];
  people: CurationPeople;
  /** High-detail frame — never beside small text. */
  busy: boolean;
  span: CurationSpan;
  /** Service slugs this photo may illustrate. */
  service: string[];
  /** Only when the owner confirmed it in writing — never set today. */
  city?: string;
  alt: string;
  /** "What is in frame · Category" — the `.lux-caption` left cell. */
  caption: string;
  /** "/images/covers/<role>" when exported — append "-1920.webp" | "-1280.webp" | "-768.webp". */
  local?: string;
  /** 24px-wide WebP data URL for next/image `blurDataURL`. */
  blur?: string;
  quality: ImageQuality;
  /** Primary frame this one near-duplicates; the two never share a page. */
  nearDuplicateOf?: string;
};

/** Drive id → manifest id and upload pixel size (from public/media-manifest.json). */
const DRIVE_FILES: Record<string, [manifestId: string, width: number, height: number]> = {
  "1jolQvQLpHIKY9U8M4XjNt7hRgAPhGJ4y": ["hero-4F1A8526", 6000, 4000],
  "1Lre8QEM1XfO56HuhSAbtVTv8IMfISOI0": ["venues-4F1A7866", 6000, 4000],
  "1BdaCjf0Xk-Vvh43QOi-YhKe8ioHZy0Ai": ["hero-0T5A0220", 8192, 5464],
  "1IBndYZaO7Blhz2OAMA1A3RlkIhxYVxnj": ["hero-0T5A0179", 8192, 5464],
  "1lVUcnKgYd5oy6NbI8G-1hZeEHSIm4VAU": ["gallery-0T5A9799", 8192, 5464],
  "1C7GenQpCkyJjkL2lo-BlnjAuMKSobSNp": ["gallery-0T5A9762", 8192, 5464],
  "14olXTN-QcacQSSq1zELaNJlTODM-lxZR": ["weddings-0T5A9454", 8192, 5464],
  "1k4I1GTnmk3-_t214ogS54Z12MqI4C5Bx": ["weddings-0T5A9180", 5088, 3392],
  "1D8_JM11YOZhdtQ_iyLylF0rW3zfIBNg5": ["hero-0T5A9125", 8192, 5464],
  "1qwBHFO4XSdHXCh1ZYQ_AF8MSHAwlpHJx": ["weddings-0T5A9079", 8192, 5464],
  "1B2YSBTH_da2ETWf9xOVJ68lPx--TC_n3": ["gallery-0T5A8798", 8192, 5464],
  "1c5nKDx-AEuP223fKQFSOe0j_-bzLUn1D": ["venues-0T5A8658", 8192, 5464],
  "13_DE-DhPwCcwbEqkxrg43QwIOKUbqlxU": ["gallery-SMB_6880", 6016, 4016],
  "1gwXQ4oHSU0CRUbhtY4n-EM1GFrhb1OQ5": ["venues-4F1A8824", 6000, 4000],
  "15Q40rODdvH5deDWto01k3xADqdPpkzxN": ["venues-4F1A8669", 6000, 4000],
  "1kDdjV4TpcglIMteJOjBrAB2JOsALq3Mq": ["venues-4F1A8587", 6000, 4000],
  "19QeXWtgUx4lZ011H80dLGgbi3V-kkuXs": ["venues-4F1A8512", 6000, 4000],
  "1SqaF7yzJN702yZJIeGWSIDcSj7wTvclY": ["venues-4F1A8506", 6000, 4000],
  "1x2ZofgOiIejQyTr7xL6qtp8qnckzPLVt": ["hero-IMG_4085", 6720, 4480],
  "1XYbv4-arup_WjLyF7fD3s7QgwSWWOi-2": ["gallery-4F1A8037", 6000, 4000],
  "11nnAr-0ypHWl-33dsaH0moueOGnyelT9": ["gallery-4F1A7917", 6000, 4000],
  "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S": ["venues-4F1A7897", 6000, 4000],
  "1zZDjOmcrunL0OabHO-dPYLCH3xPZlLEy": ["venues-4F1A7882", 6000, 4000],
  "1cTbFJyaHuZm30OX4ioPvEEe58bSna77s": ["venues-4F1A7869", 6000, 4000],
  "1FMEA0jCZXKEfSl7QRzbslrjYDW50Kn3i": ["venues-4F1A7857", 6000, 4000],
  "1I0TH9jcxQFoXm0YzG4f4rFWaiTzlixW0": ["weddings-4F1A7602", 6000, 4000],
  "1Zo6GuTxQdRWp4MrgkMkAUwtG6o_Mhlbh": ["hero-4F1A8522", 6000, 4000],
  "1d0Jb2dsajZWuHiVv4YtB3GciOhwME5CA": ["hero-4F1A8528", 6000, 4000],
  "1SGW0HH_6JgU_xpOMsyt3SL0R6MkB0URk": ["hero-0T5A0209", 8192, 5464],
  "1NlfcO9YcD7KCqQMnA1os0APUATuZA4B-": ["hero-0T5A0177", 8192, 5464],
  "1jp3Isbt0QXMRfMfoYlYskPUh8sXnLh_m": ["gallery-0T5A9792", 8192, 5464],
  "1Wgb3A9TwWEfvw1S7pn241sQwH1CODEsq": ["hero-0T5A9532", 8192, 5464],
  "16RpMQBuJ6B3Qk1eq2N_LU4juvQG9wpP8": ["weddings-0T5A9297", 5088, 3392],
  "19WR9ZGNa8lmSdMaQ94dFU2mqysVIjrxX": ["hero-0T5A9174", 5088, 3392],
  "1YpB0RlKWFSPUiie47muoTcB_93UpUwk1": ["weddings-0T5A9113", 8192, 5464],
  "13TF35eWflnClnh1Z_aNV-fkkMFMYt1YU": ["weddings-0T5A8966", 8192, 5464],
  "1akR7zJ8Lg01GWB8WtvWwO1Z9krIVXDxM": ["venues-0T5A8668", 8192, 5464],
  "1nVjxfKzy1gAWPaviMZRfg9cAwEvv8fN1": ["venues-0T5A8656", 8192, 5464],
  "1BF7N2wiB4ddjOZEj_6VSiX_Ot9qRkjuT": ["weddings-4F1A8928", 6000, 4000],
  "1VIAcBZrkLhzQwQoO1VDxYEv8MLOTrxsV": ["venues-4F1A8781", 6000, 4000],
  "1XTyhxvPesVuTo6p5iWr3BFX9LrBC5C9W": ["venues-4F1A8635", 6000, 4000],
  "1Jao-9BpbzYW1q7yEBvgSvkgFNtFQgrOm": ["venues-SMB_6784", 6016, 4016],
  "1ULB06kE7vj6_riTJFUTT63dJhgg5jerY": ["venues-4F1A8511", 6000, 4000],
  "10yDcl4wHuk6mMImwCaB6WPwMWmAoRfW5": ["venues-4F1A8503", 6000, 4000],
  "1jnDexINl4RAHm5reI6PmJic9mEs-GBbi": ["gallery-4F1A8065", 6000, 4000],
  "1Bp-ufOZ5JN8W2c9TAuUd2DduiMUwNmRP": ["hero-IMG_3937", 6720, 4480],
  "1Puxtl0TgR_Ckj4cooCOzbxJ_-Wij8ZZR": ["gallery-4F1A7904", 6000, 4000],
  "1kkQ489KInK9cUILQqaMKSKfW1Ox_qzXp": ["venues-4F1A7889", 6000, 4000],
  "1cxcQICygS2bmhqZVXEDZvhQ4peicSuhB": ["venues-4F1A7881", 6000, 4000],
  "1zeuLostJ9lEvQXgaYzTPOeuPsbbN3CSd": ["venues-4F1A7863", 6000, 4000],
  "147PGDAUEppxiw0JurWGNJvQnG12ru2Ax": ["weddings-4F1A7809", 6000, 4000],
  "1gPjYLh5nG39vdxbIp8g6ippQwAOsFiEP": ["weddings-4F1A7565", 6000, 4000],
  "1XX4ZFPFfM1Ag8H6bqFLcPxfFhZmBxy6_": ["hero-4F1A8519", 6000, 4000],
  "1cV9LAUnE0wYIoXUiI9LzePnu9-aq-el5": ["hero-0T5A0241", 8192, 5464],
  "1nOmnEux005RG_eleiTI2VBO3MywfCgiF": ["hero-0T5A0205", 8192, 5464],
  "131RPh47oY4c9iflke0JALMHs_znZzrb1": ["venues-0T5A9825", 5088, 3392],
  "1KQeemHAZE4FTuPr5CCmDplnxlTDIVSwJ": ["gallery-0T5A9775", 8192, 5464],
  "1fZhXmq8-0BqPxt6OdZw0VTBgqAAOE6gP": ["weddings-0T5A9523", 8192, 5464],
  "1xdKykEm6R_oJeS9PMa4Jq3Fg5iPKsRFK": ["weddings-0T5A9268", 8192, 5464],
  "12KS16q3XePrJAmq3DCsgwkvDmCP_tN8M": ["weddings-0T5A9131", 8192, 5464],
  "1i0f-0uwvJ9MmhqDhZ1_N60DznRunbMFk": ["weddings-0T5A9106", 5088, 3392],
  "1_VCvemG8yQw53fQHCvfeTqOpfYtcqT26": ["weddings-SMB_7072", 6016, 4016],
  "1TXKFtw-TXFFXY2kXE2m5ooLKiuYycCaY": ["venues-0T5A8667", 8192, 5464],
  "1rghsSq1veekVcruy8n8ZdELlqf5VL2Ac": ["gallery-SMB_6916", 6016, 4016],
  "10MM4vWWBP3BM-v5iA1I_7wNlK2Zs1esn": ["weddings-4F1A8899", 6000, 4000],
  "1wK62jlGIj2YtnMCENMBr_omj-zmZPlWu": ["weddings-4F1A8764", 6000, 4000],
  "1A4y3g3k1tqUMGUSsVsxERWHQUYsXt9o-": ["venues-4F1A8624", 6000, 4000],
  "1VpfNcwb3XG1-UMc4CkwV4gdlSZrTJpfe": ["venues-SMB_6783", 6016, 4016],
  "1kfdbQXzMTtx5l4Cbd0NMcnHsSrNjb3-I": ["venues-4F1A8509", 6000, 4000],
  "1WGAbmBmlDNt9ktQUZ6VJu9xMLWIz6Ghb": ["gallery-4F1A8316", 6000, 4000],
  "1HB7jXfFqtqIQmepN6DXbpUDHVdBtXw4t": ["gallery-4F1A8046", 6000, 4000],
  "1Z4EC3l425F-Bm6-uZTQ7EcIyMNv8HElK": ["gallery-4F1A8027", 6000, 4000],
  "14Q8S6tU76seiJLeD1SU2RkiiNUYT4SP7": ["venues-4F1A7903", 6000, 4000],
  "17DxJ-fiRjOAPYvrFS7fihCNj0MlCrnk2": ["venues-4F1A7887", 6000, 4000],
  "1n3lfTSgS-952kOnOZVv8tTz0PPrTfRC2": ["venues-4F1A7873", 6000, 4000],
  "1EEZdabeWrt_sl3wuhZn-VvdSMIx6VA8B": ["venues-4F1A7861", 6000, 4000],
  "1lJbfeSwmJtcckYFyav_XCLban-GILGHX": ["venues-4F1A7735", 6000, 4000],
  "1KEqaLeJksvJosN1aOKzcS3PUPPwAP9n2": ["venues-SMB_6785", 6016, 4016],
  "1j0YyNmOmxaQgyf-PPidHeDt6HqSFKO9U": ["hero-0T5A0228", 8192, 5464],
  "11axnLN9spQalDPsRZ1rp-yi4aSBfCv1b": ["hero-0T5A0197", 8192, 5464],
  "19crBMzcuGs1rlilGEUVSz33OFlMFKVW6": ["gallery-0T5A9804", 8192, 5464],
  "1FqNW42khgP5Up_G4ZozVFJJMMurM2efO": ["gallery-0T5A9765", 8192, 5464],
  "15AHF2dZmKTu9eOeUMwHJxcGMfPtpdUgg": ["hero-0T5A9456", 8192, 5464],
  "1UM3lZyQAgw0tiI98LvepPjPUTJVgLrQR": ["weddings-0T5A9248", 8192, 5464],
  "1o1IWmyv-yYZ0Z4QsHo61hWbK9TKYEULs": ["weddings-0T5A9127", 8192, 5464],
  "16Eykph--U-ba7ipzamXX2JCoPf35qq2d": ["weddings-0T5A9093", 8192, 5464],
  "1rgTOZsvrHLbDIHDBCG5nwRPHoAFS_pFA": ["gallery-0T5A8805", 8192, 5464],
  "1aOjM7cEE5U8ZbLOntuAmRP99tqvL2X7v": ["venues-0T5A8660", 8192, 5464],
  "1gf-QbXJ6DRKfEqt1oQVwJRn0MmUsem3s": ["gallery-SMB_6908", 6016, 4016],
  "1jpuXW6aP8fn-cQu1OO-ZEjnzpGqpeH7c": ["venues-4F1A8853", 6000, 4000],
  "1A9WrCcP4KvxWDstDHdypHn2sDvC0je_w": ["venues-4F1A8676", 6000, 4000],
  "1wHacY8pfh5VniudcsZnXbsq4QwOy_1Mg": ["celebrity-0T5A8536", 8192, 5464],
  "111D7Zr1bnrXQRG16rGrLhIzaQw1YeVJ6": ["hero-4F1A8554", 6000, 4000],
  "1lT00v7aMGMqSg8_rr1ooLteStd366itK": ["venues-4F1A8508", 6000, 4000],
  "1LVol5mo2COi0uTusmsMN8heF6G3y6sRE": ["weddings-IMG_4147", 6720, 4480],
  "1GtY7ck6bcQEMTJsCR5C7xAWS7jSPomr9": ["venues-IMG_3973", 6720, 4480],
  "13k2vfjcw1gkE3_Oy-VzalisSoHi63pxi": ["gallery-4F1A7941", 6000, 4000],
  "1pBkjJhGY7jIYlRJSM9LbPtOZbCHf4yx1": ["venues-4F1A7901", 6000, 4000],
  "1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8": ["venues-4F1A7886", 6000, 4000],
  "12O55-1UOeO22Iav2uwv6f9sOVbTFAl0l": ["venues-4F1A7871", 6000, 4000],
  "1AVFFp6b52g44XQBKAfl6NOFJEgs376JF": ["venues-4F1A7858", 6000, 4000],
  "19U-aj1LF3a0WFAyfavaGmVx8kAg45-X-": ["venues-4F1A7734", 6000, 4000],
};

/**
 * V6 slot table — which photo plays which spec role (DESIGN.md §8.3).
 * Rules applied when assigning: no photo twice across the 17 cover roles; no
 * `people: close` on a cover, spread, index frame or house portrait; the two
 * halves of a near-duplicate pair never land on the same page; index frames
 * reuse the service cover so the morph matches the mental model.
 */
const V6_ROLE_ASSIGNMENTS: Record<CurationRole, string | string[]> = {
  // Page covers (local WebP, LCP)
  "cover-home": HERO_POSTER_ID, // sky-blue entrance gate — the existing poster
  "cover-services": "1zeuLostJ9lEvQXgaYzTPOeuPsbbN3CSd", // red scalloped archway walkway
  "cover-about": "1lJbfeSwmJtcckYFyav_XCLban-GILGHX", // ivory ballroom stage, chandeliers
  "cover-portfolio": "12O55-1UOeO22Iav2uwv6f9sOVbTFAl0l", // petal backdrop, hydrangeas
  "cover-why": "1aOjM7cEE5U8ZbLOntuAmRP99tqvL2X7v", // pastel wall, shuttered windows
  // Service covers (local WebP, LCP) — index-frame-<slug> mirrors these
  "service-cover-wedding-planning": "19U-aj1LF3a0WFAyfavaGmVx8kAg45-X-",
  "service-cover-destination-weddings": "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S",
  "service-cover-corporate-events": "1kfdbQXzMTtx5l4Cbd0NMcnHsSrNjb3-I",
  "service-cover-celebrity-management": "1ULB06kE7vj6_riTJFUTT63dJhgg5jerY", // lounge styling frame
  "service-cover-birthday-events": "1c5nKDx-AEuP223fKQFSOe0j_-bzLUn1D",
  "service-cover-conferences": "1kDdjV4TpcglIMteJOjBrAB2JOsALq3Mq", // LED-panel stage frame
  "service-cover-fashion-shows": "10yDcl4wHuk6mMImwCaB6WPwMWmAoRfW5", // rose archway walkway frame
  "service-cover-concert-management": "1XTyhxvPesVuTo6p5iWr3BFX9LrBC5C9W", // cold-spark stage frame
  "service-cover-exhibitions": "1cTbFJyaHuZm30OX4ioPvEEe58bSna77s", // built display boards frame
  // The pop-art prop wall (1akR7zJ8…) blows the 220 KB cover budget at any quality — too much detail.
  "service-cover-brand-promotions": "1n3lfTSgS-952kOnOZVv8tTz0PPrTfRC2", // outdoor terrace lounge set frame
  "service-cover-product-launches": "1EEZdabeWrt_sl3wuhZn-VvdSMIx6VA8B", // entrance installation frame
  // The hazy kaleidoscope stage (1VIAcBZr…) is too noisy for the 220 KB budget; it stays a Drive-served blog lead.
  "service-cover-event-production": "1A4y3g3k1tqUMGUSsVsxERWHQUYsXt9o-", // cold-spark stage frame, dancers distant
  // Spreads (21:9 ≥ 1024 / 3:2)
  "spread-home": "1zZDjOmcrunL0OabHO-dPYLCH3xPZlLEy",
  "spread-services": "14Q8S6tU76seiJLeD1SU2RkiiNUYT4SP7",
  "spread-about": "1AVFFp6b52g44XQBKAfl6NOFJEgs376JF",
  "spread-why": "1VpfNcwb3XG1-UMc4CkwV4gdlSZrTJpfe",
  // Diptychs (3:4 / 4:5)
  "diptych-home-l": "1KEqaLeJksvJosN1aOKzcS3PUPPwAP9n2", // venue interior
  "diptych-home-r": "147PGDAUEppxiw0JurWGNJvQnG12ru2Ax", // table detail
  "case-cs-1-l": "1SqaF7yzJN702yZJIeGWSIDcSj7wTvclY",
  "case-cs-1-r": "1jnDexINl4RAHm5reI6PmJic9mEs-GBbi",
  "case-cs-2-l": "1kDdjV4TpcglIMteJOjBrAB2JOsALq3Mq",
  "case-cs-2-r": "1kkQ489KInK9cUILQqaMKSKfW1Ox_qzXp",
  "case-cs-3-l": "1pBkjJhGY7jIYlRJSM9LbPtOZbCHf4yx1",
  "case-cs-3-r": "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S",
  // About chapter / about page, 4:5 offset frame
  "house-portrait": "1nVjxfKzy1gAWPaviMZRfg9cAwEvv8fN1",
  // Concept cards + case covers (category-matched real photos under a Concept tag)
  "concept-cs-1": "131RPh47oY4c9iflke0JALMHs_znZzrb1", // destination wedding → open-air ceremony stage
  "concept-cs-2": "1lT00v7aMGMqSg8_rr1ooLteStd366itK", // corporate → ballroom set with lounge seating
  "concept-cs-3": "1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8", // beach / outdoor → rose boat on a pool
  // Blog lead figures
  "blog-lead-wedding-planning": "10yDcl4wHuk6mMImwCaB6WPwMWmAoRfW5",
  "blog-lead-destination-weddings": "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S",
  "blog-lead-corporate-events": "1kfdbQXzMTtx5l4Cbd0NMcnHsSrNjb3-I",
  "blog-lead-event-budgeting": "147PGDAUEppxiw0JurWGNJvQnG12ru2Ax",
  "blog-lead-event-trends": "1VIAcBZrkLhzQwQoO1VDxYEv8MLOTrxsV",
  "blog-lead-venue-selection": "1lT00v7aMGMqSg8_rr1ooLteStd366itK",
  // Shared pool for locations, local-SEO, book-event, contact and the /services band.
  // Excludes every service cover, cover-services, spread-services and their
  // near-duplicates so the /services page never repeats a frame.
  "editorial-band": [
    "1cxcQICygS2bmhqZVXEDZvhQ4peicSuhB",
    "17DxJ-fiRjOAPYvrFS7fihCNj0MlCrnk2",
    "1I0TH9jcxQFoXm0YzG4f4rFWaiTzlixW0",
    "1SqaF7yzJN702yZJIeGWSIDcSj7wTvclY",
    "1jnDexINl4RAHm5reI6PmJic9mEs-GBbi",
    "1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8",
    "131RPh47oY4c9iflke0JALMHs_znZzrb1",
    "1VpfNcwb3XG1-UMc4CkwV4gdlSZrTJpfe",
    "1gPjYLh5nG39vdxbIp8g6ippQwAOsFiEP",
    "1nVjxfKzy1gAWPaviMZRfg9cAwEvv8fN1",
  ],
};

type V6Note = {
  /** "What is in frame · Category" — rewritten from the alt, never a client, venue or city. */
  caption: string;
  /** Override the facesProminent-derived value (wide stage / dance-floor shots read as distant). */
  people?: CurationPeople;
  busy?: boolean;
  span?: CurationSpan;
  /** `[]` holds a frame out of every V6 slot (rotated uploads, consent pending). */
  roles?: [];
};

const V6_NOTES: Record<string, V6Note> = {
  "1jolQvQLpHIKY9U8M4XjNt7hRgAPhGJ4y": { caption: "Guest in lilac embroidery · Celebration" },
  "1Lre8QEM1XfO56HuhSAbtVTv8IMfISOI0": { caption: "Garlanded umbrella and photo props · Décor", busy: true },
  "1BdaCjf0Xk-Vvh43QOi-YhKe8ioHZy0Ai": { caption: "Guest before a pink floral arch · Celebration" },
  "1IBndYZaO7Blhz2OAMA1A3RlkIhxYVxnj": { caption: "Guest in a rust sharara · Celebration" },
  "1lVUcnKgYd5oy6NbI8G-1hZeEHSIm4VAU": { caption: "Baby lifted beneath blossom strands · Celebration" },
  "1C7GenQpCkyJjkL2lo-BlnjAuMKSobSNp": { caption: "Daytime dancing under blossom strands · Celebration" },
  "14olXTN-QcacQSSq1zELaNJlTODM-lxZR": { caption: "Dancing under blue stage haze · Reception" },
  "1k4I1GTnmk3-_t214ogS54Z12MqI4C5Bx": { caption: "Laughter in a cream banquet hall · Celebration" },
  "1D8_JM11YOZhdtQ_iyLylF0rW3zfIBNg5": { caption: "Performer before a radiating LED wall · Production" },
  "1qwBHFO4XSdHXCh1ZYQ_AF8MSHAwlpHJx": { caption: "Singer before an LED screen · Production" },
  "1B2YSBTH_da2ETWf9xOVJ68lPx--TC_n3": { caption: "Balloons before a pastel floral window · Celebration" },
  "1c5nKDx-AEuP223fKQFSOe0j_-bzLUn1D": { caption: "Lilac window cut-out with a hydrangea arch · Décor" },
  "13_DE-DhPwCcwbEqkxrg43QwIOKUbqlxU": { caption: "Dhol players and dancing guests · Celebration", people: "distant" },
  "1gwXQ4oHSU0CRUbhtY4n-EM1GFrhb1OQ5": { caption: "Couple on stage with spark fountains · Reception", people: "distant" },
  "15Q40rODdvH5deDWto01k3xADqdPpkzxN": { caption: "Dancers before a geometric LED wall · Production", people: "distant" },
  "1kDdjV4TpcglIMteJOjBrAB2JOsALq3Mq": { caption: "Stage set with LED panels and moving lights · Production", busy: false },
  "19QeXWtgUx4lZ011H80dLGgbi3V-kkuXs": { caption: "Rows of covered chairs in a marble hall · Venue" },
  "1SqaF7yzJN702yZJIeGWSIDcSj7wTvclY": { caption: "Ganesh idol within a rose arch · Ceremony décor", busy: true },
  "1x2ZofgOiIejQyTr7xL6qtp8qnckzPLVt": { caption: "Guests laughing at a daytime function · Celebration" },
  "1XYbv4-arup_WjLyF7fD3s7QgwSWWOi-2": { caption: "Poolside portrait, frame rotated · Unused", roles: [] },
  "11nnAr-0ypHWl-33dsaH0moueOGnyelT9": { caption: "Rainbow streamer canopy, frame rotated · Unused", roles: [] },
  "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S": { caption: "Resort pool under a lantern canopy · Destination" },
  "1zZDjOmcrunL0OabHO-dPYLCH3xPZlLEy": { caption: "Pastel stage with floral window cut-outs · Reception" },
  "1cTbFJyaHuZm30OX4ioPvEEe58bSna77s": { caption: "Illustrated photo-booth boards · Décor", busy: true },
  "1FMEA0jCZXKEfSl7QRzbslrjYDW50Kn3i": { caption: "Sky-blue entrance gate with a coral arch · Entrance" },
  "1I0TH9jcxQFoXm0YzG4f4rFWaiTzlixW0": { caption: "Bridal henna on crossed hands · Detail" },
  "1Zo6GuTxQdRWp4MrgkMkAUwtG6o_Mhlbh": { caption: "Red lehenga before an arched window · Celebration" },
  "1d0Jb2dsajZWuHiVv4YtB3GciOhwME5CA": { caption: "Navy blazer against a panelled wall · Celebration" },
  "1SGW0HH_6JgU_xpOMsyt3SL0R6MkB0URk": { caption: "White gown before a pink floral arch · Celebration" },
  "1NlfcO9YcD7KCqQMnA1os0APUATuZA4B-": { caption: "Guests before a pink floral arch · Celebration" },
  "1jp3Isbt0QXMRfMfoYlYskPUh8sXnLh_m": { caption: "Groom on a decorated white horse · Ceremony" },
  "1Wgb3A9TwWEfvw1S7pn241sQwH1CODEsq": { caption: "Dancing under warm ballroom lights · Celebration" },
  "16RpMQBuJ6B3Qk1eq2N_LU4juvQG9wpP8": { caption: "Laughter in a cream hall · Celebration" },
  "19WR9ZGNa8lmSdMaQ94dFU2mqysVIjrxX": { caption: "Seated guest in a bright banquet hall · Celebration" },
  "1YpB0RlKWFSPUiie47muoTcB_93UpUwk1": { caption: "Black saree before a blue video wall · Production" },
  "13TF35eWflnClnh1Z_aNV-fkkMFMYt1YU": { caption: "Matching kurtas in a white banquet hall · Celebration" },
  "1akR7zJ8Lg01GWB8WtvWwO1Z9krIVXDxM": { caption: "Vintage scooter and a pop-art poster wall · Décor", busy: true },
  "1nVjxfKzy1gAWPaviMZRfg9cAwEvv8fN1": { caption: "Hot-pink daybed amid marigolds · Décor" },
  "1BF7N2wiB4ddjOZEj_6VSiX_Ot9qRkjuT": { caption: "Dancing on a chequered floor · Celebration", people: "distant" },
  "1VIAcBZrkLhzQwQoO1VDxYEv8MLOTrxsV": { caption: "Hazy stage before a kaleidoscopic LED wall · Production", people: "distant" },
  "1XTyhxvPesVuTo6p5iWr3BFX9LrBC5C9W": { caption: "Cold-spark fountains and a galaxy LED backdrop · Production", people: "distant" },
  "1Jao-9BpbzYW1q7yEBvgSvkgFNtFQgrOm": { caption: "Columned hall entrance dressed in florals · Venue" },
  "1ULB06kE7vj6_riTJFUTT63dJhgg5jerY": { caption: "Tufted sofa beneath a pastel floral arch · Lounge styling" },
  "10yDcl4wHuk6mMImwCaB6WPwMWmAoRfW5": { caption: "Rose archway into a marble foyer · Entrance" },
  "1jnDexINl4RAHm5reI6PmJic9mEs-GBbi": { caption: "Henna hands with jewelled bangles · Detail" },
  "1Bp-ufOZ5JN8W2c9TAuUd2DduiMUwNmRP": { caption: "Sequined kurta dancing, frame rotated · Unused", roles: [] },
  "1Puxtl0TgR_Ckj4cooCOzbxJ_-Wij8ZZR": { caption: "Carnival game under a tassel canopy · Celebration", busy: true },
  "1kkQ489KInK9cUILQqaMKSKfW1Ox_qzXp": { caption: "Pink daybeds before gold chiavari chairs · Lounge styling" },
  "1cxcQICygS2bmhqZVXEDZvhQ4peicSuhB": { caption: "Pastel stage with painted shutters · Reception" },
  "1zeuLostJ9lEvQXgaYzTPOeuPsbbN3CSd": { caption: "Red scalloped archway walkway · Entrance" },
  "147PGDAUEppxiw0JurWGNJvQnG12ru2Ax": { caption: "Gold rings on a turquoise tray · Detail" },
  "1gPjYLh5nG39vdxbIp8g6ippQwAOsFiEP": { caption: "Outstretched arms with mehndi · Detail" },
  "1XX4ZFPFfM1Ag8H6bqFLcPxfFhZmBxy6_": { caption: "Embellished tuxedo before classical columns · Celebration" },
  "1cV9LAUnE0wYIoXUiI9LzePnu9-aq-el5": { caption: "Black suit before a floral arch and chandelier bokeh · Celebration" },
  "1nOmnEux005RG_eleiTI2VBO3MywfCgiF": { caption: "Group before a pink floral arch · Celebration" },
  "131RPh47oY4c9iflke0JALMHs_znZzrb1": { caption: "Open-air ceremony stage with white arches · Ceremony" },
  "1KQeemHAZE4FTuPr5CCmDplnxlTDIVSwJ": { caption: "Embroidered kurta beneath a speaker truss · Celebration" },
  "1fZhXmq8-0BqPxt6OdZw0VTBgqAAOE6gP": { caption: "Dancing in a gold ballroom · Celebration", people: "distant" },
  "1xdKykEm6R_oJeS9PMa4Jq3Fg5iPKsRFK": { caption: "Performer on a haze-lit stage · Production" },
  "12KS16q3XePrJAmq3DCsgwkvDmCP_tN8M": { caption: "Father and toddler before a floral arch · Celebration" },
  "1i0f-0uwvJ9MmhqDhZ1_N60DznRunbMFk": { caption: "Red blazer before a hydrangea wall · Celebration" },
  "1_VCvemG8yQw53fQHCvfeTqOpfYtcqT26": { caption: "Ritual beside the ceremonial fire · Ceremony" },
  "1TXKFtw-TXFFXY2kXE2m5ooLKiuYycCaY": { caption: "Red lattice booth with pastel flowers · Décor", busy: true },
  "1rghsSq1veekVcruy8n8ZdELlqf5VL2Ac": { caption: "Deity statue in a glass case, frame rotated · Unused", roles: [] },
  "10MM4vWWBP3BM-v5iA1I_7wNlK2Zs1esn": { caption: "Suited performers before a blue LED wall · Production", people: "distant" },
  "1wK62jlGIj2YtnMCENMBr_omj-zmZPlWu": { caption: "Dancers before a red LED wall · Production", people: "distant" },
  "1A4y3g3k1tqUMGUSsVsxERWHQUYsXt9o-": { caption: "Dancers between cold-spark fountains · Production", people: "distant" },
  "1VpfNcwb3XG1-UMc4CkwV4gdlSZrTJpfe": { caption: "Mirror-mosaic elephants on an outdoor stage · Reception" },
  "1kfdbQXzMTtx5l4Cbd0NMcnHsSrNjb3-I": { caption: "Floral sofas in an ivory ballroom · Venue" },
  "1WGAbmBmlDNt9ktQUZ6VJu9xMLWIz6Ghb": { caption: "Live band beside a white floral arch · Production" },
  "1HB7jXfFqtqIQmepN6DXbpUDHVdBtXw4t": { caption: "Daytime outdoor dancing · Celebration", people: "distant" },
  "1Z4EC3l425F-Bm6-uZTQ7EcIyMNv8HElK": { caption: "Pink balloons against a pastel backdrop · Celebration" },
  "14Q8S6tU76seiJLeD1SU2RkiiNUYT4SP7": { caption: "Yellow flower sculptures beside a pool · Décor" },
  "17DxJ-fiRjOAPYvrFS7fihCNj0MlCrnk2": { caption: "Sunflower arrangements against pastel windows · Décor" },
  "1n3lfTSgS-952kOnOZVv8tTz0PPrTfRC2": { caption: "Daybeds and chiavari chairs on a terrace · Lounge styling" },
  "1EEZdabeWrt_sl3wuhZn-VvdSMIx6VA8B": { caption: "Walkway of pink wavy arches · Entrance" },
  "1lJbfeSwmJtcckYFyav_XCLban-GILGHX": { caption: "Ivory ballroom stage with white floral arches · Reception" },
  "1KEqaLeJksvJosN1aOKzcS3PUPPwAP9n2": { caption: "Columned entrance with a crystal chandelier · Venue" },
  "1j0YyNmOmxaQgyf-PPidHeDt6HqSFKO9U": { caption: "Maroon suit against a cream pillar · Celebration" },
  "11axnLN9spQalDPsRZ1rp-yi4aSBfCv1b": { caption: "Peach lehenga before a floral arch · Celebration" },
  "19crBMzcuGs1rlilGEUVSz33OFlMFKVW6": { caption: "Groom amid a drumming band party · Ceremony" },
  "1FqNW42khgP5Up_G4ZozVFJJMMurM2efO": { caption: "Dancing before the groom's horse · Ceremony" },
  "15AHF2dZmKTu9eOeUMwHJxcGMfPtpdUgg": { caption: "Dance floor in a purple-lit ballroom · Reception" },
  "1UM3lZyQAgw0tiI98LvepPjPUTJVgLrQR": { caption: "Father and daughter dancing on stage · Reception" },
  "1o1IWmyv-yYZ0Z4QsHo61hWbK9TKYEULs": { caption: "Dancing before a blue LED wall with sparklers · Reception" },
  "16Eykph--U-ba7ipzamXX2JCoPf35qq2d": { caption: "Lilac lehenga on floral lounge sofas · Celebration" },
  "1rgTOZsvrHLbDIHDBCG5nwRPHoAFS_pFA": { caption: "Blue balloons before painted windows · Celebration" },
  "1aOjM7cEE5U8ZbLOntuAmRP99tqvL2X7v": { caption: "Pastel wall with shuttered windows and florals · Décor" },
  "1gf-QbXJ6DRKfEqt1oQVwJRn0MmUsem3s": { caption: "White kurtas on a sunlit forecourt · Celebration" },
  "1jpuXW6aP8fn-cQu1OO-ZEjnzpGqpeH7c": { caption: "Two dancers before a purple LED wall · Production", people: "distant" },
  "1A9WrCcP4KvxWDstDHdypHn2sDvC0je_w": { caption: "Dancers in lilac and red before an LED wall · Production", people: "distant" },
  // The single celebrity-folder frame is held back until the owner confirms consent (DESIGN.md §8.2).
  "1wHacY8pfh5VniudcsZnXbsq4QwOy_1Mg": { caption: "Bride and groom in pink and white · Celebration", roles: [] },
  "111D7Zr1bnrXQRG16rGrLhIzaQw1YeVJ6": { caption: "Folded arms in an ornate hall, frame rotated · Unused", roles: [] },
  "1lT00v7aMGMqSg8_rr1ooLteStd366itK": { caption: "Peach lounge sofas beneath chandeliers · Venue" },
  "1LVol5mo2COi0uTusmsMN8heF6G3y6sRE": { caption: "Dining from brass thalis · Catering" },
  "1GtY7ck6bcQEMTJsCR5C7xAWS7jSPomr9": { caption: "Couple in a flower-lined boat on a pool · Destination" },
  "13k2vfjcw1gkE3_Oy-VzalisSoHi63pxi": { caption: "Silk sarees before pop-art backdrops · Celebration", busy: true },
  "1pBkjJhGY7jIYlRJSM9LbPtOZbCHf4yx1": { caption: "Quilted daybeds on an outdoor lawn · Lounge styling" },
  "1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8": { caption: "Rose-edged boat on a blue pool · Destination" },
  "12O55-1UOeO22Iav2uwv6f9sOVbTFAl0l": { caption: "Petal backdrop with hydrangea clusters · Reception" },
  "1AVFFp6b52g44XQBKAfl6NOFJEgs376JF": { caption: "Coral arches with hanging white beads · Entrance" },
  "19U-aj1LF3a0WFAyfavaGmVx8kAg45-X-": { caption: "Draped reception stage with rose pillars · Reception" },
};

/* <media-exports> written by scripts/export-covers.mjs — do not edit by hand */
export const MEDIA_EXPORTS: Record<string, { local?: string; blur: string }> = {
  "1jolQvQLpHIKY9U8M4XjNt7hRgAPhGJ4y": { blur: "data:image/webp;base64,UklGRkYBAABXRUJQVlA4IDoBAABQBwCdASoYACQAPtFaoU0oJSKiKqwBABoJQBWF/4SAMymz+H+ImY10WdL2p6BJ1Z1h8J3xh+PbB1W9UX4v7IBeYIoAAP5rzI2WhkfvjzMq8TfQf7yyA07orUDpLbqjjxRy5qcYpcmjQS0Cc03gT5gB2/Ix0BrnVvpvpULg4BNBm2Bcyt5LusAjxSjLgkrz+pyLvPKRyRiNFsU4s3U6IQhhiSnG8GwzORZEOqv/k0Gy59u//CZqTpC1qXD+Yrt3oIZH9iUJZYcyJIaGR1UtbM52zHjLqDLeZxGCiDaXn5MZld0Kx/lWA8cmvqATc7e5+9cxiywcZIFws2qR0/7f7l99GS5wwbS+eUjSpYsFjR8fIVPyvrAdLUhp5Z4tYz0GtpqyEqSzZ7beZKszmDvP961T1PJCq6XgE4goAA==" },
  "1Lre8QEM1XfO56HuhSAbtVTv8IMfISOI0": { blur: "data:image/webp;base64,UklGRkoBAABXRUJQVlA4ID4BAABQBwCdASoYACQAPtFgpk+oJSMiJWsxABoJaAB4qEPUZNhl7+VuTmBy2iZ132lX7DK3NmjNQgTgXCj+O2TTukcnnsTAAP6vBl9BtL4wuOyd+HhetYBx4skf8HrGm2/A4VodwUR2H9/CnM/5o0o3Twn0smtfmyfY030cSE1eJpXcNPoMZ1CaCiPbTouZJDSMU/m25kgML+gOZXppg9lNuuMNiUo0Svfoh3D5O5dgVz91ATLj/OaaqGSjjtARmd7i4aR2L7RAtDW80XPAJbrBvrFTM7Qjt7qArSU0ZlaHzQbCrlXZHmZHD9WnUpCNq8tCfn0/PfowBf1HJsdVeuoXTJ+Jn4vA+YzSUFcLC73/MG74ULztcqE061hIM12SpiltAyQz52oznJeuUKjsOIveNm4mivWCoSSiPMxA7Y3JAAA=" },
  "1BdaCjf0Xk-Vvh43QOi-YhKe8ioHZy0Ai": { blur: "data:image/webp;base64,UklGRoQBAABXRUJQVlA4IHgBAABwCACdASoYACQAPtFcpE8oJKMiKrgKAQAaCWIAnTLA+iZnWMUb98x7Qwv+6kRhJcFE83DBMHn2dJ/Xnbup7OV4BW3u821L+7m3pE8AAP6TV6QOOFJsQQCxgikAF18jzdPCAyG2rY2C3Gutq26U60V9m03Ysq/BPiv7YzCLbakNIKqAR1sWNTNBlH32HrHx0Uy8Ehg7/mzSanzS2k4STetBgAoPXIAM2/C0oc1rM8CDAO1ZTxT5i21epTujPBrXumvAPxy+F66QQorp/a352PJrQW7s3uCFVya9iofP7XdpFF+nK1wbk5QFk8KbCNFaPf1vb3be9wWrJ/IErUCNHjaoLxq8y9fCSAB/fkarSlPqOFqVivoS8d4eoHHZSTvim4k+iSAGVl0r2xSJz5zHKcxhnhpNDQPFb4N8YlFPN6tstw34ffPLCypEm1HhwFvNZzuS/F0cTW4SsSpWKacbCMy7dPdLqf+CCGnx8HFixBWyIE7VWaXH8WAA" },
  "1IBndYZaO7Blhz2OAMA1A3RlkIhxYVxnj": { blur: "data:image/webp;base64,UklGRmIBAABXRUJQVlA4IFYBAADwBgCdASoYACQAPs1Wo0unpSMhqq348BmJZgCdMxN6jNJGz8GnW6WGGHlwYt6G/dcPIpmmPPrW1Nqkq7V1d/AAAPguJ4RC/BcMx2HEFDCZXfIoVJHtMe0EroxvgjLpdaFeGuWR6kjZF/o09jzTUh95b8sE7osSPunRw/dBS7xovzGeLK/9LNKpVTQgU3gUNjrKjfTBofftDJ2FhdvBdfG0+Z1FsPE5kaLf0A1B7nm6cr+1IfKDhKYG8D5f0DBd7FnoBFtgt58wYMtmQSo3uQreCZSoe53cK5dOWbq63FwilsfbyZfAzxbcD/27+KSm+r26tRw+J5hqA3InqI41auGfbT+QWpijaiv1d9MAn6QI0WQnWWtOpcWjbFzNyrxqV2xxNr8Ti99GDGUOw7cl2LwyKsANYSMhiymaro2wIx3aeagXIWgKA+dEnwtXs9ZPNwdU1dkLgAA=" },
  "1lVUcnKgYd5oy6NbI8G-1hZeEHSIm4VAU": { blur: "data:image/webp;base64,UklGRjgBAABXRUJQVlA4ICwBAABwBgCdASoYACQAPtFapU0oJSOiJW5hABoJQBS79Ejdc+Q7P/Kqx+REpDkdpaMJ81voTTNCwhU9SvXb0AAA/vVRMPZuXFwMvShK4w+AwWviACw1woiIkYdHbYa/VIHKRTYi+LJVnb/fisW8qq3Hapkg52BRtz1O/UKNSwwg03VV32P963lpRxyA2U+6qud70uRjLBCYZvN5SGF4qP4LvWeIl8GmsNN+SheIDE5YntcPrkDKGpiouxGsqbW5CBiySD9yCXvfGpBWp0nN+IHXh3+EG52Ho8uuMS9y3lPfJuyH9Un69ddbmFFEZqXdAZWMQPmtVRcPhAVNhqs/w6P+itGA8DMKoRFbWPVnQcmE1XaoA7+p31cJScErhOcZkIypj8xn52OdSQ5Vx4QAAAA=" },
  "1C7GenQpCkyJjkL2lo-BlnjAuMKSobSNp": { blur: "data:image/webp;base64,UklGRpYBAABXRUJQVlA4IIoBAABwCACdASoYACQAPtFgpk+oJSMiJWsxABoJZAC7Ms84DKAtyeNmV7D7s8EGfw5XhFP6cy+XNtvUPO4QLiGwycGFykzTZWc6oC6Tz9mAAP75b9GsRiMeKFxstiCH7hxiteFxfhE38Vqwvn+Y4RlLzFNSYT3OvnGBzzNnPKX7qWPyYzrPXXNeKlqkuD7y+fs6LfucwY9HNWDfquJGJ/f2RF27Y0AbUUTZkJcJbHqLF5VBRM2ZsNpaLA7QEzHvGXxgD9EF7fF3ASY0SZLCm8StxtbEfr7LduInR0005BcJTK6N1wLu7g2CZSprC8YEznyXuUBaub55xAFS3L/AI85qNKulR/K7MDgYwlL4ZhU+2Pq8mXp0qpyM0kh1Gjw6MS+naDFmsqq3K/wWgkh/BI5+A9dtICw1u8WP3worpfm6IfHxM68ePqFWVEsU0keOlrJQP6N06l7AGkGb7XjIvSLYe1tUSPyGZ/RQW8OyOmYW46ue+W/c9uJCcR7zRnUnckIABwfvEqj3lICwcAAA" },
  "14olXTN-QcacQSSq1zELaNJlTODM-lxZR": { blur: "data:image/webp;base64,UklGRj4BAABXRUJQVlA4IDIBAACwBgCdASoYACQAPtFgqlAoJSOipWmZABoJQBdmdJ/ZaS+bBtskUOyvw51UGwaTR0N0z5H9W0CsZbhpjYEOSAD+7OFrdGLT3xhqc8BunvcmlnX/KgEDOzA5MrlapMtTopDd6kR6PyidpHwLOb/RQOx9icVcHqmsUYPucENZ1voQVoxVH+4BPCCQdSAWfiVVwbB+zOlwPAU//lfxb5L2ObyDNHMLf3h/8beHM3UB4SqcskM/9oWxrxt5mSpgShObnua20fiSlda3AgObpeK9EcgluB5VB1HAd5cGVK2+hZx998Su+2AdXbvUVBv/nMCDj8KIICKtUU+sW+J+ZXDp/oNISaVOnndL02X20Ke/dk31BGO6sWVAJrlNdSo0/vF7jkvHTdVPVwTEJtjjwTylAIJDQAA=" },
  "1k4I1GTnmk3-_t214ogS54Z12MqI4C5Bx": { blur: "data:image/webp;base64,UklGRmABAABXRUJQVlA4IFQBAACwBwCdASoYACQAPtFapk2oJSOiMBVYAQAaCWIArDKEd4v8YjhiCQ+n7eZ8mcSecFs1U0tpu7LbS1FeNqHprYoOX0vGaP8AAP7wK0TeBZvNj9zzSbVHxNPHVl/gIdz4tkLltRXNTRQy11HXpsBnIxap7IZ/h2HENGMy2zh+ujNSPmD4m7ZMSnBKRXmZ02di+2YQGCC05xxtb4oQzYQn3J3FNvxv9rUtinHS7NkDmtkUD7ElrYrhmLeGfodWAh8M8hnk5CV48ml3egXRhJ7Zn/I1NmDTKj/z3zXvCUwu88cPii6zt4aPOAW8nhka1lhfobplpGwqoihHJMKd5+1p48Wmo5FTGtY+WY+E9PIKa39Vm+StQuOE1EaMsDNh6uJHrXL4iC3Tpw7DyPHK9b1jowJNblEPq0H30gCErSaBWmtyDAEohsTLY4LVlydqybygiApYAAAA" },
  "1D8_JM11YOZhdtQ_iyLylF0rW3zfIBNg5": { blur: "data:image/webp;base64,UklGRqwBAABXRUJQVlA4IKABAAAQCACdASoYACQAPtFUo0yoJKMiKqwBABoJbACdMxx458eogVWssDSlM3iGtf+Q+OpDeJqbWIJktsgLUrfwzP2hznWOvdKAkQAAAP7zDfMwZmeYfiitZOVJa6EdBz/lujmscAqFSTydvCA1o4+Qa4Q3oEOCmflLRy2x5rKJ/ylVCTJqhFs+wHTWEQtHQC65i43b4nIT7cUKM7bPGFbv/rZj6Lp6cO+oESdCD36z88cTmkgtEMoSLFFdiE3I1JuZ99JB4wC8WB+I9MmCHKKQaC+nuGwd0IpRcZEDJN+PD8iPFt0AHcfhCk8MGd7fwPBCkieRLKI9MLX1rlWk1FSlrNTCVyZd/6MUxHenhcQfBFPmXN0BQ6VO6xWcL5oCpOE6YHIrbOhrx7h6YiWkw95tfFF3Xlv6+7lu+2PGsePtB0zawdAkZ1KK4OJlX7IJxONt663yflSfCkhi93bX/oCX4EWkLYZb8vTvu0dKvwMiklbgi4JJiN5mcbU/IzhtkJCbH3363vQADuEqqmHp9Hxg+Qw+RkF9/8/uu0Bc7qLnhhwAAA==" },
  "1qwBHFO4XSdHXCh1ZYQ_AF8MSHAwlpHJx": { blur: "data:image/webp;base64,UklGRlwBAABXRUJQVlA4IFABAABQBwCdASoYACQAPtFeqE+oJKOiKrgIAQAaCWwAnTK9gP/CK53cXNqAIdy+t59MFaIV73QuzeyUzxKKHQcKPm4taoAAAP7atnodWfQj+/yWBJqfxGjATIB7E9QDvQLxfgC8SpHA8R54HuNT2GiAyhKOjBYkKfRqf9dnhJLOoIRFgnDxWthCqvneZQGCBfSMmxB3r3aJDHEx7PiVI7u/vxUpa0crAY1kZiUgL989WcSPbpbzNJbe869fwukrdxtoNAsjTQsAoH0/GhNS35bda5sR8SecsOb9fe+AUSCKKI+EVmbnn0FkOmEG64zucvWSnD2rDjLY925BGuSZD2FuwVGS7SoDgTOV54tDXNFbrcoeBmz/dOd3I7520bIOsyYBVEXhVRNiXKvQ8zOJp/bMoHFHVtJzMmKJPtTy9gIGM3lTZVtTIwCLcUO+hkB2uWkAAAA=" },
  "1B2YSBTH_da2ETWf9xOVJ68lPx--TC_n3": { blur: "data:image/webp;base64,UklGRvQAAABXRUJQVlA4IOgAAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoAo0vkNF7SbidC3B1QAAP6xqbd1jRysM8gmiy9cc37ov12u8UOqcbfYq/LGErGkIBzvpyYj+HC+J4fxy1S1TdI4vB9AYBhJmB5ZnZfbclHdRGE3Wrw0E2bZ8+Dvuqhg3kmFEmC3f4JmJeH/eyfbdhH+MXXKacY4raHP3zDRgFdkFL68m73b6Y5InwO/3GkZflqr1fsD3eZvyv7Hm3dkztHS7KsfEF9c9k/UtNL2YOuSB82oTbQF+3vTz4Fk7OCYDVsaw3/7/zVhQAAA" },
  "1c5nKDx-AEuP223fKQFSOe0j_-bzLUn1D": { local: "/images/covers/service-cover-birthday-events", blur: "data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAACwBgCdASoYACQAPtFYqE6oJKQiKrgKAQAaCWIAtvfHSGzAACaRSFwyw0ScxtwIiklxjDNQI68H1e0xmsCHAAD+5xmSdo66GbWq8CrENxzUMZasKzhrw/67bmNvFzSsfgqH4Tb+CLhRrzj0WXzHSl5Dht55UKcL6jvsdz3+x6u/LatYaA+cg/u4ckiNQvjWRhQh6rAYo2aE71pD/qeF8gSjiBP/ZvN7bst2W7LmWK/qxdzGWSf/AQhl0FG+yDRU5o3Qg+B60IAhBegAAAA=" },
  "13_DE-DhPwCcwbEqkxrg43QwIOKUbqlxU": { blur: "data:image/webp;base64,UklGRswAAABXRUJQVlA4IMAAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZAC7AYwSzwjucO7GTeVUnavI25IA/r6JhMLtlpEYVkc8PTAwwEJ1z7chAFj+c51ODTVNQMgz8ybXghlU8J9uxZEbMrr+igmzwWPydJrAgx7zQwonaNVxmho/LXLeRGdZPJCGJd3/8iwnskDbdfgpL/0Y+jvwJ3ODKvaHNuJz0+EuRl00nPAul3dfHB7lERBs5rf25f+Wx77dAonJGIVnXbQiQgTAAAA=" },
  "1gwXQ4oHSU0CRUbhtY4n-EM1GFrhb1OQ5": { blur: "data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoACEcGD+2xvrQA9pSkgAPr/wu8N2gNQ8AqDdnrK6rvmhrany7smt12G8ceA9mWbW/p8xjurfZ1d8bAbpACyK/kVTReq2Rl5u+FNOdVb7g5F9dTwC/kqCuCGlP7IuErCIqKwmVb/Cvp5InVDXD4046FMjQiBZE2mAvDbIdhRMrYaOjYxJTjAIYGQAAA=" },
  "15Q40rODdvH5deDWto01k3xADqdPpkzxN": { blur: "data:image/webp;base64,UklGRuYAAABXRUJQVlA4INoAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJagCdMoAlpRergXjA6k90Oq3ZDpQIAP7p4jQAfae+QOLeuMor24ikrQU4L4c2xMaIfc4AlDdN79sjtBpLqg5dVqzIIevBUSzP2Y3N8+UPXWy6WuRZ4TC/yWy7lo6DoKSfy/qwRx6wXZ4O+rtRVnXqFLN5a/jVRb++j+PAT3jUNJNkqNTDnXj+AuKaxBU1TdxcLsuZsg7yB1xb/T1ncgwY2t/eJw1p+a6vfOpSon4kuJC9K8yRKxX9/YDBueJHS2QAAA==" },
  "1kDdjV4TpcglIMteJOjBrAB2JOsALq3Mq": { local: "/images/covers/service-cover-conferences", blur: "data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJaACdMoMYAEmeQCV3sHKbnSDZ7fKgAP7c7GOnAJ22ZK0TeMwDBXyvF0xMEJvkmJNyunBiZV3jTII+rOdtwZXwJKSkx9swU7UPmq+XyGXGdLuz1JSdkTbUF8X01W+B60103Ej7ft+gxLzmX1omAz0VuZ3sNg46648VBgsKV4gN7baHYMtHUzGTgAA=" },
  "19QeXWtgUx4lZ011H80dLGgbi3V-kkuXs": { blur: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAABQBACdASoYABAAPtFWo0uoJKMhsAgBABoJYwCdMoR4GClWkx0pKEJ1Sc6AAPakvb94Qlc0cmSBku25q/HadEjOhvl3cdwDugXHxDcgGJl8e+qg/D5U2ZMR/AHUMS68GqDGe8J+8lmgkzN9TgrJuCkErl+W2OZYolpns4wSaJtfvqzetw8k4AAA" },
  "1SqaF7yzJN702yZJIeGWSIDcSj7wTvclY": { blur: "data:image/webp;base64,UklGRq4AAABXRUJQVlA4IKIAAAAwBACdASoYABAAPtFWo0uoJKMhsAgBABoJagCdMoADKkssax30QYkFugAA/gObsfj0ifOLudLwXDW9fmiN72s8C9g+nqQs6Bvv8WrrJbnVH3pokFe+5YD2hBJZF/zRtkZKYZ2fmi4ZlTXQUAgIVkQFYrnMzJhg5XsoNwcChaNl03NKYEJ2xqYgi3g5LROZsZB9a9D1PP7Kms+Eck950b8AAAA=" },
  "1x2ZofgOiIejQyTr7xL6qtp8qnckzPLVt": { blur: "data:image/webp;base64,UklGRvQAAABXRUJQVlA4IOgAAAAwBQCdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoMlmBAtgTNgoKk/LZW58zZaWCqgAAD+tshvdsaFy13F5fuKxL1zFX7H3Ipec263x6qHVMgz74P03BBMa2vhAGsPDxj3MXBsMY4FDzhur+UxuGal/1pBvaeF4HTp5Aw9yHCUW+Z02NmQBcusmQL+bQ/P+GzXGyQnRRPHMmdgIit215veCf4YwEEvpQjbKBrupwHf+hzHeqtjl705s6Ig3+wMVRoKrlxd/nRb/BhcKEgOkzxN8CWQboahUVnuOf4sy48hB0vvSrD/AAAA" },
  "1kI5dyUe3ISc7EUbxSRTSiHE9vtpxUO4S": { local: "/images/covers/service-cover-destination-weddings", blur: "data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAADQBACdASoYABAAPtFUo0uoJKMhsAgBABoJaACsFQA5/8bwLgiYZjWYXR0mJkFsAADh4PjFXTkZyf2YMdnCHvPmQ+3e8amysd92V4w9UdTSULKMYq84lO1kc9j2cEyadkwl8QUg1vY3Zq87ESo0353ewNdDSr+FIgQ/PpmZsvmc60Kt42XyP0O4p2acccJ9/QkA0NDDlZ441FHQeawyxO/PropLjhyY+4Unwj5LV4mfTagNm70WQy/ruIAAAA==" },
  "1zZDjOmcrunL0OabHO-dPYLCH3xPZlLEy": { blur: "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZgC1IUC2tgLF2d97b1H/Pn512vAAywgQ5sBWsBhW6s1QBBX5O+gHmavfcV+Zs5KhAxlVHtsugAguXvgmgHPTMRWpuFvyBQah/ZJfUPqnJ6mKHnw6L36IckYJHLAFhgLz/AGtw7pXJsiLg0nHG4oM9xRmd92IAAA=" },
  "1cTbFJyaHuZm30OX4ioPvEEe58bSna77s": { local: "/images/covers/service-cover-exhibitions", blur: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAADwBACdASoYABAAPtFUo0uoJKMhsAgBABoJagCdMoMYDBA4wKp8bsC4L8eLv7jWBgAA/uX09ueI6VtKW0IOUXSSk07RH4TYyec2UKxGa9BdCwUT/K2dnoXB3lFOdkXbor7iLqfTPMhV5q+9ZdeeEHf+9e+Bu8AIeedxR0EGS5GhOKxgcSmyD0ij3v+F5hQWAKu3SYgCq2Hi8/N/Xh2Nkp/oN2mCAZIwcK40O6cJmgwYTTmS++AAAA==" },
  "1FMEA0jCZXKEfSl7QRzbslrjYDW50Kn3i": { local: "/images/covers/cover-home", blur: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoFAAAVeE7C/alT36mC/QWAA/rAewRB25gUPu7KvQAm+XtQZK6M8+eZqCraMR0VpuQrh472CA8z43QcbKGe73tzj3IdNbR67ScjJ4MnoB1rqPBo8zMpREx+I2w27Bmk/Q11MsK0RgMsEyEosnfQPlipAAbVgUtk2+Dl0eW6Jp/GL0C7tWAC/3htit2iWu/UAfA8QIAAA" },
  "1I0TH9jcxQFoXm0YzG4f4rFWaiTzlixW0": { blur: "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoMYAElV+Kv7PTOdEKmL2DsAAP7ZDvuORmK2183zq9rkguhR7qm0EdZyMANLyz1IaEi+OFoW+RBGaVgY6OGGrQYPrB80jwPbvfnYfBRS2UV997+qdJXgrBfBP4hAUZrtUJyFPqZDF7Cz+g/VqKw1aFAA" },
  "1Zo6GuTxQdRWp4MrgkMkAUwtG6o_Mhlbh": { blur: "data:image/webp;base64,UklGRkgBAABXRUJQVlA4IDwBAACQBwCdASoYACQAPtFYpk0oJSOiKqoBABoJaACdMwpGlGK/QDr5l1+W6gRucOBbDQS+BmM6BmEu4onNlbRq1+HhQr/Q3YAA+QuMkI7QsX4AYgSVStXElGir+b7aIj/7kizo5kDNpyJTieRY4wIq8qtvuqUEGG+u8biFqSOU7pj97vXenUl+cinSHT2hYfJndXPkVhfvCm+F4vRLKAQR/u/P0X/J8hAknELtQkriJbzI8uwVFsQ917aksvA2CxYy7yZC5grFgkaZ+tkeCfmzBdL7iVLnIi5o1JddVUwikB1v3Xpfe3x9rh+GVPc7H2VgPb6NgrIH9/YBzMz8YYhMghdsxbVkqbXosXbLNBYY4HWfj4mfvyCPxkk6alQimdwz2O66rs403ZyuuczvP50vUFnr0FwU/o1YgdUBbgAA" },
  "1d0Jb2dsajZWuHiVv4YtB3GciOhwME5CA": { blur: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAABwBgCdASoYACQAPtFgp0+oJSMiJWsxABoJQBdl/+BQP/lzLNOVVtM/yvYlQgS0muQEx7KpUoJAa/4YB8AA/u4HGF4lY7edMjMHdaiOaUjRVGb6KfA7WQXWuVvR2gLfTZzX8qAicVkMYFDqa7lpWDAgdoopkp7Y2sbDXHOfrzXoYhWYlBMJEfQ/knkmPmMrDcJEDU21JG91L8Z5bEGsqOGwULxg6nxQ+E8BA+8/Fo0eSIhH7QVlnEj2d4x0Xp/HYbaCE6oVImDgTxQtlLOyM3EAAAA=" },
  "1SGW0HH_6JgU_xpOMsyt3SL0R6MkB0URk": { blur: "data:image/webp;base64,UklGRmABAABXRUJQVlA4IFQBAAAQCACdASoYACQAPtFeqE8oJSOiJWsxABoJYwCsM3WEaCPKebiZWU3LCd7kyzqWvxSsZe4iOYgyJv6j0OJ8iwHbz+WpAcCtAJEAAP6zCASOFcmXcFmaJkmDBK1iFDc3T/YNT+95ibhxFPRdgd4smbr7n6Zp5TltqszU2PCXyy6jEM2YH7+ZOQ7OZoNEAsaDOI39OP1vgKJ5Is2d2XZeIBFkAM1gJSLBZzutg/Iq3VYsZFFdeGrQE2khGWpB6WGWZmxXH3MkqTJgH9MM2FcY3jGywDKjn0g7dqoZe4WZW+r6RtDun2tfXFn/SaOU4mORsxsDbMPNsBJ/viStKPhNvV3pG+szR/r0qzpqDItIxvqjz7sLcFB9/Qa9QMTqw80IIQ3SZvphcTa/dVZGwpjAQ0PweQMrDhRwPBTdibmFgnylcPu1cCUR0IGItqLp87vBrIUzAAAA" },
  "1NlfcO9YcD7KCqQMnA1os0APUATuZA4B-": { blur: "data:image/webp;base64,UklGRpABAABXRUJQVlA4IIQBAADwBwCdASoYACQAPtFapk0oJSOiKqoBABoJagCdOUFSHAB1rhh20ozQMvZgbVHaPXghpoTAUd3t6qmYyb3L04SeesadvxaNIZAA/sNjba50jbPEwBBcLrDMp3bpPqcptX3CdSo3+DuEZdMBciQC1XLThtYcsjGSwTTlEMdnAx3wDIpw7vt94j9325rxU+uuWbfBzCRgxKL4vuFdSC3f9EMtIL0taJ9wFv4MUw30ucw4NZHrGZiq63W/sVbgXxhaeTz5UbUxSYLvw1JxmVYfrWXrWlgWOszuLsYZZFBZPwn4k+LsqhO9XJ/pwXtFw7VL2BMB8+BeIwkJzPr+O2hqwk3DFAllLMKEKUL98WQftfJHJntxOkC+9fQnu4BRzVTdj+y9KAiDL6jG0eGB+BQks4lMTrpGmYxPsLK8uPZk+HHA32we5h9gTRRbO/Cu6fpuT1qvxX9PKkAhl8DRVr4FKe43IAfvwofP8WRSenITP+44NqK+1sGUhSGuG6SbQX+c0FrmMgAA" },
  "1jp3Isbt0QXMRfMfoYlYskPUh8sXnLh_m": { blur: "data:image/webp;base64,UklGRmYBAABXRUJQVlA4IFoBAABwBwCdASoYACQAPtFgp0+oJSMiJWsxABoJZgCpFVyqaPdKtxUXustUxTROhiREf5ksRqg6KRo0vDFR+BjmBSUQT2z/YAD+9hEUujd+jXxMo5qMizlF5f+/ANmkRgy0vi1N7J96bYAE//i48wTWw6curSGiTbgBj55nD2pWKK3ChOqD2FpqLSvdCvEDzMqgi7f5ABz2kLn8ArqapcSxffYL12CCEK3EHvDs88qhlkFTNFgHiq2Mw3KVdJ6B7tKirEu6gDwvNhKGMLscH7CPal1aEuy++KfRUW2ulIiEr4K+HdE58JnIja97KFU1pI8139z6mDN2QjzEcyjlWyjbUx64X69fOrpn4EeXhA78hX3mJTxl5sALhMaeDXbCPqnweasSywGlruNGHuvsvL/Did0Uf/T+3PRHvI81Ee5LBkZjgEy5lgYge8S5x0OrFRqRYwFJGgiFN2noAAAA" },
  "1Wgb3A9TwWEfvw1S7pn241sQwH1CODEsq": { blur: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAADwBACdASoYABAAPtFUo0uoJKMhsAgBABoJZgCdMoR3CSAKCwYyqWDfhDuUmSFDXcAA/ufWDslOK3t5dBetJbdgP2L/E2uFqO+CNvJabn02hzaKO5vFzQwluCARc8SixJUnvuYf7CMu07eFsLTDTA0eEKbdOND6b1lNQR8kF/eTtPXjVbwstvSu3EfdJPHSYMiGAaODtWOWQVKXbdAM84Wm1tIApODDW0tBAaQVEbkwkY8o4vgAAA==" },
  "16RpMQBuJ6B3Qk1eq2N_LU4juvQG9wpP8": { blur: "data:image/webp;base64,UklGRl4BAABXRUJQVlA4IFIBAADQBwCdASoYACQAPtFepk6oJSMiJWzJABoJYgCdM6T9eTAOtE0/iK12ycBTkO2L8TNYue7OdtcPApo8k9posVJbWgwc3mUzkAD+7WGlPG8CSDrmvByfphp2dDEvmBs74dopcB6g7WR0XglHR8RXJxquDozgcXUgSbnzgntgQbo6fqs3nZH8R0u21nEaDJoPcWPTG3HO02Pp9qYdY5t6U/XdXBYGiBdTp3WRNHNaZpL3A08W89XV7gzTEpzGTg9s7tZ+WV3B4V/wAFdzYaWEiK8/qRwRQb4z2z1GrWGRAaVR7Y8s446kgHHyjHFauC/svfEUdLUBm89g9+0JnOODgmpn+AGvjNphbTHvYxKAPIaL1+NKNy8a1jBKO+j3FqzZmOC8TilpkMflMTKhFVcVeAt46oGX+zUIcJAeocpPBy6dJR2mSbgVAjdhFzghTvwuWQAAAA==" },
  "19WR9ZGNa8lmSdMaQ94dFU2mqysVIjrxX": { blur: "data:image/webp;base64,UklGRloBAABXRUJQVlA4IE4BAACQBwCdASoYACQAPtFYpk4oJKOiMBVYAQAaCWYAnSCKx/ip2t/6ztkEF/KV2YVJ77TB8cnhMUBUiDeJ/IhE4g06QgxTzQAA/u/DkxzwN6BxmGAFJZf4uZ/h0dvGtbB6GWd53FHSVjOMd/sFx6NMib6IVem5o+jbELPhHyPQxg+XxcQ9Ry/3zdgUHANrNNRfpqUGovKzlxE5OgwZF2Wy/idsHbzz6yoyeYwHGiFwVHETygRL+ymYabxEygN+C0hRpdCmQpA54YtWfWca1PhdeByj79/X07d0BUj3ivP6ZsxKKxCxzUYq7xxnRGEYRMKRhEPcuh6RUzZlwY6zSu4fPZtZfMoR1frBc0ct2CBPtjEG//mNGFx2xxSH1meobqe0mdDw8BITngCt2iKzHA01sG1mAtCWpNF948tS3UaQ6b2lpB1WwUeYc3Js+32MAAAA" },
  "1YpB0RlKWFSPUiie47muoTcB_93UpUwk1": { blur: "data:image/webp;base64,UklGRpwBAABXRUJQVlA4IJABAAAQCQCdASoYACQAPtFWpEwoJKOiKqwBABoJbAC7MwS7X5XcN2vg5v/JxHMbyzhoTuQNDEx3ebWsHiFKMPuP+D9Gh/N7oUB7hWrr9gyT4AnUTjgA+TlXNGh4tBNCscYWjlq8kaGalk+s/BJO6cYC1/MdIVzM6YPe3zRhsCgyB+YbwBsm7vwnoyih3HupeFaPnHKXseJRo/FZFMBVQNTrc+SfosNhhwIX9rJN20nqoJwm1QIFTzLs/fiydswOyKEV5fDXVnXuppCVZNXrWhwOKJYGdGYL3XIBttgCrESxaTUoXmAGy4zFJr2BmfMvfyOtw5rgX5atGMBx6jMisScOVxhDgWTdZauqrhyo5vUP2nnOKk0XOGJTOOQ7QVGQ1agamK/xDnHCfQUMpCJ3jnxtWCVPRldedp5ezxrqINpglGyhrpQZEf3Yc1YbI4fMWIkMyCVUKWR1eOsicg0LlZaVqL3W8W9c/q46mh+BKPZqtDpD1P6mVynL+B03/SRrbKCnDwAMfy+ZIx3yq93xz+yR34AA" },
  "13TF35eWflnClnh1Z_aNV-fkkMFMYt1YU": { blur: "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAAAQBACdASoYABAAPtFUo0uoJKMhsAgBABoJQBOgMYnTiVX8ZLMaNV3m0AD9zwgQTb77lA2lhMss/W0DxLcxoNxwfrDu3o02Im1wZEkf3iFAWAmhEFChLLTRUH0gjyJuq/mgKF+99Xjk5FXjgpIrj7o9nbX+L2E2UmUEiOdTYkpSppaJNQMgv934VIhSRlYQibKDFQ1tOBkAAA==" },
  "1akR7zJ8Lg01GWB8WtvWwO1Z9krIVXDxM": { blur: "data:image/webp;base64,UklGRmIBAABXRUJQVlA4IFYBAADwBwCdASoYACQAPtFcpk6oJSMiJWzJABoJagC1GvKpKNEXRiBMrtbxnNBenZq0fmKf2ms5qXxkuVwJgupnk7OTPe2kRqHnG4gA/Av4XQZYA70+KIPVBWP8ewQVIS8HDnb7TgTnSe8BrpRiyMU35M6jqF0dEVfYmOflyyXsRp4uXpEx4JSHerfNmbEleg1ETs6CwlUHwVZYUnBkS16uRJlEhKh/RfwIBNK0twKsVeqrNf8n4mRpMUTy3KuCnb/E68Hayb86tWNzNE8GAUCYEubMgR+dJVXVe4V4xisBT87wgTPHJPhtBvhn7OAj+EaaQAe/5HcJnPmMEosU6fWuxqt2YvaY6guRvToTFDFCLsedqDsHiosYLLR+tBHT5djn2OOt8hNmSr9dyu82fYvZXTEf2tseGO5Dp2yftAeIkGdLZCYN/8IPwIR142LW0g0FvkYAMRAAAAA=" },
  "1nVjxfKzy1gAWPaviMZRfg9cAwEvv8fN1": { blur: "data:image/webp;base64,UklGRmABAABXRUJQVlA4IFQBAABQCACdASoYACQAPtFWqk6oJCQiKrgKAQAaCWwAnTLG/UflmTDmF1IYI8+8x1KdElliZBriYRZenUKL6njCpxPj/zfyFzPwzMfUPQAA/uej4GCZk2qR803kBfBvZ+4O/xSJ5bK/SfHTFG9R1jVmPaXzHwEwZoy3P8gyqfkWe3lfpgtNV3dO8+fZi3WotTpkBmIgBId0rO39HVW3Zf8NC1t/irNPykmOl7h3dhBAgzcIKYtm6QBbiKxs+6nTRKxhABtXog38B5OFS+bXT064Cp74Rr64/WVja3ZMnXssMwz0hjzhAbwPK+BtxYC9a23AH2qb9P0P9DSi1So1pn86HWK37mQVFkjctxAMHlIWZy9Pn/MeWqMr+qFUd9wZBG2vXmwb2YJ/zUxgiz77QpNvT77QpNvVFI3Y2mkdjNK3hiz+v9gxhjBxOMAfZFuvw6aKWDKdtAAA" },
  "1BF7N2wiB4ddjOZEj_6VSiX_Ot9qRkjuT": { blur: "data:image/webp;base64,UklGRtIAAABXRUJQVlA4IMYAAADwAwCdASoYABAAPtFUo0uoJKMhsAgBABoJQBajUAS1oudM0+CsbnTIAP7QLRl3dmdajVMOLM3p3e6mUbVAW/mQQm+4YFQeP4HNk0GmqYS5QaDUGJhjNkJLkMTVIxR1h7hEA4x5aSt+DmBa4J10Tla4a4Sq+UCDs88qb0daRM07Ete2WZaOGsq3dDNtXv+GQVH7rzpQvR6JAEBL3ccKfkpqC/6gtqhXe52QfrsPl33o6m7A7VOpb98/ku0vpqLDFiaO/HCrAAA=" },
  "1VIAcBZrkLhzQwQoO1VDxYEv8MLOTrxsV": { blur: "data:image/webp;base64,UklGRsoAAABXRUJQVlA4IL4AAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJagB2ABEgbQ0rZyNPtgt9lTC2vOMAAMnIHKUPyCzTD84rocLy+xNAnBNymUq/ZmAtpH6CmZvA6uucU7g8pK+ryvTs5DOSCMIfA4MwKZaK0kHTFFTwtfu8t3avyAbh//XdREUG7AkBoVc3EYQWZjfggZjPhKjbhvscqTyOJhe6YGUbQJ0EucBthqjxJSVBATV9DMvw+fPeYD+uy3wkxD046fbYAAAA" },
  "1XTyhxvPesVuTo6p5iWr3BFX9LrBC5C9W": { local: "/images/covers/service-cover-concert-management", blur: "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAAAQBACdASoYABAAPtFUo0uoJKMhsAgBABoJYgCo9B6Nlwc4anMV3jBjwAD+8rbmhgb/BKa/wXuMp2SRX9DjyOd7272NnHblsAXaOW1HZ4us2bmxWMJPby10q/7ukfIIAu/an6syRQXF8uXCEnSMRz8cIUsI9y+00xxeU9WH2Atp9Y21Mw+XNyqTnMPhjfH5pAA=" },
  "1Jao-9BpbzYW1q7yEBvgSvkgFNtFQgrOm": { blur: "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAwBACdASoYABAAPtFUo0uoJKMhsAgBABoJQApgC4MUY972CHFMxnsMRQAA/uuKbhS+nlSK5IWMLH6S6aq3HQH3SHOZB7rjFXn48ZaxH2lUEr82FqsA1wx2/wTWqM0pDOwQhgENcQBpxOJfOq+wmzM0/s8rANpwCfNk00Azmaj0mTQ1Uq5wcaPbchuv+2qQNRxu0AAA" },
  "1ULB06kE7vj6_riTJFUTT63dJhgg5jerY": { local: "/images/covers/service-cover-celebrity-management", blur: "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAwBACdASoYABAAPtFUo0uoJKMhsAgBABoJQBOgAyUd7EpYXRihfiKC1IAA/t0tAv/3IQiXpufthvREhp0IlMIuxdbAbTu1MkGi5AzvUU0eESg5lVbWyjttfAFqB2ycpWLH54LzIEWJbtg9AAKVjBaP/bJBFVnPp825LRLxAKPLWb0BXbccYzI8B6PGv6vvkKVqcAAA" },
  "10yDcl4wHuk6mMImwCaB6WPwMWmAoRfW5": { local: "/images/covers/service-cover-fashion-shows", blur: "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAAAwBACdASoYABAAPtFWo0uoJKMhsAgBABoJZACdL1yBlfadpchPH9oAaAAA92Oxk27w9DNZXZIdiuKBO00wVPXaqlLmoSCv1ridy4l8rC54Q8DoDbs+0ure061AZR82d62D6DwdQJrVq9NTQlHzyiRqisajeutcN3KQskIn7ncrv6o/xNj+l7tEEwWrH3tLnMus6h0sylv+rT3Bjrj82NUvMuOzCAAA" },
  "1jnDexINl4RAHm5reI6PmJic9mEs-GBbi": { blur: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoAvQTOwkIWKb9y3QShu64sAAP3G/mZYSx88mzF1bxRS09gWd8vr3DFwpje6I4ivRHdL5UKWe0UeYFzV9ViQ51zPsuZnxmkCtqZq+htp4jJC5ZUb3AlvyjeQIeNpM4vrLu/iKnhB1Q6+Wed3eiWHxAt/WiVVozZwU7YawoVs0wHMoDW9Zcw7PdgKc71L713CaNHfLoAA" },
  "1Puxtl0TgR_Ckj4cooCOzbxJ_-Wij8ZZR": { blur: "data:image/webp;base64,UklGRs4AAABXRUJQVlA4IMIAAABwBACdASoYABAAPtFUo0uoJKMhsAgBABoJaACdMoAloRiV2PCgyQlFeHdqwAD+7eswbI7WV9nSBBlgr2/lWwaC3APSKfmuJsccWL7bFKfNnH4iv/kjoRSityPwcl2QFgas7yBYbxQbtPPSJ0bB2AimUej1skfG7r37FLUPMhNMH7a7s65PSu+zSvcgWsVCWe+Gwt5o3IDVdpjXrES/abUa35RtwZ1vKr1RXZz4N37wYAabEhNfzb05HjfYpoO3tgAAAA==" },
  "1kkQ489KInK9cUILQqaMKSKfW1Ox_qzXp": { blur: "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJQBOmUDX/wHmXLcOs6SGxo6y6AIAA/sB7aXBNJxG6RbwQHpbpj6vvaGGXzvuaedWN8QoNX/f8e69laBbZa/OzBjPlPJrxL655rQh46NM8LmibNsCERR1rCJqaORLqkLtaeL3N9cK4N4T8hCKLGlnQB1KALpoowf24+2UQv9rrgNsOzfyPRgE1FioU4AAA" },
  "1cxcQICygS2bmhqZVXEDZvhQ4peicSuhB": { blur: "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZgC1IUAA43nff1/cYO/98avAAMsIEObAVrAYVudh/YLYcdAJkOeZppMbY0Vu5AogkyxDgAguXvgmgHPAWl57Jlp6JYH4F2aOWi3QKZgY8D4GnI+sZ3c+oVI7qJrDQwaEVrqi9NEok2QLVfjf/F/J6Z8r2QAA" },
  "1zeuLostJ9lEvQXgaYzTPOeuPsbbN3CSd": { local: "/images/covers/cover-services", blur: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJaACdIExqQBSBWFxAH83OhF4InoAA/rb0V7sdNjvvk8vRJc4b1lnKKsyRBWfUWHiA1ZsX/iK35N7fjJEOD9pEk4HNkJIgIl5Fxa2Lg4oAR+QNc+8G2UaTAmBHiivx0V9mlayg9FJ3m1DVHIgBvBXLOvR7Az8ns/grn1StZi0hB7QXMthy/RJQMFxK6aFkUgcaJXmwLTpn+lwUTLqAAA==" },
  "147PGDAUEppxiw0JurWGNJvQnG12ru2Ax": { blur: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAADQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdIExguxY5sfGYmlEwEz5cBt2E4ADeCuvskoLYkL/fLWbW6P83GrDRyPf4Axmt2rCLDcRRXhSSeZc9iLkdeddl5GG6Zy40pnH7hdQ7lveYa8mSBagfa9tG+8wcUud9hLeGsfTH6CN8sAZtKdsxSVM53oD58OZX9zzBv25bIOSSlDPfF7787WkfyR72sh4waWY+MtAxRNuHc6AAAA==" },
  "1gPjYLh5nG39vdxbIp8g6ippQwAOsFiEP": { blur: "data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAADwAwCdASoYABAAPtFWo0uoJKMhsAgBABoJZACo9Bxu1ZDOCg1ANEuwAP3qQblIsNsRJI67f/kwEy3A15roEQByL/9JRtkRtnWwFm79E4KE4QKFDSfFI6f82EMM85EFpJE6DMg30I64FDbrw32vdwfmiRc4yCAI6zh3vxibzqpY0k6L5V29DTPZ0HhklsofdUMayLmHY/7YGuD8PHc7lfYe4yrl7ig+np7l3GgAAAA=" },
  "1XX4ZFPFfM1Ag8H6bqFLcPxfFhZmBxy6_": { blur: "data:image/webp;base64,UklGRvgAAABXRUJQVlA4IOwAAABwBgCdASoYACQAPsVQn0unpKKhtVgMAPAYiUATpnjw31BWmCCAhS+jTKpxQKoxhoAe02vVD8RZfknouAAA/t62FYG/mUbjQQBohp579aqtDgTsTtLozaQB2asJldNBV54Bk2EERFRgnjm9c1oVVj8PcC6PMAOfj2s66DGvJ/4U/h9gfddn1/62h9ElWKkc6C+05yM+l6NwCDhs0zyHnT1626SFIkVEoHPFxiuQLmfp3em0icRTzyDszrkJruWQ85oWUsabphZ5mYGgN1CALk5parI6i4tM78a1I5Kf4tbIeru4cz/Bofb7UGHgAA==" },
  "1cV9LAUnE0wYIoXUiI9LzePnu9-aq-el5": { blur: "data:image/webp;base64,UklGRmQBAABXRUJQVlA4IFgBAAAQBwCdASoYACQAPtFeqE8oJSOiJWsxABoJQBWGYwnGxpWuOF3enjiu+3aa4D1t1vsKhRMtRMDiP6oUPeniKxgsAAD+4VN9QhYmHSkvvKuApWpKYj24kjY771XNPITwYTR+TkBILCs7OIuOeCQjV2G/xraLqa4RChu9mm+LwPsiKtRnXuZEZOu7nd/qXmLtnWFzVLJmt0QaXgxJffjo84Zg6VuZnops5mX1moWzpBJXitsfsjUJb0/A12B200HMS9JLUDrM+xriVQnfDcVF+U0Q3sYMsCYD7KW4kJp4fuCEAOpwzEfVLURc0Skd9qtQyubcFKfeROqkrppcjgr2GgcTxX/P2JzFFkOLc/MXJvFHimFp0tfayfQOQQFUWmjHC16Ao7bgqJoTJXvM67kumHafA0M8G9SuMWc+70lsruikrFLPoMjvBsCNM5cTu2BxgYAWWT98UQAAAA==" },
  "1nOmnEux005RG_eleiTI2VBO3MywfCgiF": { blur: "data:image/webp;base64,UklGRs4AAABXRUJQVlA4IMIAAADQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZACdAYwS7bX2Jc8s/80L8m5rqR44yAD+YAo+koepU0FtLWeGFpJjZil/+F5EwkScaU/Net67hTlKKYbI6jzM0jKFq35JrqYua45OlxkhqUKX1IMnFmBhdXtK8wUywmucPzILJvUMgfId8kfLjOudCXdL+jjPKftZv7wGrVm/SITGRy1NKygGWxwA4OanuLO84YFUTt1ZKcc/jYaHGQYZDHfwZgd0EUUAAA==" },
  "131RPh47oY4c9iflke0JALMHs_znZzrb1": { local: "/images/covers/concept-cs-1", blur: "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAAAQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZACdMoQL+Nsmgxs/GSu8CAD+7UlhIEOCu/SORV3dn+m6qFrwzjuxIj7tpXWOGXrO/aPI04eICHPQhceWmHATAFJHbSJxGYB1Ya4JCSycbvll7YRb2g73U57X8oXkuzzGwAAA" },
  "1KQeemHAZE4FTuPr5CCmDplnxlTDIVSwJ": { blur: "data:image/webp;base64,UklGRo4BAABXRUJQVlA4IIIBAABwBwCdASoYACQAPs1So0unpKMhqq348BmJYgC7ILn88QcGsxK93KL/fcpE2XsBIF0JjPgDRuyaaFQZDyJ9w0QFQbO4AAD+4ZwmU76pqzUEtRVfij7TwRqN5+Az8DmovpKdg+3VwL036G+OPni8Oz0hUTlkU62aRXLh22tNs7ilgDGb8SrLs05W31yuuL3ZVIRqZn9KtPLbuDyMXzB7ppXjoIKiNqeaGSnkH/+JgfXMbdDe4Ycdx71Q4K9obAJ/uagCQI6fIQJe10ZhramiJsjRysGXFgH28+mok4vwnKFkOXkSUNzp00X9Cn4BS30acnkBcNwjhEe5OzItS/f/XL6MWYc9frNUhURSyToCSs0aWY+Kq20Ki3tcJzA1rgnyHYRobRXOrVfNPO6xVZzkvolaZH8k7uet/j+qlss/2Du5T0AUJduZoioVAHIhkvo7h7m1uy3iKkR3nD73exbHuojmf0r2buPW+TeEq7zXkI5HKjde9Fpvyrfuc4UdrolwCAAAAA==" },
  "1fZhXmq8-0BqPxt6OdZw0VTBgqAAOE6gP": { blur: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAABQBQCdASoYABAAPtFUo0uoJKMhsAgBABoJaACdMoR4Gc+lB1Ld/MH6uRdzCxxp+9ZiVAAA/u3B9WnvDjoVX5XJwy2uyoLbB3tuscftH1r/zz7o4yskgrRvI58l2+mIgOYf6heg5y8OC3cyo2PIGVdbk8O8frK3fQg0vur4lIbDkTT75HeTGoJ6KlkJ2nO8pASM4505TpP3J1Xoijg78D3NrHfkewF9QXnmVaEVbooYNkuvKgGUc5Mm3IBAjSVO3AHnZ9NuYfbpUZQG6hGiY9GsAAA=" },
  "1xdKykEm6R_oJeS9PMa4Jq3Fg5iPKsRFK": { blur: "data:image/webp;base64,UklGRgQBAABXRUJQVlA4IPgAAACQBgCdASoYACQAPs1Un0unpKKhsBqtUPAZiUAVgDGXjVWd/7CY9DhG5/mTNHHJlv+rdSwZAXzutRdixDDwAP7ZUsyH2//5oaDaCJ1iV0AqcxZFmN/29d5Wc10/+9nNHXvGAVZnBz/GRq7V4nXRyznoD8IgVjkM7CBbXMMVL1HM4Ps/AWyyW8eLIFptdWeeoX/w875tqZZU5Cjqn+G00aKcOfQxisrPjNFKehzEADNZrgIMGhevCBuoxSxqafDubQwdIPdJ/9nyHJxm+m+QUVyitVKmFfDopbWtc3GDfnKT/4WiRiIZ5yvFuyIbJAb9lmmBWhVFSG5IAA==" },
  "12KS16q3XePrJAmq3DCsgwkvDmCP_tN8M": { blur: "data:image/webp;base64,UklGRl4BAABXRUJQVlA4IFIBAADQBwCdASoYACQAPtFapk4oJKMiKqgBABoJZACpJ5M/d+WYzaFUw0M1wKYtwx6vl/8RjWGwsWfj8kbFKWpi2RsG62MHeSNpYAD+tnPbn8F+0md45sJOU1HCJr8UbYd/wQjq+baVmqiLbxfHUPXmOtc9f51Vb+O1du7E7diOAe4FF+f0AgDdowcDGdieFWb4W18lepUcz9CMgBjNmkLkdeZCyWP6jf+Ao6p+mufEIrteEcZha/TGCa5OxfhLMVzqSQdoQJe8V9YEA1VJRA/is0QtCaWL2qcSACiVs+YsWendKmiF+/mLcrIGO38SqRgEx8Px+dlCHYKmb/yvpiGVANWp0QQ1vqY2tyIP5B7bSDhocSdkNInW5y8OpFibr+S2yMpBZ3KYPoAsTWXIq4/dIxStk3j2Yk2kmfA+Tw1rqJGi+MgNMUnj47QpooCFkkcOYMAAAA==" },
  "1i0f-0uwvJ9MmhqDhZ1_N60DznRunbMFk": { blur: "data:image/webp;base64,UklGRjwBAABXRUJQVlA4IDABAAAQBwCdASoYACQAPtFipE6oJaMiKrgKAQAaCWgAnTLFs1EYh5XhXVNdmiBNAMwTYmEVsbreVSwfpjKxSARN2+tp0AD+6CK5Cr9m17BI2uljR+EN6TVW0GM+1olHvjb5lwwtGqy1owC3I4SGG0uVDuGefIydrARWSlDrQusbsIlr2Zk5sOfU9kHJn0Doj4gOjKibgoRdCJvvZr+pNzKKIXyuuaERQ37Rm1aLI1C6v5wDTpfls2tlWQuzJAu3/YZlSH1o6k0+q3oGxm1ejd6Nh2QrFMjDWRXi9nDj2pLbi8Dr6T38SRjTBjXIMTzFxHk9ILbWlq+VUuOclzEqnCbbnH/U8avhRS+Nyiyp+VzoHStdlOvOcE7Na1f9/j1zEwqu7ROciyOE1kKCwd1+eCR0CAAA" },
  "1_VCvemG8yQw53fQHCvfeTqOpfYtcqT26": { blur: "data:image/webp;base64,UklGRs4AAABXRUJQVlA4IMIAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoR4NaAEDmE1ZO+w7XbPpd30AP6vy7m4nB2uqEqAsnZQPeTxIim2HedKRJfkO8FGcal76Nf0MEdtpRADb13X1DXS7xRSYgO2lODGtgG2PKzWP0NkW+pjzNnpFahxR0lX0IjVp+7bGtlrcsC0q5XTwwCBnjhl8Q+cqfUkmQ7eurF8EJ+P7XNYzsM6QxuoLqll5aRegbTf18geNWbIcSHMngdo7SGAAA==" },
  "1TXKFtw-TXFFXY2kXE2m5ooLKiuYycCaY": { blur: "data:image/webp;base64,UklGRjYBAABXRUJQVlA4ICoBAACQBwCdASoYACQAPtFiqlAoJSOipWmZABoJagCdMoM9PBukBEFA3y1zFii18hdkbzOBbWiFvg7lk62R63CL4vb4w6cl5tAA/volRPC1PpIsTwMwOS8bFzxnWkZKamOgByliglzVIIpasoGSebVXsn3t5v2sE9BJQcraihWEw0bkCI7xKgyK+Ypyzs9ki+Hb6akfnBmxxPg42Ba2RMXyKxEo8eOERNY05oKQd+nJIUuVv38RzWHc1/V0o1WgejGdaeTm6pzp0CBG/9/33CqNAIti5tVluLHnpQHwKhCLzrWl5FQqX3mwxj4O72q/z3uujf/6ceYp+2WBiYG0wt0MxggW/Axjh6Vl5R3hMIbCf3e9c3tXD46jEr+FynEWwOf0WJvvGPELrNfbdIAA" },
  "10MM4vWWBP3BM-v5iA1I_7wNlK2Zs1esn": { blur: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAADQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoMYBsAwwTOoxe5A6ExmvR+hgAD+5iVlY4F4Sg4Kki6dcl110M7YguLrJViOJKwo3AZYuTTzMFkMBMwSyBmGDfBMna+9Lsb8F97tqo/tIAATNFrXpNBmEI0gCShtnwTazOU7w4zlXy0JFv/er9fOccJlZ9isq1/L+Nhuz/fGlA3vkhV1+33O9fk2lYUr5i7IZSBcPUoJB+ohAJWEhYD40ocG1hDpMEF5vlQ04dNPEoMz/qJwAAA=" },
  "1wK62jlGIj2YtnMCENMBr_omj-zmZPlWu": { blur: "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAAAQBQCdASoYABAAPtFUo0uoJKMhsAgBABoJbACdIE36zGeCaEE5S5FAaOGAPVXBCXdAAP7praYVm55iMdeXdc6sQpauHEnz6C0schzKLLqfM11UD3lhDQdkkJTM14LIMba0PskZ9CK/t9c7r/dpQ/Y81n2rUYegI96/cUTEGkE1QoT53bNvDEL627cfxzK7Yu1tj1Q6TE4zCdtUa66B9h8qfztSl4nvdQN2nut0+ns+K93+vXgTGm7oSKTZilj0M2lkIp4yg9fo0HqkBzvq4ybY6gAAAA==" },
  "1A4y3g3k1tqUMGUSsVsxERWHQUYsXt9o-": { local: "/images/covers/service-cover-event-production", blur: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAABwBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdAafjoMHpP1IdZ7TR5lwqwAD+ppW13KplvVhB3Aman+kwZrHoB+9F7jJkel7EpvLf41jyRXNnoGvaOq84Nrl91KfBNdlrQQHD+RY6pQXm0Oa1AdYqWdrawPrXzYsnMcwWnxSjWLGX603dvv666oznnHUja+0gtGT6RpGc1HU59kjPaZWwZ3vVuPvnV+4WrRJ2GqthA/rhKEr+mHyDQh4prLoIVOAVgbFW0CPXeODeNyNSkkAkAAA=" },
  "1VpfNcwb3XG1-UMc4CkwV4gdlSZrTJpfe": { blur: "data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAAAwBACdASoYABAAPtFUo0uoJKMhsAgBABoJZACdMoACwJADe1OcA6lLEQAA/cU3HPl4upoTmLcIYvfadj7DrxKPsIqprwhpc7hViZYmn4hPN2gvc6goW+GTTEWVOdJ4NNzFrj7N4uQ0GI4jBitDjW4ZLpMIFZmN83Xc3SSWvsnHy0yxWIbw2xqNOMHyzI9SElupQxMuZlObUdKVKWX7AAAA" },
  "1kfdbQXzMTtx5l4Cbd0NMcnHsSrNjb3-I": { local: "/images/covers/service-cover-corporate-events", blur: "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAACQAwCdASoYABAAPtFUo0uoJKMhsAgBABoJQBOmUABSv8s2RYZYAOHDICm/ofUCRhlc3LZXyWdpfU1EVsvrLTI1ZC5khjfXgzprMsXJ/f0DoBtGmpL8ciqy+/LYs9hJOWLGhoambR1ii5dAWbOL2K8LiWjahIjDXlCUOGbaBaFiPNNCclOThx1gAAA=" },
  "1WGAbmBmlDNt9ktQUZ6VJu9xMLWIz6Ghb": { blur: "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJaACdMoAvQTPwvGZTyeYsNEX0sFwA/rF4AzpIjKO2ea+Yag5/GvBAASojlJrhAliNfZrORFFcLQvzO3bA0p5xXYiTWwDtARDDjOi+AhO0R+71OQTmRizpKbN96wXMftbYTQq3EOsOZS2Wff6l2O+EcF7/6lxLZqFrN+C5eVMiS8gZPHTgl/FPiwAiH4npL5nlHrvCPjSAAA==" },
  "1HB7jXfFqtqIQmepN6DXbpUDHVdBtXw4t": { blur: "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdIExqQPbqSnF9O3UMqui96wAA/sRfEWXiLCxTqbt+0tnNILhsxK7KCEhlMWT1Hxs3udW3F+Ia4byqrBFkcjC0w+jAIJAwoWhuRCdoFlNQ0CBmHVrGSskxQoexBRWscLPNc6De7xiN6dgl8g9DbI0RtN2lLb81d9KvUeSTOI+yDwiUFYT7bL1R0BKFwUNtQLtDvfnRYnuNhhDJwGes1658xfJPGaOOKQzMZHoCoFx4661g+gPjwAA=" },
  "1Z4EC3l425F-Bm6-uZTQ7EcIyMNv8HElK": { blur: "data:image/webp;base64,UklGRsAAAABXRUJQVlA4ILQAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJYgCsEf/i2J2rczj3gHEne5Cz+YlQAP7sjrDVcdfW3DsEeJXLaFTrSJbNLI6jMgIsS6+V1YZUGjOxvJ+m9c6ZlnD56IMPQ5qIfk2ZSqYsuJXr7Zqkgs53q26NLfPn6X65Rb9+398V3p7HCPtYtf2BdQau7HoGGTI4X/JnfevOrpuc0qrIGg7J1VQj6uJTWoZfNsXgvnE7TUxYAAA=" },
  "14Q8S6tU76seiJLeD1SU2RkiiNUYT4SP7": { blur: "data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAADwBACdASoYABAAPtFUo0uoJKMhsAgBABoJQBOjat22rZKqNAE+nfB+zNHjpEMMfegA/uPUra2cIBJHA6sE17C8/5y/ucqGd1utCaq5JbFJFrs7jKuxHk++VNJgHvpA2f/JNG6g5tJl7b71fngG/9jdbs8/T+skmOXJuwcfBLpr5d+/SxQyjU4YEMcyRxAahTX67UmHoB2S+0cuZKl90/DvYbY4zKdeuiNLyAAA" },
  "17DxJ-fiRjOAPYvrFS7fihCNj0MlCrnk2": { blur: "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoLUA6wAYLaT0vBhXhFU07QAAPglZvlyF/4irF5hgVqm3IzH+8V13i97glT+tJLWG3Tun+q3uuC/PSe06V+85WTM/ZAEwW1MCGYnxi0QUUctQS1BeD1CbwUlCRtOjXevqrDoho5Pd+VtIMD8GNPgSyEhSf8VencvnCuOxraN4R0EuWxOHQZk7Uc6EKsorX5Bfm8GAAAA" },
  "1n3lfTSgS-952kOnOZVv8tTz0PPrTfRC2": { local: "/images/covers/service-cover-brand-promotions", blur: "data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoR4GdCI7PhsI8mp40TOhfiAAPILPjc2rf0VoBnMxMnuTOaY5kf5UHghyz83uWW4V7NKMQwXSxEhy94mN4uAkrlMP/mvVKLKMsUDy9p+bS2DB55k9rB9W8p/2uAxF7IVM8m5fILylK8cSRkmaogo5fq/BsLc+3plVE4r4tWqiJgYQAAA" },
  "1EEZdabeWrt_sl3wuhZn-VvdSMIx6VA8B": { local: "/images/covers/service-cover-product-launches", blur: "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAADQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoMpBsAnQBVQ600+CUjgjriKAAD+taXXXagehTG84Rw74lSKC11KY1m2TpThwQSBbt/2Widaw0IeQfUUMe5vYsaQsEZPTLccv7fmcZEoz74M2i+0Lb8K2F3hGJ/8syVWffpAhdJpK7YyFWmwtwOHfH6HiF5rVvaoCE+RbvvlUfv2NiLnAQPfDN6j0Pkq/IbALdswAA==" },
  "1lJbfeSwmJtcckYFyav_XCLban-GILGHX": { local: "/images/covers/cover-about", blur: "data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAABwBACdASoYABAAPtFUo0uoJKMhsAgBABoJYgCdMoMYAEf+2+ctmv82GPD9gAD9QVFednTWiVCZMQwF53Wi/5RzIbWSR8Y1cT00RcrChObQtxz016kSb1T9wxCrbWX3cbjFHLsepdX2V6t8fdOWl1QdTBzl5286t6dOVwQSmmHVLgdvw7ZY+t3GSoAAAA==" },
  "1KEqaLeJksvJosN1aOKzcS3PUPPwAP9n2": { blur: "data:image/webp;base64,UklGRh4BAABXRUJQVlA4IBIBAAAwBwCdASoYACQAPtFUo02oJCMiKrgN+QAaCWMArk9DRrJjh0AFjPDP+9rQoXStdth80o395SOZ7snwMHchDp1RA6AA/vYreQjG4I+K5tmF2Ww/nBNVBX9TQ6QvZxSG4tHvE0mii27teKfT0qoTSNNSSYw5DgkvfgUwwe9ovYb2CFlInPDNhrwuELLy6z4gOmfoXWwt2eL5aNnHIsb+iZHC3Ref1kKlTPgCsyy9yw349bduvrjJS3aGXNCGFp51nTsaQNfIAWExQ9FXO/TvoXiYoe6q2FZzIhK8vVtCU72z42+Tadi9P2WNxKulh6q7xPFiqfGkrLB/QsruAyqN7GmoFF780s836tvYR/kldLR6Q8AA" },
  "1j0YyNmOmxaQgyf-PPidHeDt6HqSFKO9U": { blur: "data:image/webp;base64,UklGRhYBAABXRUJQVlA4IAoBAADwBgCdASoYACQAPsFQoEunpKMhtVgMAPAYCUATpmv04Cqn+W4RflG4SaMpCR7ssCy7NeYY4UPaBCwjhV4iWU+AAP7q9no1DJfoNY9VCn5hIKQgvVZwDBaMFH/pTGXRVXNECpqmrqvy20xf6Yzqi2BZ8/8Vwevt0erceO3DmtRoD5RSY1q+ikPA+jnzoWLKC2Qq0tgnI4TfXcMBQfyWCoMUNTz/0oyyDpTNunEtnPa3xX8jCPOXJSgfJVvatSs7TI78xLA+h8phBD11KzBnEuINeYI1JGCr4nIaX95Q71h5TTnMGjKh73fL4/1E97Nr6sJZJbvfQ2GXjORYYePpQKXP1vhfYpdmGHBgAA==" },
  "11axnLN9spQalDPsRZ1rp-yi4aSBfCv1b": { blur: "data:image/webp;base64,UklGRlYBAABXRUJQVlA4IEoBAADwBgCdASoYACQAPtFYo0yoJSMiKqwBABoJZACdMsqAsBykBAx8XY36cek9bpcegdzVpBT5nmAr5uPdaO36YB8AAP5UTBtGpR3we5C81bnY0BVJntckgPp1KW2DYnFGhT2Lt5EGfQWA47iPNRU4Qsm4V0M+t8LXMhzDDgIKlB+G76xqwVv2nAczVPFuW8K5tq819MIlRQDs+A4pPN+Fg+nxV43W/DulUyzTN+jo5zo8K2X/jr/wBVf7Lq1N+PmXLQXlmKmVwl6p4KG35R9t6L+CDzhinNsvWfXLN2NRZA1HWozU0Fu7XN9bVJx3BeXoKzR/YfdYOK/KZkGaXOL/ihPtNCm4hwPcb4hMpCq1bMFmwQGBrGv9sF0lPvH7jXMPPTxcBm7zE7ZnQQ0AQcm6AyWBsD1JtO7JuLLkksRxkOa1JUzgnTZQ/UdAAAA=" },
  "19crBMzcuGs1rlilGEUVSz33OFlMFKVW6": { blur: "data:image/webp;base64,UklGRuoAAABXRUJQVlA4IN4AAACwBACdASoYABAAPtFUo0uoJKMhsAgBABoJZACdH8AguRAyIntK7YKYbByCSSGQAPhV6Y5Jv+C4egni/FVfNKVg4fAB8yq7GFW0evP5Jp0EkMMKunV3V9+P9O0MxzId2w1hQrxNLwy2Khvz9bSy5vRpM3R+E7xnTv/HRdEt+qavh8pudZk8trzmbforKqGuePgbubymFN2s1Ic7t6Pcte6/sXpgkU5LT188xY6IPZH2xUsWkf9WgPOsCSLe3//1e2LxQIzyLOhjzfeW2dNI2K0AQUOhb1dBj4+/164KIAA=" },
  "1FqNW42khgP5Up_G4ZozVFJJMMurM2efO": { blur: "data:image/webp;base64,UklGRmABAABXRUJQVlA4IFQBAABwBwCdASoYACQAPtFip1AoJSMipWmZABoJYgCxH8FumsTsANMqzsgkQHx7IVu48MlthaFi8oX2S+k8TrY81wSwXN56AAD++q2Yd5e7i9VZ7I8W+fMSmaSi8UHtjL2EJ6OKkb1Kq32woHFjmAt26nzGf/rC+OGbonfUSkCKRH/u6bj2Nc4+Ymp+h8e4IXxV43spOZvP1Ve02Erb3lIrOUG79KtHV6Nqs9b+2XznK7dC2Kn/KZ1Y/3YYofQdKfcX1Ok2ZYzJ8CvHw4iQMrycG6YXNThxDc5Dc5AE4vghBfZgTIf28xxzEHZEFxPFVXL4jgh0Tb5af+v9a9wx3M82kqdd1kyoaTs/4jWFz7c9+rBNqfuTLNa7XNe1Yl2Ejr8V5iFbeOPkP/zqvX5i+m5E4TPzdmsvplqx3FIC9lFcS0vMwUVwqDVdXqSKejy5l9Jq9BsuAAAA" },
  "15AHF2dZmKTu9eOeUMwHJxcGMfPtpdUgg": { blur: "data:image/webp;base64,UklGRlYBAABXRUJQVlA4IEoBAADQBwCdASoYACQAPtFgp08oJSMiJWsxABoJZAC7MyrCwEA1lLRZAke7lAxaBFvCZPU3K8hqWeOmw4dLOXZDAEa6njQe9/XyAAD+65m9c+mxiK9TApvV+kZoa5HvoG8aaMuK5/lTApK771Pe/YjSfqikll8aJur0EAyEyCGwItI90e0bi7SIAgJ5CxbrFR/zvTXLzqRlhtijX3sKhNb2G/bzmgfEFQZv3/wetjFjq/RF3tM0sDmC3BTMPpatld38A7do+BF91f9BdAzCcL1fLZ6Ni/+UgBtycVHGOkZJ+kRjvXSya1gB1Ha6n9VTebYpFUjxzKOxwMH3m6xTgd5jfx2z+Ah7p+tIuxrdeE79+bKqWPuwaHhBEhJMP9W8HLaz3b3z12+l0m5nYpP/p68ZmOvVNJ8VEKAoLWEoXX6VS8OwHoEBIoyP1BAAAAA=" },
  "1UM3lZyQAgw0tiI98LvepPjPUTJVgLrQR": { blur: "data:image/webp;base64,UklGRoYBAABXRUJQVlA4IHoBAAAwCACdASoYACQAPtFYpU8oJKMiKrgKAQAaCWYAnTKEEAeUAvqazWWBVLLHhK4E8YZ1AWw9iJSxLTD+aaVBZM6cINqngjtfwNK4AADeR2/jYLEzE2QQhXkjMGErbihQY4DmRIKSN6q1RHI5ujtWHjZLUelEVcedOIR9f1pnomXWTqlcVXFBKG7hqzs0CiXHitSl4Wbuu/J+rnspY4yx/fyygXs4IhL8X5O+vf47wlqeRfh5absGKeD2MmkLuQZRt3QuRBh/QgAOFxMqRep7vf0fe1CYhquTurD9eKo8BR/Fcj7Vgw9PfFT5AOc9ZtGfOf9n6/iXAGfzhyvJw/pqLYgnmle5uyqXXDhHmT8YaIWnRMA2+fKR7dgG1mEau8HfuTJjjVrE+YQ9OAcLguuzWalfz0u5KaIZiQlWLnkHkE/HmDMgWUJMC6WjxrjtbY07wn+ZUBO3Jjs5Wg2LFThZIPn+4X98LpzZfa0zyvw3o74htorxMQEtPGM8AAA=" },
  "1o1IWmyv-yYZ0Z4QsHo61hWbK9TKYEULs": { blur: "data:image/webp;base64,UklGRpYBAABXRUJQVlA4IIoBAACQBwCdASoYACQAPtFWpEwoJKOiKqwBABoJagCdMwTD2EBXtywNLuzqGnfIrcSDpkcx0i9fVJkhBETqDPCv5g/CN0CO4ZgA9qEnufN+gb3YfZjxMyOPwgO0L+h+M6pjfcARupfB93D6zVYssdWFCzzu5/pb4vpZSWdCH2zkF/cii5MOrbyj3m9t760EcVKaNMvGhmHTSbNWY0+9HpKV7kq6vkk4Nc68b2V4m2R26ITOwGhjoSSPwFcfzYW0z4F5Ufh4i5EddFjL/G8tnxwfsOuGz8sTxbZozGeBAR0kLwsG+XQvfRVoJbUzgs0KTBQUo+wJhQLBTUpulke/kM7CeHFeqatQi2NMI57c16R0IHEm+VJTRx8nvuMsPIyynqAdigd8wEY0yTb98TUwF7BokwuNQQzvRtWfsNrxT9XZuaVIX4oSTCM+U4o15FDnILFTFz2TLc8dew+rP7PsPfz1B2zfGZeCN3iLloIClkfLqBwQKNmb84GWqo0E5KbUOYRyRVXVk7m0DMPLZwAA" },
  "16Eykph--U-ba7ipzamXX2JCoPf35qq2d": { blur: "data:image/webp;base64,UklGRkQBAABXRUJQVlA4IDgBAABwBgCdASoYACQAPtFeqE8oJSOiJWsxABoJZACdMvulyiDFHPIbyGkGQ9HcJWmpk4zWqZJS6/UpW/5StwAA/vOtVDd6SUzDO7o1qvt8GqFoPTyZOafP/oq1Mww/RN6toLFDOCvdeEf6YGR7LeVZpmTL2RM0Czz4FHYF3J4WXQMqjMSxq6L5xBbdgK+WmVfgTwv9t/Gqh6/QtIhvCuXn4PhaG4z5ajXYroeXSCesx7OLr0Y1ENvSN3OPepggnjQTyPJtHFTfFRWPBtyPI3X5dbYBN353eWSyYMw6M330EaESdTTc1Sc9KtM3k3sbODvgf9DEpA54HiMjWcZyLHLKqCF9SF6F5W1Ta5OQTeiHq72GwxwuIOtad2J1dgSUT6hokzGw6mTss6FvjTO30QTO/iF4J14Gh/QAAAA=" },
  "1rgTOZsvrHLbDIHDBCG5nwRPHoAFS_pFA": { blur: "data:image/webp;base64,UklGRl4BAABXRUJQVlA4IFIBAAAwCACdASoYACQAPtFepU8oJSMiJWzJABoJbACsM0aM74QdX8gHTAAqZdmfYHeXoALHrwCW2rj0iieGDEtLpX6XEYPv5s9s6IPQAAD+8m8t+xIIeIuAzA5Fw0Y3Ke98cVbgSN3WTgb2GcJJsaDYAyCPysXW5nb+mJJ/Wr6HeZ3P6XDqjp5avtMEbV4pzfHBrMj6Y7XvFD4GYaqJY7p4+ayLG4qjVsXrs/OyzgPu8R9ibhjXWw5V/BHcXGLviCo/32djRkNZWK8TerIvU27QvuHfyOPikFMo1x+yv5saB45MAzBmbf7G2GOIhNol6Lx33z2W4vjnveoEsvnWj5TqIYCh+sXAUC52ILlLv2I6htfi6hKzbuiKVqpFYGC+dRljSkt95sL532fXbeottB6YNs5za8i4U8wBMNUGbpxQvQEAyhvT9CYdCuu+BeIuhp/WY0agAA==" },
  "1aOjM7cEE5U8ZbLOntuAmRP99tqvL2X7v": { local: "/images/covers/cover-why", blur: "data:image/webp;base64,UklGRmABAABXRUJQVlA4IFQBAAAQBwCdASoYACQAPtFcpk6oJKMiJWzJABoJbACdMz2+MQNyK/INl00aa5uRNsObq4H1Niw/fy9n8XY7kMW6ulVCAAD+yk7ETJq2Pnrya5yt/gbOSMDd2ryL3BKNl0NZzrjcp1/c7cjpL6oU0i/O+JMgu60KRhHMpJ26MLA4s1z++z/sWQ48om5jYbL5Me+3MTWtMewFEPMgbM1Fo/AyhI9WrYsVQBoI2Kc7m6bW9JJMRBMQvGAPFJQv3kj8r6GdWQsYglNkbAyvbc24j1Xc/svWhmoLX3Rwlo+z/mmQvLm2XeAE+BSjpEp+ZyrjTXTgK17sBXAxpHEBrQ6qocjpyZjhz4gKDc6xqe2CCW5eFOPtv6H9ThQqPs/agmUCchEsjOHp6Lv6x/IRnP3ZvavOlrLgm40xtS6ZzMU58aukqF6CdA/ooWegcAQt2dCiG8u/bjbmkAAA" },
  "1gf-QbXJ6DRKfEqt1oQVwJRn0MmUsem3s": { blur: "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJYwCdAYyU2J86c9sDPTGfNqwAAP7WJheI6HXPmX9HaWYAQeoEP1Je/MLDyHWoMfGRL5b8LncQCAyspeQtjZCT+Vktm2goQMVs2enWu7yvD+QiC2L1mk0W33Xl/Qn/iS5sPtbqIOmTkrKDC9zoBLCaDhFrt+uGZShc1uyNXqh2vCB55tlb/VvrywDW+uSoj0Pa24q0h/AAAA==" },
  "1jpuXW6aP8fn-cQu1OO-ZEjnzpGqpeH7c": { blur: "data:image/webp;base64,UklGRsQAAABXRUJQVlA4ILgAAABwBACdASoYABAAPtFUo0uoJKMhsAgBABoJagC06YyA7Lwr9mT54AjDgwfAAAD+0p+nHNL7No6CQ5hfXmWJ9SZIQn42xCuCYycdQ+O8OBiP0aiTcD4HFkhCtvbz+PPjAHo6a0YNg0Y7ob4HHsHAPZkcOs5P39hR+D6r7+0/G6RTsHnrtIeDyJgq5ziVXtKRszV/oUDWrmTLSO3seSeT1zFEX/5YRxyu3tB+lh41zi2QW6lswSB6gAAA" },
  "1A9WrCcP4KvxWDstDHdypHn2sDvC0je_w": { blur: "data:image/webp;base64,UklGRtIAAABXRUJQVlA4IMYAAABwBQCdASoYABAAPtFUo0uoJKMhsAgBABoJbACdMoR4PoM4DeQJMAHdrg36YVkIYPcbm28QAP7u5VNUbKfYQ3roN7TSDtH4WMwXjkCxg60KS8mHR6ftFRNAimOmWwmIvo9hRM8WMbDo0Y6f5f0t5DWrHEA0qSGBI2mrpiDu1QvZ8yoB/RUec1q6L2Kfpt1QYsjMLz+6zRDoPz67VoX3GzNZrwq67q+Y8VjSQPJ1Jvc4OwafgT8M2A2rALGj0UOk3MaPxXwgAAA=" },
  "1lT00v7aMGMqSg8_rr1ooLteStd366itK": { local: "/images/covers/concept-cs-2", blur: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAADwAwCdASoYABAAPtFUo0uoJKMhsAgBABoJYgCxG1AAiDPe5gSqQjwAAPzVEkNTUFeZRXkTf3XVSvPqeTSrxNMcqVa1QN1q79BpdZJyfbvtKvFF0DB8HIA8fYvoVzCTmIX0P16XDZslOpO4LBIwoy7Cm2roZ7fuvNslAVcUEd4acJdu7re/gAAA" },
  "1LVol5mo2COi0uTusmsMN8heF6G3y6sRE": { blur: "data:image/webp;base64,UklGRsQAAABXRUJQVlA4ILgAAAAwBACdASoYABAAPtFUo0uoJKMhsAgBABoJQBOmUAS34vks/99lu7DmfFAA9Vmg2heJd+HZ38w4kMIRJPbkhVOrYZp+LGrAwWXiHImxIMuB4Xr9OwGXv+v22StYqhKMdGIL7AYb32rNLR8YOkdyCiwJvEqHMKs/q3VpwWQMQweWiot+VKpvm2VFutB/RUtiBPxdCnMnZPLyFgPvTt8EFgfRYeG4s7matuKhl5daIDBetN/unZrDSAAA" },
  "1GtY7ck6bcQEMTJsCR5C7xAWS7jSPomr9": { blur: "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZgCdACHe2eqMt6eUsuxBwAD+7U31K93bH662/smyX6YlgZDB5ESu0ftFagMf9ywkIUglq4jwkIu8O3r7jY4t7ATal7n+EXeMeYzxhZt0IuOUi/FbTt9C1cObHn5Kbm7TRVw9gMpOvsftU7WWuAAA" },
  "13k2vfjcw1gkE3_Oy-VzalisSoHi63pxi": { blur: "data:image/webp;base64,UklGRtoAAABXRUJQVlA4IM4AAACwBACdASoYABAAPtFWo0uoJKMhsAgBABoJbACdMoMjeBAtgTO+kAA9z301/qgQAP5xTmen4lwv34ehWJ6rXh+fgMIE/kw5nTn02RqybzopTsge8SNhbaq8ENp9iQ8V4edLLYJGUE2SVGltSgfSDHpX57X1a/FPWVvzXxDEIgMGw7vc0WHovV7zhOmP6Hc9t1k5uzS2o7e0e+/3zV8pBmnFr0Gavsl40sa7zzbK9VX01pxtxDn9XEmwaXVkFDaIhLNipuV1S3y+naFBW6IAAA==" },
  "1pBkjJhGY7jIYlRJSM9LbPtOZbCHf4yx1": { blur: "data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZACdMoAlvBVMKQvfqwyhBcoAAP7cdf9Y2y1kdJZwRjlX07l+TkRKWUt1bBxEBeUbm5ozQRm15ajeK2Yqnqrdq0db9yPku9NYLaymdxKjqJpBPBE3s4u7XChDfgG5EX13eFFCkqfxAEBb24ykPUnx2wjsIu0fS576ZzNHzlUnTfn3OxfwAZrqm+Jayb7VIctvAAAA" },
  "1StkcCxM1dFUrm9It_QhylB0w4gDCSXL8": { local: "/images/covers/concept-cs-3", blur: "data:image/webp;base64,UklGRsoAAABXRUJQVlA4IL4AAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJbACsGugAX19/Y+eUn67faAHsAP7huEfzFoSjuLpQ+0Xf66zs2IAFtnx7anGXRa+QL71NRKcFzQZN4koknowSkiAj/N8s2r2gXEXVquvk0/72jefg9RW0PKHfDRcEV72H4lIELPhOyl2K+QiApigegHS0NzOdxjVBtCeEfze4vp1PkM7RwMHlXp75Ea3kMWE4Y4racdQY2bDqK6jevgw/kbNNQAAA" },
  "12O55-1UOeO22Iav2uwv6f9sOVbTFAl0l": { local: "/images/covers/cover-portfolio", blur: "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAAAwBACdASoYABAAPtFUo0uoJKMhsAgBABoJQBajUAS4wjrjTrYkUCHRPgAA/vJURTFUg3duLWFpDYzA6x1WSBoORWd9sTv1Ui54+WnSvDhRymlFu58j/BgDYt6m3qt7Vjuknn9skKZbX6BYBxmQO5OIptgrWuXit5tstR29UAyf/NDKd0j1CUrCYF21+tcJL42Sy7AMFT7C5bZy6cvJUwZzehq+ixCPfUGYlsAkbegAAA==" },
  "1AVFFp6b52g44XQBKAfl6NOFJEgs376JF": { blur: "data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAACQBACdASoYABAAPtFUo0uoJKMhsAgBABoJZgCdIExguRYm3gZ9XZbSfrQrlAAA/shTbRDKYoC48bpU+sZsv11RtTgEOcPCUZHb1uQp+QyLf/tjKT/uas/51prBHC1fcggV63I4YLpttB04kZ3yFTGPqRj/mmwv/jb/nrI7ae0Dq8bGP4C52LHyKLsEycgry8KQHbAMtOl3tseaDA8wf3k19fKP1dsnoAA=" },
  "19U-aj1LF3a0WFAyfavaGmVx8kAg45-X-": { local: "/images/covers/service-cover-wedding-planning", blur: "data:image/webp;base64,UklGRpgAAABXRUJQVlA4IIwAAABQBACdASoYABAAPtFUo0uoJKMhsAgBABoJYgCdMoMYAEf+2+ctbg/IhZYAAP1BUV52dNaJUJkxDAXndaL/lHMhtZJHxjVxPTRFysKE5tC3HPTXqRJvVP3DEKttZfdxuMRxkKqTdpiXq3x91IAfBfv5nx+CGjqciZBb3Yy/EJB7hgyYlKCfXV1caAcgAA==" },
};
/* </media-exports> */

/** Descriptive legacy roles → service slugs a photo may illustrate. */
const ROLE_TO_SERVICES: Partial<Record<ImageRole, string[]>> = {
  wedding: ["wedding-planning", "destination-weddings"],
  destination: ["destination-weddings"],
  "corporate-like": ["corporate-events"],
  "conference-like": ["conferences"],
  "launch-like": ["product-launches"],
  "exhibition-like": ["exhibitions"],
  production: ["event-production"],
  "stage-av": ["event-production"],
  "concert-like": ["concert-management"],
  "fashion-like": ["fashion-shows"],
  "birthday-like": ["birthday-events"],
  "celebrity-like": ["celebrity-management"],
  decor: ["wedding-planning", "birthday-events"],
};

/** "50% 55%" → { x: 0.5, y: 0.55 }. */
function parseFocal(focal: string): { x: number; y: number } {
  const m = /([\d.]+)%\s+([\d.]+)%/.exec(focal);
  return m ? { x: Number(m[1]) / 100, y: Number(m[2]) / 100 } : { x: 0.5, y: 0.5 };
}

/** Portrait crops are safe when the subject sits inside the middle 60% (1:1: middle 50%). */
function cropSafeFor(x: number): CropRatio[] {
  const out: CropRatio[] = [];
  if (x >= 0.2 && x <= 0.8) out.push("4:5", "3:4");
  if (x >= 0.25 && x <= 0.75) out.push("1:1");
  return out;
}

function rolesByAsset(): Map<string, CurationRole[]> {
  const map = new Map<string, CurationRole[]>();
  const add = (id: string, role: CurationRole) => {
    const list = map.get(id) ?? [];
    if (!list.includes(role)) list.push(role);
    map.set(id, list);
  };
  for (const [role, ids] of Object.entries(V6_ROLE_ASSIGNMENTS)) {
    for (const id of Array.isArray(ids) ? ids : [ids]) {
      add(id, role);
      // The sticky index frame shows the same asset as the service cover.
      if (role.startsWith("service-cover-")) add(id, `index-frame-${role.slice("service-cover-".length)}`);
    }
  }
  return map;
}

function buildAsset(id: string, note: ImageCuration, v6: V6Note, slotRoles: CurationRole[]): CurationAsset {
  const [manifestId, uploadW, uploadH] = DRIVE_FILES[id];
  const focal = parseFocal(note.focal);
  const heldBack = v6.roles !== undefined || note.roles.length === 0;
  const cropSafe = heldBack ? [] : cropSafeFor(focal.x);
  const busy = v6.busy ?? (note.scene === "guests-crowd" || note.scene === "stage-av");
  const people: CurationPeople = v6.people ?? (note.facesProminent ? "close" : "none");
  const portraitSubject = note.orientation === "portrait" && cropSafe.includes("3:4");
  const span: CurationSpan =
    v6.span ?? (portraitSubject ? "tall" : note.quality >= 4 && !busy ? "wide" : "standard");

  const roles: CurationRole[] = heldBack ? [] : [...note.roles, ...slotRoles];
  // Near-duplicates and sub-par frames stay out of the archive grid; the primary frame carries the set.
  const inGallery = !heldBack && note.quality >= 2 && !note.nearDuplicateOf;
  if (inGallery && !roles.includes("gallery")) roles.push("gallery");
  if (!inGallery) {
    const i = roles.indexOf("gallery");
    if (i >= 0) roles.splice(i, 1);
  }
  if (inGallery && note.quality >= 3) roles.push("thumb");

  const service = new Set<string>();
  for (const role of note.roles) for (const slug of ROLE_TO_SERVICES[role] ?? []) service.add(slug);
  for (const role of slotRoles) {
    if (role.startsWith("service-cover-")) service.add(role.slice("service-cover-".length));
  }

  const exported = MEDIA_EXPORTS[id];
  return {
    id,
    manifestId,
    src: driveUrl(id, 1920),
    width: 1920,
    height: Math.round((1920 * uploadH) / uploadW),
    roles,
    focal,
    cropSafe,
    people,
    busy,
    span,
    service: heldBack ? [] : [...service],
    alt: note.alt,
    caption: v6.caption,
    ...(exported?.local ? { local: exported.local } : {}),
    ...(exported?.blur ? { blur: exported.blur } : {}),
    quality: note.quality,
    ...(note.nearDuplicateOf ? { nearDuplicateOf: note.nearDuplicateOf } : {}),
  };
}

/** Every Drive photo as a V6 asset, in curation order. */
export const IMAGE_CURATION: CurationAsset[] = (() => {
  const slots = rolesByAsset();
  return Object.entries(IMAGE_CURATION_SOURCE).map(([id, note]) => {
    const v6 = V6_NOTES[id];
    if (!v6 || !DRIVE_FILES[id]) throw new Error(`image-curation: ${id} is missing a V6 note or DRIVE_FILES row`);
    return buildAsset(id, note, v6, slots.get(id) ?? []);
  });
})();

const ASSET_BY_ID = new Map(IMAGE_CURATION.map((a) => [a.id, a]));

export function assetById(id: string): CurationAsset | undefined {
  return ASSET_BY_ID.get(id);
}

/** Assets that can play `role`, best first (quality desc, then curation order). */
export function assetsByRole(role: CurationRole): CurationAsset[] {
  return IMAGE_CURATION.filter((a) => a.roles.includes(role)).sort((a, b) => b.quality - a.quality);
}

/** The one asset a single-slot role resolves to (or the best of a pool). */
export function assetForRole(role: CurationRole): CurationAsset | undefined {
  return assetsByRole(role)[0];
}

/**
 * Local cover files for next/image: the 1920 and 1280 files are the full 3:2
 * frame (desktop crops to 4:5 with object-fit + `focal`); the 768 file is the
 * 4:5 phone crop made at the focal point, so `sizes="(min-width:1024px) 50vw, 100vw"`
 * picks it on phones. Undefined until `npm run media:covers` has exported the asset.
 */
export function localSources(asset: CurationAsset): { src: string; srcSet: string } | undefined {
  if (!asset.local) return undefined;
  return {
    src: `${asset.local}-1920.webp`,
    srcSet: `${asset.local}-768.webp 768w, ${asset.local}-1280.webp 1280w, ${asset.local}-1920.webp 1920w`,
  };
}

/** The shared below-fold pool (10) for locations, local-SEO, book-event and contact. */
export const EDITORIAL_BAND: CurationAsset[] = (V6_ROLE_ASSIGNMENTS["editorial-band"] as string[]).map(
  (id) => {
    const asset = ASSET_BY_ID.get(id);
    if (!asset) throw new Error(`image-curation: editorial-band id ${id} has no asset`);
    return asset;
  }
);

/**
 * Real photographs a service page may show in its gallery strand. Empty for
 * the services in NEEDS_REAL_PHOTOGRAPHY — their "-like" frames may carry the
 * cover but must never be presented as that service happening.
 */
export function assetsForService(slug: string): CurationAsset[] {
  if (NEEDS_REAL_PHOTOGRAPHY.includes(slug)) return [];
  return IMAGE_CURATION.filter((a) => a.service.includes(slug) && a.roles.includes("gallery")).sort(
    (a, b) => b.quality - a.quality
  );
}

/** Dedupe helper for page packages: drops near-duplicates of anything already shown. */
export function withoutDuplicates(assets: CurationAsset[], shown: Iterable<string> = []): CurationAsset[] {
  const groups = new Set([...shown].map(curationGroup));
  const out: CurationAsset[] = [];
  for (const asset of assets) {
    const group = curationGroup(asset.id);
    if (groups.has(group)) continue;
    groups.add(group);
    out.push(asset);
  }
  return out;
}

/** Role → asset count across the V6 contract (reports and tests). */
export function v6RoleCounts(): Record<CurationRole, number> {
  const counts: Record<CurationRole, number> = {};
  for (const asset of IMAGE_CURATION) for (const role of asset.roles) counts[role] = (counts[role] ?? 0) + 1;
  return counts;
}
