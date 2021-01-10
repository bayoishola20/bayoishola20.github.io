if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(registration => {
            console.log("SW success");
            console.log(registration);
        })
        .catch(err => {
            console.log("SW fail");
            console.log(err);
        })

}