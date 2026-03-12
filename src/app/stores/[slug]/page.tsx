import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { ServiceGallery } from "@/components/service-gallery";
import { getAllStores, getStoreBySlug } from "@/lib/stores";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () =>
  getAllStores().map((store) => ({ slug: store.slug }));

export const generateMetadata = async ({
  params,
}: StorePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    return {
      title: "Store Not Found | WashMe",
    };
  }

  return {
    title: `${store.name} | WashMe`,
    description: `Book at ${store.name} in ${store.city}. View prices, gallery photos, map location, and available one-hour slots before confirming your booking.`,
  };
};

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  return (
    <div className="px-4 pb-28 pt-10 sm:px-8">
      <main className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
        >
          ← Back to Store Search
        </Link>

        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 lg:hidden">
          <p className="text-sm font-semibold text-blue-900">Book in 2 quick steps</p>
          <p className="mt-1 text-xs text-blue-800">
            Pick your date/time first, then confirm your contact details.
          </p>
          <a
            href="#booking-panel"
            className="animate-attention mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white"
          >
            Start Booking Now
          </a>
        </div>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <aside id="booking-panel" className="order-1 lg:sticky lg:top-8 lg:order-2">
            <BookingForm store={store} />
          </aside>

          <article className="order-2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.5)] lg:order-1">
            <div className="h-72 overflow-hidden sm:h-[23rem]">
              <Image
                src={store.heroImageUrl}
                alt={`${store.name} store`}
                width={1800}
                height={900}
                sizes="(min-width: 1024px) 65vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">{store.name}</h1>
                <p className="mt-2 text-sm text-slate-600">
                  {store.address} · {store.city}, {store.district} District
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                    {store.hours}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 font-medium ${
                      store.instantBookingEnabled
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {store.instantBookingEnabled
                      ? "Instant booking active"
                      : "Limited slot release"}
                  </span>
                </div>

                <a
                  href={store.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  Open in Google Maps
                </a>
              </div>

              <section>
                <h2 className="text-2xl font-semibold">Service Center Photos</h2>
                <div className="mt-4">
                  <ServiceGallery images={store.galleryImageUrls} storeName={store.name} />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">Service Menu</h2>
                <ul className="mt-4 space-y-3">
                  {store.services.map((service) => (
                    <li
                      key={service.name}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold">{service.name}</h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            LKR {service.priceLkr.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {service.durationMinutes} mins
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        </div>
      </main>

      <a
        href="#booking-panel"
        className="fixed inset-x-4 bottom-4 z-30 inline-flex h-12 items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white shadow-lg lg:hidden"
      >
        Pick Date & Time to Book
      </a>
    </div>
  );
}
