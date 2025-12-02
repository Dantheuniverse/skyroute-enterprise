import { htmlResponse, jsonResponse, notFoundResponse } from './utils/responses.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET' && url.pathname === '/') {
    const environment = env?.ENVIRONMENT || 'production';
    const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;

    if (frontendUrl) {
      try {
        const destination = new URL(frontendUrl);

        if (destination.hostname !== url.hostname) {
          return Response.redirect(destination.toString(), 302);
        }
      } catch {
        // Ignore invalid frontend URLs and fall through to landing page
      }
    }
    
    // 完整的 HTML 内容，包含同步图片链接、修复的 YouTube 部分和 Tailwind CDN
    const newLandingPageHTML = `<!DOCTYPE html>
<html lang="en" class="min-h-full">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Drone Missions | Skyroute Enterprise</title>
    <meta name="description" content="Danieltheflukr FPV flights, pilots, panoramas, and cinematic pulls from the Taipei skyline.">
    <link rel="icon" type="image/svg+xml" href="https://skyroute-enterprise.pages.dev/favicon.svg">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* 基础 式和自定义属性 */
        body {
            background-color: #1a1a1a;
            color: white;
        }

        [data-surface] {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem; 
        }
    </style>
</head> 
<body class="flex min-h-screen flex-col"> 
    <header class="sticky top-0 z-50 border-b border-white/10 bg-[#090b12]/80 backdrop-blur-xl"> 
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"> 
            <div class="flex items-center gap-3 text-white"> 
                <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff4c60] to-[#6a5bff] text-lg font-bold shadow-lg shadow-[#ff4c60]/40">SE</span> 
                <div> 
                    <a href="https://skyroute-enterprise.pages.dev/" class="text-lg font-semibold tracking-tight text-white">Skyroute Enterprise</a> 
                    <p class="text-xs uppercase tracking-[0.35em] text-white/60">Personal creative lab</p> 
                </div> 
            </div> 
            <nav class="flex flex-wrap items-center gap-3 text-sm font-medium text-white/70"> 
                <a href="https://skyroute-enterprise.pages.dev/" class="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Home</a> 
                <a href="https://skyroute-enterprise.pages.dev/about" class="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">About</a> 
                <a href="https://skyroute-enterprise.pages.dev/blog" class="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Notes</a> 
                <a href="https://skyroute-enterprise.pages.dev/work/sky-temple" class="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">Selected work</a> 
                <a href="https://www.youtube.com/channel/UCirc3JMTevbTPhYZYhmvltQ" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"> 
                    <span aria-hidden="true">▶</span>
                    Watch on YouTube
                </a> 
            </nav> 
        </div> 
    </header> 
    <main class="flex-1">  
        <section class="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-black/60 via-black/30 to-black/20"> 
            <div class="absolute inset-0 -z-10 opacity-30"> 
                <div class="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gradient-to-br from-[#ff4c60]/70 to-[#6a5bff]/60 blur-[120px]"></div> 
                <div class="absolute bottom-0 right-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#6a5bff]/50 to-[#ffb347]/50 blur-[120px]"></div> 
            </div> 
            <div class="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:py-24"> 
                <div class="space-y-6 lg:w-7/12"> 
                    <span data-pill="">drone.danieltheflukr.com</span> 
                    <h1 class="text-4xl font-bold leading-tight sm:text-5xl">Flying Taipei with Danieltheflukr</h1> 
                    <p class="text-lg text-slate-300">
                        Cinematic FPV routes, fearless dives, and the crew behind the sticks. Every clip is framed to keep the skyline breathing,
                        and every mission is a story we tell with propellers instead of pens.
                    </p> 
                    <div class="flex flex-wrap gap-3 text-sm text-white/70"> 
                        <span class="rounded-full border border-white/20 px-3 py-1">FPV · Cinewhoop · Long range</span> 
                        <span class="rounded-full border border-white/20 px-3 py-1">Taipei City · Mountains · Coast</span> 
                        <span class="rounded-full border border-white/20 px-3 py-1">Danieltheflukr Personal Brand</span> 
                    </div> 
                </div> 
                <div class="lg:w-5/12"> 
                    <div data-surface="" class="relative overflow-hidden"> 
                        <img src="https://drone.danieltheflukr.com/PTSC_0215.JPG" alt="Danieltheflukr preparing FPV drone in Taipei" class="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy"> 
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div> 
                        <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-sm text-white/80"> 
                            <span class="font-semibold">Lead pilot: Daniel</span> 
                            <span class="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em]">Ready</span> 
                        </div> 
                    </div> 
                </div> 
            </div> 
        </section> 
        <section class="mx-auto max-w-6xl px-6 py-14"> 
            <div class="flex flex-col gap-10 lg:flex-row lg:items-start"> 
                <div class="lg:w-4/12"> 
                    <h2 class="text-2xl font-semibold text-white">Pilots on deck</h2> 
                    <p class="mt-3 text-slate-300">
                        The duo steering every sortie. Daniel frames the lines and executes the dives. Jackie secures the perimeter, spots
                        obstacles, and keeps the crew synced.
                    </p> 
                </div> 
                <div class="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2"> 
                    <article data-surface="" class="flex flex-col overflow-hidden"> 
                        <img src="https://drone.danieltheflukr.com/PTSC_0215.JPG" alt="Daniel the Flukr portrait" class="h-56 w-full object-cover" loading="lazy"> 
                        <div class="space-y-2 p-5"> 
                            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffb347]">Lead pilot · me /drone</p> 
                            <h3 class="text-xl font-semibold text-white">Daniel the Flukr</h3> 
                            <p class="text-sm text-slate-300">Designing routes, calling shots, and pulling the trigger when it is time to dive into the skyline.</p> 
                        </div> 
                    </article>
                    <article data-surface="" class="flex flex-col overflow-hidden"> 
                        <img src="https://drone.danieltheflukr.com/PTSC_0266.JPG" alt="Jackie portrait" class="h-56 w-full object-cover" loading="lazy"> 
                        <div class="space-y-2 p-5"> 
                            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffb347]">Sub pilot</p> 
                            <h3 class="text-xl font-semibold text-white">Jackie</h3> 
                            <p class="text-sm text-slate-300">Coordinating airspace details, safety checks, and recovery while keeping the team locked on the mission.</p> 
                        </div> 
                    </article> 
                </div> 
            </div> 
        </section> 
        <section class="border-t border-white/5 bg-white/5 py-14"> 
            <div class="mx-auto max-w-6xl px-6"> 
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"> 
                    <div> 
                        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Below the panorama of Taipei</p> 
                        <h2 class="text-3xl font-semibold text-white">Panorama sweeps</h2> 
                        <p class="mt-2 max-w-2xl text-slate-300">
                            Wide pulls over the river and city grid. Each pass mirrors the rhythm we want the audience to feel when the music hits.
                        </p> 
                    </div> 
                    <a href="https://skyroute-enterprise.pages.dev/#videos" class="text-sm text-[#ffb347] underline-offset-4 hover:text-white">Jump to flight logs</a> 
                </div> 
                <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"> 
                    <div data-surface="" class="overflow-hidden"> 
                        <img src="https://drone.danieltheflukr.com/PTSC_0014.JPG" alt="Taipei panorama 1" class="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy"> 
                    </div>
                    <div data-surface="" class="overflow-hidden"> 
                        <img src="https://drone.danieltheflukr.com/PTSC_0015.JPG" alt="Taipei panorama 2" class="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy"> 
                    </div> 
                </div> 
            </div> 
        </section> 
        <section class="mx-auto max-w-6xl px-6 py-14"> 
            <div class="flex flex-col gap-3"> 
                <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Selected drone pictures</p> 
                <h2 class="text-3xl font-semibold text-white">Still frames that feel like movement</h2> 
                <p class="max-w-3xl text-slate-300">
                    Frames pulled from sorties around Taipei—each chosen for texture, depth, and the sense that the drone is still moving
                    even when the shutter freezes the moment.
                </p> 
            </div> 
            <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"> 
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0212.JPG" alt="Selected drone capture 1" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure>
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0030.JPG" alt="Selected drone capture 2" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure>
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0242.JPG" alt="Selected drone capture 3" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure>
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0254.JPG" alt="Selected drone capture 4" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure>
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0255.JPG" alt="Selected drone capture 5" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure>
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0239.JPG" alt="Selected drone capture 6" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure>
                <figure data-surface="" class="group overflow-hidden"> 
                    <img src="https://drone.danieltheflukr.com/PTSC_0269.JPG" alt="Selected drone capture 7" class="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy"> 
                </figure> 
            </div> 
        </section> 
        <section id="videos" class="border-t border-white/5 bg-gradient-to-b from-black/30 via-black/40 to-black/60 py-16">
            <div class="mx-auto max-w-6xl px-6">
                <div class="flex flex-col gap-3">
                    <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">YouTube upload</p>
                    <h2 class="text-3xl font-semibold text-white">Flight logs in motion</h2>
                    <p class="max-w-3xl text-slate-300">
                        Four runs from the Danieltheflukr lab—each edited to keep the prop wash low and the momentum high. Plug in and ride the
                        line with us.
                    </p>
                </div>
                <div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <article data-surface="" class="overflow-hidden">
                        <div class="aspect-video w-full overflow-hidden">
                            <iframe src="https://www.youtube.com/embed/QvtcwlThqKA" title="Taipei dusk run · One take energy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="h-full w-full" loading="lazy"></iframe>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-white">Taipei dusk run · One take energy</h3>
                            <p class="text-sm text-slate-400">Captured and graded by Danieltheflukr · FPV story drops.</p>
                        </div>
                    </article>
                    <article data-surface="" class="overflow-hidden">
                        <div class="aspect-video w-full overflow-hidden">
                            <iframe src="https://www.youtube.com/embed/YnG5uPjQIJA" title="Forest line · Tight gaps and chase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="h-full w-full" loading="lazy"></iframe>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-white">Forest line · Tight gaps and chase</h3>
                            <p class="text-sm text-slate-400">Captured and graded by Danieltheflukr · FPV story drops.</p>
                        </div>
                    </article>
                    <article data-surface="" class="overflow-hidden">
                        <div class="aspect-video w-full overflow-hidden">
                            <iframe src="https://www.youtube.com/embed/tf0kiuotJlc" title="Night cruise · Neon reflections" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="h-full w-full" loading="lazy"></iframe>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-white">Night cruise · Neon reflections</h3>
                            <p class="text-sm text-slate-400">Captured and graded by Danieltheflukr · FPV story drops.</p>
                        </div>
                    </article>
                    <article data-surface="" class="overflow-hidden">
                        <div class="aspect-video w-full overflow-hidden">
                            <iframe src="https://www.youtube.com/embed/ZQ6BkpC9VOo" title="Mountain wind · Trust the rig" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="h-full w-full" loading="lazy"></iframe>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-white">Mountain wind · Trust the rig</h3>
                            <p class="text-sm text-slate-400">Captured and graded by Danieltheflukr · FPV story drops.</p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
        <section class="mx-auto max-w-6xl px-6 py-14"> 
            <div data-surface="" class="flex flex-col items-start gap-4 px-8 py-10 md:flex-row md:items-center md:justify-between"> 
                <div> 
                    <p class="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">Next flight</p> 
                    <h3 class="text-2xl font-semibold text-white">Need aerial coverage or FPV storytelling?</h3> 
                    <p class="mt-2 max-w-2xl text-slate-300">
                        Drop a line with the location, vibe, and deadline. We will chart a route, prep the batteries, and keep the Danieltheflukr
                        brand energy on every deliverable.
                    </p> 
                </div> 
                <div class="flex flex-wrap gap-3"> 
                    <a data-gradient-button="" href="mailto:hello@skyrouteenterprise.com">Email the crew</a> 
                    <a class="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60" href="https://www.youtube.com/channel/UCirc3JMTevbTPhYZYhmvltQ" target="_blank" rel="noreferrer">
                        Watch more on YouTube
                    </a> 
                </div> 
            </div> 
        </section>  
    </main> 
    <footer class="border-t border-white/10 bg-black/40 py-10 text-sm text-slate-300"> 
        <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 lg:flex-row lg:items-center lg:justify-between"> 
            <div class="space-y-2"> 
                <p class="text-base font-semibold text-white">Skyroute Enterprise</p> 
                <p class="max-w-xl text-sm text-slate-400">
                    A cinematic playground documenting builds, experiments, and immersive stories. Subscribe on YouTube to follow the journey
                    in real time.
                </p> 
            </div> 
            <div class="flex flex-wrap gap-4 text-sm text-slate-300"> 
                <a href="mailto:hello@skyrouteenterprise.com" class="hover:text-white">hello@skyrouteenterprise.com</a> 
                <a href="https://www.youtube.com/channel/UCirc3JMTevbTPhYZYhmvltQ" class="hover:text-white" target="_blank" rel="noreferrer">YouTube</a> 
                <a href="https://www.instagram.com/skyrouteenterprise" class="hover:text-white" target="_blank" rel="noreferrer">Instagram</a> 
            </div> 
        </div> 
        <div class="mx-auto mt-6 max-w-6xl px-6 text-xs uppercase tracking-[0.3em] text-white/40">
            © 2025 Skyroute Enterprise. Built with Astro.
        </div> 
    </footer> 
</body>
</html>`;

    return htmlResponse(newLandingPageHTML);
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}