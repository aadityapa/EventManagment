const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?w=${w}&q=88&auto=format&fit=crop`;

export const BRAND_FALLBACK = U("photo-1519167758481-83f550bb49b3");

export const BRAND_IMAGES = {
  hero: {
    video: "https://assets.mixkit.co/videos/preview/mixkit-people-dancing-at-a-party-4240-large.mp4",
    poster: U("photo-1519167758481-83f550bb49b3", 1920),
    wedding: U("photo-1519741497674-611481863552", 1920),
    corporate: U("photo-1540575467063-178a50c2df87", 1920),
    palace: U("photo-1566073771259-6a8506099945", 1920),
  },
  weddings: [
    U("photo-1519741497674-611481863552"),
    U("photo-1606216794074-735e91aa2c92"),
    U("photo-1464366400600-7168b8af9bc3"),
    U("photo-1519225421980-715cb0215aed"),
    U("photo-1469334031218-e382a71b716b"),
  ],
  corporate: [
    U("photo-1540575467063-178a50c2df87"),
    U("photo-1475721027785-f74eccf877e2"),
    U("photo-1560179707-f14e90ef3623"),
    U("photo-1591115765373-5207764f72e7"),
  ],
  destinations: [
    U("photo-1606216794074-735e91aa2c92"),
    U("photo-1566073771259-6a8506099945"),
    U("photo-1519225421980-715cb0215aed"),
  ],
  venues: [
    U("photo-1519167758481-83f550bb49b3"),
    U("photo-1464366400600-7168b8af9bc3"),
    U("photo-1464366400600-7168b8af9bc3"),
    U("photo-1519225421980-715cb0215aed"),
    U("photo-1566073771259-6a8506099945"),
    U("photo-1606216794074-735e91aa2c92"),
  ],
  vendors: [
    U("photo-1554048612-b6a482b17f66"),
    U("photo-1519225421980-715cb0215aed"),
    U("photo-1555244162-803834f70033"),
    U("photo-1459749411175-04bf5292ceea"),
    U("photo-1522337360788-8b13dee7a37e"),
  ],
  gallery: [
    U("photo-1519741497674-611481863552", 900),
    U("photo-1519167758481-83f550bb49b3", 900),
    U("photo-1492684223066-81342ee5ff30", 900),
    U("photo-1459749411175-04bf5292ceea", 900),
    U("photo-1540575467063-178a50c2df87", 900),
    U("photo-1475721027785-f74eccf877e2", 900),
    U("photo-1469334031218-e382a71b716b", 900),
    U("photo-1464366400600-7168b8af9bc3", 900),
    U("photo-1478146896988-eee32b6380b2", 900),
    U("photo-1519225421980-715cb0215aed", 900),
    U("photo-1606216794074-735e91aa2c92", 900),
    U("photo-1560179707-f14e90ef3623", 900),
    U("photo-1552664730-d307ca884978", 900),
    U("photo-1566073771259-6a8506099945", 900),
    U("photo-1555244162-803834f70033", 900),
  ],
  blog: [
    U("photo-1606216794074-735e91aa2c92"),
    U("photo-1540575467063-178a50c2df87"),
    U("photo-1475721027785-f74eccf877e2"),
  ],
  contact: U("photo-1511578314322-379afb476865", 1920),
  about: U("photo-1511578314322-379afb476865", 1600),
  catering: U("photo-1555244162-803834f70033"),
  decor: U("photo-1519225421980-715cb0215aed"),
  awards: U("photo-1560179707-f14e90ef3623"),
  testimonials: [
    U("photo-1494790108377-be9c29b29330", 200),
    U("photo-1472099645785-5658abf4ff4e", 200),
    U("photo-1580489944761-15a19d654956", 200),
  ],
} as const;

export const BRAND_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBQEAAAAAAAAAAAAAAQIDAAQRBQYhEjFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AzmitzJqcpJTyFslZ0k+or6VYYqSlJTyFslZ0k+or6VYY//Z";
