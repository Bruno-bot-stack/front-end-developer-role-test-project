"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/app/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof skips)[number] | boolean | null>(
    null
  );
  const [selectedSkip, setSelectedSkip] = useState<(typeof skips)[number] | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const filteredSkips = useMemo(() => {
    if (filter === 'all') return skips;
    if (filter === 'road') return skips.filter(skip => skip.allowed_on_road === false && skip.allows_heavy_waste === true);
    if (filter === 'heavy') return skips.filter(skip => skip.allowed_on_road === false && skip.allows_heavy_waste === false);
    return skips;
  }, [filter]);

  const isSkipDisabled = (skip: typeof skips[number]) => {
    if (!skip.allowed_on_road && !skip.allows_heavy_waste) return true;

    if (filter === 'road' && !(skip.allowed_on_road === false && skip.allows_heavy_waste === true)) return true;
    if (filter === 'heavy' && !(skip.allowed_on_road === false && skip.allows_heavy_waste === false)) return true;

    return false;
  };

  const canClickSkip = (skip: typeof skips[number]) => {
    return skip.allows_heavy_waste && !(!skip.allowed_on_road && !skip.allows_heavy_waste);
  };

  const handleSkipSelect = (skip: typeof skips[number]) => {
    if (isSkipDisabled(skip)) {
      return;
    }

    if (selectedSkip && selectedSkip.id === skip.id) {
      setSelectedSkip(null);
    } else {
      setSelectedSkip(skip);
    }
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 bg-black/40 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: { duration: 0.3 }
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.2,
                },
              }}
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-slate-800 text-white rounded-full h-8 w-8"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              initial={{ borderRadius: 16 }}
              animate={{
                borderRadius: 24,
                transition: { duration: 0.3 }
              }}
              exit={{
                borderRadius: 16,
                transition: { duration: 0.3 }
              }}
              className="w-full max-w-[550px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-slate-900 text-white sm:rounded-3xl overflow-hidden shadow-xl"
            >
              <motion.div layoutId={`image-${active.id}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={"https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800"}
                  alt={`${active.size} Yard Skip`}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-6">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.id}-${id}`}
                      className="font-bold text-xl text-white"
                    >
                      {active.size} Yard Skip
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.id}-${id}`}
                      className="text-slate-300"
                    >
                      {active.hire_period_days} Day Hire - {active.postcode}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.id}-${id}`}
                    href={`/book-skip?id=${active.id}`}
                    target="_blank"
                    className="px-5 py-3 text-sm rounded-full font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    Book Now
                  </motion.a>
                </div>
                <div className="pt-4 relative px-6 pb-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-slate-300 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    <div>
                      <h4 className="font-semibold text-white mb-2">Skip Details</h4>
                      <ul className="space-y-2">
                        <li>Price: £{(active.price_before_vat * (1 + active.vat / 100)).toFixed(2)} (inc. VAT)</li>
                        <li>Base Price: £{active.price_before_vat}</li>
                        <li>VAT Rate: {active.vat}%</li>
                        <li>Hire Period: {active.hire_period_days} days</li>
                        <li>Road Placement: {active.allowed_on_road ? "Allowed" : "Not Allowed"}</li>
                        <li>Heavy Waste: {active.allows_heavy_waste ? "Accepted" : "Not Accepted"}</li>
                        {active.transport_cost && <li>Transport Cost: £{active.transport_cost}</li>}
                        {active.per_tonne_cost && <li>Per Tonne Cost: £{active.per_tonne_cost}</li>}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => { setSelectedSkip(null); setFilter('all') }}
          className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          All Skips
        </button>
        <button
          onClick={() => { setSelectedSkip(null); setFilter('road') }}
          className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'road' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Road Placement
        </button>
        <button
          onClick={() => { setSelectedSkip(null); setFilter('heavy') }}
          className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'heavy' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          Heavy Waste
        </button>
      </div>

      <ul className="max-w-2xl mx-auto w-full gap-4 p-4">
        {filteredSkips.map((skip) => (
          <motion.div
            layoutId={`card-${skip.id}-${id}`}
            key={`card-${skip.id}-${id}`}
            onClick={() => handleSkipSelect(skip)}
            initial={{ borderRadius: 12 }}
            whileHover={!isSkipDisabled(skip) ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
            className={`p-5 flex flex-col md:flex-row justify-between items-center ${isSkipDisabled(skip)
              ? 'cursor-not-allowed opacity-70'
              : 'hover:bg-slate-800 cursor-pointer'
              } bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl mb-4 shadow-md transition-all duration-200 border ${selectedSkip?.id === skip.id ? 'border-indigo-500' : 'border-slate-700'
              }`}
          >
            <div className="flex gap-5 flex-col md:flex-row">
              <motion.div
                layoutId={`image-${skip.id}-${id}`}
                className="overflow-hidden rounded-lg"
              >
                <Image
                  width={100}
                  height={100}
                  src={"https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800"}
                  alt={`${skip.size} Yard Skip`}
                  className="h-40 w-40 md:h-16 md:w-16 object-cover object-top transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${skip.id}-${id}`}
                  className="font-medium text-white text-center md:text-left text-lg"
                >
                  {skip.size} Yard Skip
                </motion.h3>
                <motion.p
                  layoutId={`description-${skip.id}-${id}`}
                  className="text-slate-300 text-center md:text-left"
                >
                  {skip.hire_period_days} Day Hire - {skip.postcode}
                </motion.p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${skip.allowed_on_road ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                    {skip.allowed_on_road ? 'Road: Yes' : 'Road: No'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${skip.allows_heavy_waste ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'}`}>
                    {skip.allows_heavy_waste ? 'Heavy: Yes' : 'Heavy: No'}
                  </span>
                </div>
              </div>
            </div>
            <motion.button
              layoutId={`button-${skip.id}-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isSkipDisabled(skip)) {
                  return;
                }
                if (!canClickSkip(skip)) {
                  return;
                }
                if (selectedSkip?.id === skip.id) {
                  setActive(skip);
                } else {
                  setSelectedSkip(skip);
                }
              }}
              className={`px-5 py-2 text-sm rounded-full font-bold ${selectedSkip?.id === skip.id
                ? 'bg-indigo-600'
                : isSkipDisabled(skip)
                  ? 'bg-slate-600 cursor-not-allowed'
                  : !canClickSkip(skip)
                    ? 'bg-orange-700 cursor-not-allowed'
                    : 'bg-slate-800 hover:bg-indigo-600 hover:scale-105'
                } text-white mt-4 md:mt-0 transition-all duration-200`}
            >
              {isSkipDisabled(skip)
                ? 'Not Available'
                : !canClickSkip(skip)
                  ? 'No Heavy Waste'
                  : selectedSkip?.id === skip.id
                    ? 'Selected'
                    : `£${(skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2)}`}
            </motion.button>
          </motion.div>
        ))}
      </ul>

      {selectedSkip && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4 flex justify-between items-center z-20"
        >
          <div className="flex items-center">
            <span className="text-indigo-400 font-bold mr-2">
              {selectedSkip.size} Yard Skip
            </span>
            <span className="text-slate-400 text-sm">
              {selectedSkip.hire_period_days} day hire
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedSkip(null)}
              className="px-4 py-2 rounded-md text-white bg-slate-800"
            >
              Back
            </button>
            <button
              onClick={() => setActive(selectedSkip)}
              className="px-4 py-2 rounded-md text-white bg-indigo-600 flex items-center"
            >
              Continue <span className="ml-1">→</span>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const skips = [
  {
    "id": 11554,
    "size": 4,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 311,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": true,
    "allows_heavy_waste": true
  },
  {
    "id": 11555,
    "size": 6,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 342,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": true,
    "allows_heavy_waste": true
  },
  {
    "id": 11556,
    "size": 8,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 420,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": true,
    "allows_heavy_waste": true
  },
  {
    "id": 11557,
    "size": 10,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 448,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": false,
    "allows_heavy_waste": false
  },
  {
    "id": 11558,
    "size": 12,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 491,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": false,
    "allows_heavy_waste": false
  },
  {
    "id": 11559,
    "size": 14,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 527,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": false,
    "allows_heavy_waste": false
  },
  {
    "id": 11560,
    "size": 16,
    "hire_period_days": 14,
    "transport_cost": null,
    "per_tonne_cost": null,
    "price_before_vat": 556,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": false,
    "allows_heavy_waste": false
  },
  {
    "id": 11561,
    "size": 20,
    "hire_period_days": 14,
    "transport_cost": 236,
    "per_tonne_cost": 236,
    "price_before_vat": 944,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": false,
    "allows_heavy_waste": true
  },
  {
    "id": 11562,
    "size": 40,
    "hire_period_days": 14,
    "transport_cost": 236,
    "per_tonne_cost": 236,
    "price_before_vat": 944,
    "vat": 20,
    "postcode": "NR32",
    "area": null,
    "forbidden": false,
    "created_at": "2021-04-06T17:04:42",
    "updated_at": "2024-04-02T09:22:38",
    "allowed_on_road": false,
    "allows_heavy_waste": false
  }
];