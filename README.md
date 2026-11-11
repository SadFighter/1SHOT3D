# 1SHOT3D

Build a 3D scene in the browser and export it as a single self-contained
HTML file you can embed anywhere with an `<iframe>`.

## Dev

    npm install
    npm run dev

Open http://localhost:5173.

## Export

Click **Export for Web** → downloads `1shot3d-scene.html`.
Embed it:

    <iframe src="1shot3d-scene.html" style="width:100%;height:500px;border:0;"></iframe>

As a full-page background:

    <iframe src="1shot3d-scene.html"
      style="position:fixed;inset:0;width:100%;height:100%;border:0;pointer-events:none;z-index:-1;">
    </iframe>

## postMessage API

    frame.contentWindow.postMessage({ type: 'setCamera', position: [10,5,10] }, '*');
    frame.contentWindow.postMessage({ type: 'setTarget', target: [0,0,0] }, '*');
    frame.contentWindow.postMessage({ type: 'pause' }, '*');
    frame.contentWindow.postMessage({ type: 'resume' }, '*');