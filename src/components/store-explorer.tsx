"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  distanceFrom,
  getMinimumPackagePrice,
  sortStoresByDistance,
  type Store,
} from "@/lib/stores";

type StoreExplorerProps = {
  stores: Store[];
};

type Coordinates = {
  lat: number;
  lng: number;
};

const readableDistance = (value: number) =>
  value < 1 ? `${Math.round(value * 1000)} m` : `${value.toFixed(1)} km`;

const pseudoRating = (storeId: string) => {
  const numeric = Number(storeId.replace("store_", ""));
  return (8.2 + numeric * 0.2).toFixed(1);
};

export const StoreExplorer = ({ stores }: StoreExplorerProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [locationState, setLocationState] = useState<string>(
    "Use your location to prioritize nearest wash centers."
  );
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const discoverNearest = () => {
    if (!navigator.geolocation) {
      setLocationState("This browser does not support location access.");
      return;
    }

    setLocationState("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationState("Nearest stores are now sorted by your location.");
      },
      () => {
        setLocationState(
          "Location permission was denied. Showing all stores by default."
        );
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const visibleStores = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();
    const filteredStores = normalizedSearch
      ? stores.filter((store) => {
          const searchableText =
            `${store.name} ${store.city} ${store.district} ${store.address}`.toLowerCase();
          return searchableText.includes(normalizedSearch);
        })
      : stores;

    if (!coordinates) {
      return filteredStores;
    }

    return sortStoresByDistance(coordinates, filteredStores);
  }, [coordinates, searchValue, stores]);

  return (
    <div className="relative min-h-screen overflow-x-hidden px-4 pb-20 pt-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="animate-fade-in rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold tracking-[0.18em] text-orange-700 uppercase">
              WashMe Sri Lanka
            </p>
            <Link
              href="/bookings/search"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 sm:h-10 sm:px-4 sm:text-sm"
            >
              Track My Booking
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
            Book a Guaranteed Car Wash Slot Without Waiting
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Discover trusted car wash centers, compare package prices, and book in
            minutes.
          </p>

          <div className="mt-7 flex flex-col gap-3 md:flex-row">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none ring-blue-400 transition focus:ring-2"
              placeholder='Search by city or district (e.g. "Kottawa", "Galle")'
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={discoverNearest}
                className="h-12 flex-1 rounded-2xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 md:flex-none md:px-6"
              >
                Use My Location
              </button>
              <Link
                href="/bookings/search"
                className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-500 md:hidden"
              >
                Track Booking
              </Link>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">{locationState}</p>
        </header>

        <section className="mt-8 space-y-4">
          {visibleStores.map((store, index) => {
            const distanceLabel =
              coordinates === null
                ? null
                : readableDistance(distanceFrom(coordinates, store));
            const minimumPrice = getMinimumPackagePrice(store);
            const rating = pseudoRating(store.id);

            return (
              <article
                key={store.id}
                className="animate-rise overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_12px_28px_-20px_rgba(30,58,138,0.45)]"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div className="grid md:grid-cols-[260px_1fr_220px]">
                  <div className="relative h-52 md:h-full">
                    <Image
                      src={store.heroImageUrl}
                      alt={`${store.name} car wash`}
                      fill
                      sizes="(min-width: 768px) 260px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-semibold text-blue-900">{store.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">{store.address}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">Very Good</p>
                        <div className="ml-auto mt-1 inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-700 px-2 text-sm font-bold text-white">
                          {rating}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                        {store.city}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                        {store.district} District
                      </span>
                      {distanceLabel ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                          {distanceLabel}
                        </span>
                      ) : null}
                    </div>

                    <div className="text-sm text-slate-700">
                      <p className="font-medium text-emerald-700">Free booking cancellation</p>
                      <p>{store.hours}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between border-t border-blue-100 p-4 md:border-l md:border-t-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="text-2xl font-bold text-slate-900">
                        LKR {minimumPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">per wash package</p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Link
                        href={`/stores/${store.slug}`}
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-700 px-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                      >
                        See Availability
                      </Link>
                      <a
                        href={store.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                      >
                        Open Google Map
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};
