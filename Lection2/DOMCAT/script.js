function changeColor() {
    const box = document.getElementById("colorBox");
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    box.style.backgroundColor = randomColor;
    box.style.backgroundImage = "none";
}

async function changeImage() {
    const box = document.getElementById("imageBox");
    try {
        const response = await fetch("https://api.thecatapi.com/v1/images/search", {
            headers: {
                "x-api-key": "live_J6Viiq9qXxUvSPUEv4OStgo8cZn4NRHSULoRLAA16V4lZ17DKh9YBiAQll9SceLR"
            }
        });
        const data = await response.json();
        box.style.backgroundImage = `url(${data[0].url})`;
        box.style.backgroundSize = "cover";
        box.style.backgroundPosition = "center";
        box.style.backgroundColor = "white";
    } catch (error) {
        console.error("Ошибка при загрузке изображения:", error);
    }
}

