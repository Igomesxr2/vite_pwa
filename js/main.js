if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
    try {
    let reg;
    reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
    console.log('Service worker registrada! S', reg);
    } catch (err) {
    console.log('Service worker registro falhou: ', err);
    }
    })
}