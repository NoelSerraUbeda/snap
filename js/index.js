document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = "https://marvel-snap-api.p.rapidapi.com/api/get-all-cards";
    const headers = {
        "X-RapidAPI-Key": "f091184b64mshf6d6b77de993561p1058d0jsn25994fda40d2",
        "X-RapidAPI-Host": "marvel-snap-api.p.rapidapi.com"
    };

    // Función para hacer la solicitud a la API
    async function getAllCards() {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener las cartas:", error);
        }
    }

    // Función para mostrar las cartas en el contenedor de tarjetas
    async function showCards() {
        const cardContainer = document.getElementById("cardContainer");
        const cards = await getAllCards();

        if (cards) {
            cards.forEach(card => {
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card");

                const img = document.createElement("img");
                img.src = card.art;
                cardDiv.appendChild(img);

                const name = document.createElement("h3");
                name.textContent = card.name;
                cardDiv.appendChild(name);

                const description = document.createElement("p");
                description.textContent = card.description;
                cardDiv.appendChild(description);

                cardContainer.appendChild(cardDiv);
            });
        }
    }

    // Llamar a la función para mostrar todas las tarjetas cuando se cargue la página
    showCards();
});
