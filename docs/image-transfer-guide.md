# Adding images from Google Drive

If you want to keep your Skyroute Enterprise repo in sync with pictures stored in Google Drive, follow these steps. This flow keeps files organized under `public/images` so they are served statically by Astro.

## 1. Prepare a local sync folder
- Create a folder on your machine dedicated to the project images (for example, `skyroute-images`).
- Add subfolders as needed to mirror how you want the files organized in the site (for example, `products/`, `team/`, `blog/`).

## 2. Pull images from Google Drive
Choose one of the following options to copy files from Drive into your local sync folder:

- **Google Drive for Desktop (GUI):**
  1. Install Google Drive for Desktop and sign in to the account with the pictures.
  2. Mount the Drive (it appears as a new drive letter on Windows or under `/Volumes/GoogleDrive` on macOS).
  3. Drag the needed image folders into your local `skyroute-images` folder.
- **Google Drive for Desktop (sync):**
  1. Create a new Google Drive sync location pointing to `skyroute-images`.
  2. Select the Drive folders that contain pictures. Changes in Drive will sync down automatically.
- **Download via browser:**
  1. In Google Drive, right-click the folder or files you need and select **Download**.
  2. Extract the downloaded archive into `skyroute-images`.

> Tip: Keep filenames web-friendly—lowercase letters, numbers, dashes, and underscores—and avoid spaces.

## 3. Copy images into the repo
1. From the project root, ensure the `public/images` folder exists (a `.gitkeep` file is already present so Git tracks the folder).
2. Copy or move your local images into `public/images`, preserving any subfolder structure.
   ```bash
   # example
   cp -R ~/skyroute-images/products public/images/
   cp -R ~/skyroute-images/team public/images/
   ```
3. Use `npm run format` if you add metadata files (e.g., JSON) alongside the images so the project formatting rules are applied.

## 4. Commit and push
1. Check what changed:
   ```bash
   git status
   ```
2. Add the new images and commit:
   ```bash
   git add public/images
   git commit -m "Add site images"
   git push
   ```
3. Open a pull request if needed.

## 5. Optional: use Git LFS for large batches
If you expect to store hundreds of megabytes of images, consider enabling [Git LFS](https://git-lfs.com/) before adding them to reduce repository size:
```bash
git lfs install
git lfs track "public/images/**"
git add .gitattributes public/images
```

## 6. Keep things organized
- Delete unused images when you remove them from pages to avoid bloat.
- Prefer optimized formats (`.webp`, `.avif`, or compressed `.jpg`) to keep the site fast.
- If you automate syncing from Drive, run the sync into `public/images` and commit only the files you intend to publish.
