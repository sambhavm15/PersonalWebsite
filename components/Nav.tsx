"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { site } from "@/data/site";
import {
  clothingCategories,
  collections,
  newArrivalsLinks,
} from "@/data/catalog";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
  WhatsAppIcon,
  ChevronDown,
} from "@/components/icons";

type Me = {
  user: { name: string; email: string; role: string } | null;
  cart: number;
  wishlist: number;
};

const megaColumns = [
  {
    title: "New Arrivals",
    links: newArrivalsLinks,
  },
  {
    title: "Clothing",
    links: [
      { name: "View All Clothing", href: "/shop" },
      ...clothingCategories.map((c) => ({
        name: c.name,
        href: `/shop?category=${c.slug}`,
      })),
    ],
  },
  {
    title: "Collections",
    links: collections.map((c) => ({
      name: c.name,
      href: `/collections/${c.slug}`,
    })),
  },
  {
    title: "Celebrity Closet",
    links: [{ name: "Explore", href: "/celebrity-closet" }],
  },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me>({ user: null, cart: 0, wishlist: 0 });
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [acctOpen, setAcctOpen] = useState(false);

  const refresh = useCallback(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [pathname, refresh]);

  // Let other components trigger a badge refresh after add-to-cart etc.
  useEffect(() => {
    const h = () => refresh();
    window.addEventListener("sanskriti:refresh", h);
    return () => window.removeEventListener("sanskriti:refresh", h);
  }, [refresh]);

  useEffect(() => {
    setMobile(false);
    setMega(false);
    setAcctOpen(false);
  }, [pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-ivory/90 backdrop-blur">
      {/* announcement strip */}
      <div className="bg-ink text-center text-[11px] uppercase tracking-luxe text-ivory/90">
        <p className="py-2">
          Complimentary worldwide shipping · New Love All FW26 has landed
        </p>
      </div>

      <div className="container-editorial flex items-center justify-between gap-4 py-4">
        {/* mobile menu button */}
        <button
          className="lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobile((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <Link href="/" className="flex flex-col items-center leading-none lg:items-start">
          <span className="font-display text-2xl tracking-wide text-ink">
            Sanskriti
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-gold-deep">
            Clothing
          </span>
        </Link>

        {/* desktop nav */}
        <nav
          className="hidden items-center gap-8 lg:flex"
          onMouseLeave={() => setMega(false)}
        >
          <button
            className="flex items-center gap-1 py-2 text-sm uppercase tracking-[0.14em] text-charcoal transition hover:text-gold-deep"
            onMouseEnter={() => setMega(true)}
            onFocus={() => setMega(true)}
            aria-expanded={mega}
          >
            Discover <ChevronDown />
          </button>
          <Link href="/shop" className="text-sm uppercase tracking-[0.14em] text-charcoal transition hover:text-gold-deep">
            Shop All
          </Link>
          <Link href="/our-story" className="text-sm uppercase tracking-[0.14em] text-charcoal transition hover:text-gold-deep">
            Our Story
          </Link>
          <Link href="/contact" className="text-sm uppercase tracking-[0.14em] text-charcoal transition hover:text-gold-deep">
            Contact
          </Link>
        </nav>

        {/* right icons */}
        <div className="flex items-center gap-3 text-charcoal sm:gap-4">
          <button aria-label="Search" onClick={() => setSearchOpen((v) => !v)} className="transition hover:text-gold-deep">
            <SearchIcon />
          </button>

          {/* account */}
          <div className="relative">
            <button
              aria-label="Account"
              onClick={() => setAcctOpen((v) => !v)}
              className="transition hover:text-gold-deep"
            >
              <UserIcon />
            </button>
            {acctOpen && (
              <div className="absolute right-0 top-8 z-50 w-52 rounded-xl border border-sand bg-white p-2 shadow-xl">
                {me.user ? (
                  <>
                    <p className="px-3 py-2 text-xs text-stone">
                      Hi, {me.user.name.split(" ")[0]}
                    </p>
                    <MenuLink href="/account">My Account</MenuLink>
                    <MenuLink href="/account/orders">My Orders</MenuLink>
                    <MenuLink href="/wishlist">Wishlist</MenuLink>
                    {me.user.role === "admin" && (
                      <MenuLink href="/admin">Admin Dashboard</MenuLink>
                    )}
                    <button
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST" });
                        setAcctOpen(false);
                        refresh();
                        router.push("/");
                        router.refresh();
                      }}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-charcoal transition hover:bg-cream"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <MenuLink href="/login">Log In / Sign Up</MenuLink>
                    <MenuLink href="/wishlist">Wishlist</MenuLink>
                    <MenuLink href="/contact">Contact Us</MenuLink>
                  </>
                )}
              </div>
            )}
          </div>

          <Link href="/wishlist" aria-label="Wishlist" className="relative transition hover:text-gold-deep">
            <HeartIcon />
            {me.wishlist > 0 && <Badge n={me.wishlist} />}
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative transition hover:text-gold-deep">
            <BagIcon />
            {me.cart > 0 && <Badge n={me.cart} />}
          </Link>

          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp us"
            className="hidden text-[#25D366] transition hover:opacity-80 sm:block"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>

      {/* search bar */}
      {searchOpen && (
        <div className="border-t border-sand bg-cream/60">
          <form onSubmit={submitSearch} className="container-editorial flex items-center gap-3 py-4">
            <SearchIcon className="h-5 w-5 text-stone" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search kurtas, sherwanis, collections…"
              className="w-full bg-transparent text-base text-ink outline-none placeholder:text-stone"
            />
            <button type="submit" className="btn-gold py-2">Search</button>
          </form>
        </div>
      )}

      {/* mega menu */}
      {mega && (
        <div
          className="absolute inset-x-0 top-full hidden border-t border-sand bg-ivory shadow-xl lg:block"
          onMouseEnter={() => setMega(true)}
          onMouseLeave={() => setMega(false)}
        >
          <div className="container-editorial grid grid-cols-4 gap-8 py-10">
            {megaColumns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 font-display text-lg text-ink">{col.title}</h3>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-charcoal transition hover:text-gold-deep"
                      >
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* mobile menu */}
      {mobile && (
        <div className="border-t border-sand bg-ivory lg:hidden">
          <div className="container-editorial space-y-6 py-6">
            {megaColumns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-2 font-display text-base text-ink">{col.title}</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-charcoal">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="gold-rule" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/our-story">Our Story</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/account">My Account</Link>
              <Link href="/account/orders">My Orders</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-lg px-3 py-2 text-sm text-charcoal transition hover:bg-cream">
      {children}
    </Link>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
      {n}
    </span>
  );
}
