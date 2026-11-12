# 1SHOT3D

**Build a 3D scene in the browser. Export it as a single, self-contained HTML file you can embed anywhere.**

1SHOT3D is a lightweight, web-based 3D environment editor. Drag and drop primitive shapes, style them, and export them into a single `.html` file. No backend, no dependencies, no bundlers required on the host site, just drop it in an `<iframe>`.

## Features

- **Visual Editor:** Add boxes, spheres, planes, and cylinders.
- **Manipulation:** Smooth translation, rotation, and scaling via 3D gizmos.
- **Styling:** Customize object colors instantly.
- **One-Click Export:** Generates a standalone `.html` file containing the Three.js runtime and your scene data.
- **Embed Anywhere:** Drop the exported file into any website via an `<iframe>`.
- **Interactive API:** Control the camera or pause the animation from the host page using `postMessage`.

## Local Development

To run the editor locally:

    npm install
    npm run dev

Open http://localhost:5173 in your browser.

## How to Embed Your Export

Once you create a scene, click **"Export for Web"**. This downloads `1shot3d-scene.html`.

### Standard Embed

    <iframe 
      src="1shot3d-scene.html" 
      style="width: 100%; height: 500px; border: none; border-radius: 8px;">
    </iframe>

### Full-Page Background

Position the iframe behind your content and disable pointer events so users can still click your website:

    <iframe 
      src="1shot3d-scene.html" 
      style="position: fixed; inset: 0; width: 100%; height: 100%; border: none; pointer-events: none; z-index: -1;">
    </iframe>

## postMessage API

You can control the exported scene from the parent webpage by sending messages to the iframe.

    const frame = document.querySelector('iframe');

    // Move the camera (x, y, z)
    frame.contentWindow.postMessage({ type: 'setCamera', position: [10, 5, 10] }, '*');

    // Look at a specific point (x, y, z)
    frame.contentWindow.postMessage({ type: 'setTarget', target: [0, 0, 0] }, '*');

    // Pause or resume the render loop (saves battery/CPU)
    frame.contentWindow.postMessage({ type: 'pause' }, '*');
    frame.contentWindow.postMessage({ type: 'resume' }, '*');

## Tech Stack

- **React 18** & **TypeScript**
- **Three.js** (via `@react-three/fiber` and `@react-three/drei`)
- **Vite**

---

## Changelog

### Release log N.1

**Added:**
- Core 1SHOT3D editor interface with Canvas viewport and OrbitControls.
- Primitive generation (Box, Sphere, Plane, Cylinder).
- Object inspector panel for selecting, deleting, and recoloring objects.
- TransformControls integration for translate, rotate, and scale modes.
- Self-contained HTML exporter (`generateHtml.ts`).
- Injected `postMessage` API into the exported runtime for external control.
- Fading watermark on exported scenes.

**Fixed:**
- Resolved a critical state-desync bug where dragging the gizmo would fight with React's render cycle, causing objects to only move a "smidge."
- Implemented `forwardRef` and deferred state updates (`onMouseUp`) to ensure buttery-smooth 60fps 3D dragging.
