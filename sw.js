self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static")
        .then(cache => {
            return cache.addAll(
                ["./",
                    "./carto.html",
                    "./data-viz.html",
                    "./soft.html",
                    "scripts/script.js",
                    "styles/styles.css",
                    "assets/icon.png",
                    "assets/icon512.png",
                    "assets/bayo.svg",
                    "assets/portfolio/carto/c1.png",
                    "assets/portfolio/carto/c2.png",
                    "assets/portfolio/carto/c3.png",
                    "assets/portfolio/carto/c4.png",
                    "assets/portfolio/carto/c5.png",
                    "assets/portfolio/carto/c6.png",
                    "assets/portfolio/carto/c7.png",
                    "assets/portfolio/carto/c8.jpg",
                    "assets/portfolio/data-viz/p1.png",
                    "assets/portfolio/data-viz/p2.png",
                    "assets/portfolio/data-viz/p3.png",
                    "assets/portfolio/data-viz/v1.mp4",
                    "assets/portfolio/data-viz/v2.mp4",
                    "assets/portfolio/soft/p1.png",
                    "assets/portfolio/soft/p2.png",
                    "assets/portfolio/soft/p3.png",
                    "assets/portfolio/soft/p4.png",
                    "assets/portfolio/soft/p5.png",
                    "assets/portfolio/soft/p6.png",
                    "assets/portfolio/soft/p7.png",
                    "assets/portfolio/soft/p8.png",
                    "assets/portfolio/soft/p9.png",
                    "assets/portfolio/soft/p10.png",
                    "assets/portfolio/soft/p11.png"
                ]
            )
        })
    )
});

// fetch request... install button shows up

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            return res || fetch(e.request);
        })
    );
});