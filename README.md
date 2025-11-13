# Skyroute Enterprise

This repository contains the source code for the Skyroute Enterprise portfolio website. It is built with [Astro](https://astro.build/) and [Cloudflare Pages](https://pages.cloudflare.com/), and it showcases the work of the Skyroute Enterprise team.

## Project Overview

The Skyroute Enterprise portfolio is a static website that showcases the company's work in the form of video case studies. It is designed to be a fast, modern, and accessible experience for visitors.

The site is built with [Astro](https://astro.build/), a web framework for building fast, content-focused websites. It uses [Tailwind CSS](https://tailwindcss.com/) for styling and [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) for the comments API.

## Getting Started

To get started with the project, you will need to have the following installed on your machine:

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [npm](https://www.npmjs.com/)

Once you have these installed, you can clone the repository and install the dependencies:

```bash
git clone https://github.com/skyroute/enterprise.git
cd enterprise
npm install
```

## Local Development

To start the local development server, run the following command:

```bash
npm run dev
```

This will start the Astro development server at `http://localhost:4321`. The site will automatically reload as you make changes to the code.

To emulate the Cloudflare Pages environment locally, you can use the `--experimental-integrations` flag:

```bash
npm run dev -- --experimental-integrations
```

## Usage

The website is a portfolio of the work of Skyroute Enterprise. Visitors can browse the different case studies, watch the videos, and leave comments.

The home page displays a list of all the case studies. Clicking on a case study will take you to the case study page, where you can watch the video and read a more detailed description of the project.

At the bottom of each case study page, there is a comment form where visitors can leave their thoughts. The comments are stored in a [Cloudflare KV namespace](https://developers.cloudflare.com/workers/runtime-apis/kv/).

## Project Structure

The project is organized into the following directories:

*   `astro.config.mjs`: The Astro configuration file.
*   `functions/api/comments.ts`: The Cloudflare Pages function that powers the comment widget.
*   `public/videos/`: Static assets and portfolio videos.
*   `src/`: The source code for the website, including pages, components, layouts, and styles.
*   `wrangler.toml`: The Wrangler configuration file for the Cloudflare Pages function.
*   `Dockerfile`: An optional container for the Cloudflared Web UI.
*   `操作流程圖`: A flowchart reference (in Traditional Chinese).
*   `從部署到日常維運、異常排查到自動化升級`: An operations playbook (in Traditional Chinese).

## Deployment

The website is deployed to [Cloudflare Pages](https://pages.cloudflare.com/). The deployment is handled automatically by [GitHub Actions](https://github.com/features/actions). When a change is pushed to the `main` branch, a GitHub Actions workflow is triggered that builds the website and deploys it to Cloudflare Pages.

For more information on the deployment process, see the [Skyroute Enterprise Deployment Guide](docs/deployment-guide.md).

## Contributing

Contributions are welcome! If you would like to contribute to the project, please fork the repository and open a pull request.
