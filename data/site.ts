// Central place for brand contact + config. Edit these and the whole site
// (nav, footer, floating buttons, checkout hand-off) updates.

export const site = {
  name: "Sanskriti Clothing",
  tagline: "Heritage weaves, worn for today",
  // WhatsApp number in international format, digits only (used to build wa.me links)
  whatsappNumber: "15107098467",
  whatsappDisplay: "+1 510 709 8467",
  facebookUrl:
    "https://www.facebook.com/profile.php?id=100063709607311&sk=about",
  instagramUrl: "",
  email: "hello@sanskriticlothing.com",
  currency: "USD",
  currencySymbol: "$",
  foundedCity: "Indore, India",
};

/** Build a pre-filled WhatsApp deep link. */
export function waLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

export function formatPrice(amount: number): string {
  return `${site.currencySymbol}${amount.toLocaleString("en-US")}`;
}
