import { htmlResponse, jsonResponse, notFoundResponse } from './utils/responses.js';

// ** IMPORTANT: The actual CSS/JS dependencies (like Tailwind) for this HTML must be
//    included in the <head> of the HTML itself for the page to render correctly.
//    If they are external, make sure the links are valid!

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET' && url.pathname === '/') {
    const environment = env?.ENVIRONMENT || 'production';
    
    // NOTE: The environment variable (${environment}) from the Worker is no longer 
    // explicitly used in the main body, but the route is dedicated to the new page.

    // *** START OF YOUR NEW LANDING PAGE HTML ***
    const newLandingPageHTML = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flying Taipei with Danieltheflukr | Skyroute Enterprise Drone Lab</title>
    <style>
        /* Define missing styles if not using a CDN, e.g., styles for data-pill, data-surface, data-gradient-button */
        :root {
            --color-primary: #ffb347;
            --color-secondary: #ff4c60;
            --color-surface: rgba(255, 255, 255, 0.05);
        }

        body {
            background-color: #1a1a1a; /* Dark background */
            color: white;
        }

        /* Replicating key Tailwind effects for a clean look */
        [data-surface] {
            background-color: var(--color-surface);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem; /* rounded-3xl equivalent */
        }
        
        [data-pill] {
            display: inline-flex;
            align-items: center;
            border-radius: 9999px; /* rounded-full */
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.75rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--color-primary);
        }

        [data-gradient-button] {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px; /* rounded-full */
            font-weight: 600;
            text-align: center;
            color: white;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        [data-gradient-button]:hover {
            opacity: 0.9;
            box-shadow: 0 4px 15px rgba(255, 76, 96, 0.5); /* Shadow for hover effect */
        }
    </style>
</head>
<body>
<main class="min-h-screen">
  <section class="relative min-h-[700px] flex items-center">
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 -z-10"></div>

    <div class="absolute inset-0 -z-10">
      <img
        src="https://drone.danieltheflukr.com/PTSC_0014.JPG"
        alt="Taipei drone panorama by Danieltheflukr"
        class="w-full h-full object-cover opacity-70"
      />
    </div>

    <div class="container mx-auto px-6 py-20 lg:py-24 relative z-10">
      <div class="flex flex-col lg:flex-row items-start lg:items-center gap-10">
        <div class="lg:w-7/12 space-y-6">
          <span data-pill>Skyroute Enterprise · Drone Lab</span>

          <h1 class="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight">
            Flying Taipei<br />
            with <span class="text-[#ffb347]">Danieltheflukr</span>
          </h1>

          <p class="text-lg text-slate-300 max-w-2xl leading-relaxed">
            Cinematic FPV routes, fearless dives, and skyline stories over Taipei.  
            Every mission balances clean lines, safe airspace, and a bit of
            controlled chaos from the lab.
          </p>

          <div class="flex flex-wrap gap-3 text-sm text-slate-300">
            <span class="inline-flex items-center rounded-full border border-white/20 px-3 py-1">
              FPV · Cinewhoop · Long-range
            </span>
            <span class="inline-flex items-center rounded-full border border-white/20 px-3 py-1">
              Taipei City · Rivers · Mountains · Coast
            </span>
            <span class="inline-flex items-center rounded-full border border-white/20 px-3 py-1">
              Personal brand · Story-driven flights
            </span>
          </div>

          <div class="flex flex-wrap gap-4 mt-4">
            <a
              href="mailto:hello@skyrouteenterprise.com"
              data-gradient-button
              class="bg-gradient-to-r from-[#ff4c60]/70 via-[#ff6f8c] to-[#ffb347]/50"
            >
              Book a flight mission
            </a>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm text-white/80 hover:border-white/40 hover:bg-white/10 transition"
            >
              ▶ Watch on YouTube
            </a>
          </div>

          <p class="text-sm text-slate-400 mt-2">
            Drone hub: <span class="font-semibold">drone.danieltheflukr.com</span>
          </p>
        </div>

        <div class="lg:w-5/12 flex flex-col gap-4">
          <div
            data-surface
            class="overflow-hidden shadow-2xl shadow-[#ff4c60]/40 hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div class="relative aspect-[4/5]">
              <img
                src="https://drone.danieltheflukr.com/PTSC_0215.JPG"
                alt="Danieltheflukr with drone"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <p class="text-xs uppercase tracking-[0.25em] text-white/60 mb-1">
                  Lead pilot
                </p>
                <h2 class="text-2xl font-bold">Daniel the Flukr</h2>
                <p class="text-sm text-white/70 mt-1">
                  Designing routes, calling the shots, and pulling the trigger
                  when it’s time to dive the skyline.
                </p>
              </div>
            </div>
          </div>

          <div
  data-surface
  class="overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all flex gap-4 p-4 items-center"
>
  <div class="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0">
    <img
      src="https://drone.danieltheflukr.com/20251111_222650000_iOS.jpg"
      alt="Jackie portrait"
      class="w-full h-full object-cover"
    />
  </div>
  <div class="space-y-1">
    <p class="text-xs uppercase tracking-[0.25em] text-white/60">
      Sub pilot · Safety
    </p>
    <h3 class="text-xl font-semibold">Jackie</h3>
    <p class="text-sm text-slate-300">
      Securing space, double-checking failsafes, and keeping each
      sortie locked on the mission.
    </p>
  </div>
</div>

          </div>

          <div
            data-surface
            class="overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all flex gap-4 p-4 items-center"
          >
            <div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src="https://love.danieltheflukr.com/Im6AkCSzRliLlgUCAWsauQ.jpg"
                alt="Rabbit and bag"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="space-y-1">
              <p class="text-xs uppercase tracking-[0.25em] text-white/60">
                Ground charm
              </p>
              <p class="text-sm text-slate-300">
                A small reminder that every crazy flight still lands back in
                real life, with bags, rabbits, and people we care about.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 md:py-20">
    <div class="container mx-auto px-6">
      <div class="flex flex-col lg:flex-row lg:items-center gap-10">
        <div class="lg:w-5/12 space-y-4">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Panorama sweeps over Taipei
          </h2>
          <p class="text-slate-300 leading-relaxed">
            Wide pulls over the river, grid, and bridges. Each pass is timed
            with the light and the track—so the city breathes while the drone
            keeps moving.
          </p>
          <p class="text-sm text-slate-400">
            Ideal for intros, city reveals, and sequences where you want Taipei
            to feel alive but not overwhelming the story.
          </p>
        </div>

        <div class="lg:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="relative overflow-hidden rounded-3xl border border-white/10">
            <img
              src="https://drone.danieltheflukr.com/PTSC_0014.JPG"
              alt="Taipei panorama 1"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="relative overflow-hidden rounded-3xl border border-white/10">
            <img
              src="https://drone.danieltheflukr.com/PTSC_0015.JPG"
              alt="Taipei panorama 2"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 md:py-20 border-t border-white/10">
    <div class="container mx-auto px-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
        <div class="max-w-2xl space-y-3">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Still frames that feel like movement
          </h2>
          <p class="text-slate-300 leading-relaxed">
            Frames pulled from sorties around Taipei—chosen for depth, texture,
            and the feeling that the drone is still moving even when the
            shutter stops.
          </p>
        </div>
        <div class="text-sm text-slate-400 max-w-sm">
          <p>
            Use these as thumbnails, key art, or mood boards for future
            missions. Each shot keeps enough negative space for titles and
            overlays.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div data-surface class="overflow-hidden group">
          <img
            src="https://drone.danieltheflukr.com/PTSC_0212.JPG"
            alt="Drone capture 0212"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div data-surface class="overflow-hidden group">
          <img
            src="https://drone.danieltheflukr.com/PTSC_0030.JPG"
            alt="Drone capture 0030"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div data-surface class="overflow-hidden group">
          <img
            src="https://drone.danieltheflukr.com/PTSC_0242.JPG"
            alt="Drone capture 0242"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div data-surface class="overflow-hidden group">
          <img
            src="https://drone.danieltheflukr.com/PTSC_0254.JPG"
            alt="Drone capture 0254"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div data-surface class="overflow-hidden group">
          <img
            src="https://drone.danieltheflukr.com/PTSC_0255.JPG"
            alt="Drone capture 0255"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div data-surface class="overflow-hidden group">
          <img
            src="https://drone.danieltheflukr.com/PTSC_0239.JPG"
            alt="Drone capture 0239"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 md:py-20 border-t border-white/10">
    <div class="container mx-auto px-6">
      <div
        data-surface
        class="relative overflow-hidden p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8"
      >
        <div class="absolute -left-24 bottom-0 w-64 h-64 bg-gradient-to-tr from-[#ff4c60]/70 to-[#6a5bff]/60 blur-[120px] opacity-80 -z-10"></div>
        <div class="absolute -right-24 top-0 w-64 h-64 bg-gradient-to-br from-[#6a5bff]/50 to-[#ffb347]/50 blur-[120px] opacity-80 -z-10"></div>

        <div class="space-y-3 max-w-xl">
          <p class="text-xs uppercase tracking-[0.3em] text-white/60">
            Next flight · Booking
          </p>
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
            Need aerial coverage or FPV storytelling?
          </h2>
          <p class="text-slate-300">
            Send the location, vibe, and deadline. We’ll chart a route, prep the
            batteries, and keep the Danieltheflukr brand energy on every
            deliverable—from raw flight packs to finished edits.
          </p>
        </div>

        <div class="space-y-3">
          <a
            href="daniel.dai@g2-travel.com"
            data-gradient-button
            class="bg-gradient-to-r from-[#ff4c60] via-[#ff6f8c] to-[#ffb347]/50"
          >
            Email the crew
          </a>
          <p class="text-xs text-slate-400">
            Or ping via social · YouTube / Instagram · Add subject
            <span class="font-semibold text-slate-200">
              [FPV mission · Taipei]
            </span>
            for faster routing.
          </p>
        </div>
      </div>
    </div>
  </section>
</main>
</body>
</html>`;
    // *** END OF YOUR NEW LANDING PAGE HTML ***


    return htmlResponse(newLandingPageHTML);
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}
