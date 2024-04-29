document.addEventListener('DOMContentLoaded', () => {
    const snapJsonUrl = "js/snap.json";

    async function getAllCards() {
        try {
            const response = await fetch(snapJsonUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error al obtener las cartas:", error);
        }
    }

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

                const infoDiv = document.createElement("div");
                infoDiv.classList.add("info");

                const costPara = document.createElement("p");
                costPara.textContent = "Coste: " + card.cost;
                infoDiv.appendChild(costPara);

                const powerPara = document.createElement("p");
                powerPara.textContent = "Poder: " + card.power;
                infoDiv.appendChild(powerPara);

                cardDiv.appendChild(infoDiv);

                cardContainer.appendChild(cardDiv);
            });
        }
    }

    showCards();
});
