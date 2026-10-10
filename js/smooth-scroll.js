const lenis = new Lenis({
    duration: 1,
    smoothWheel: true,
    wheelMultiplier: 0.2
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);