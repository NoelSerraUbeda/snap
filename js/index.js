document.addEventListener('DOMContentLoaded', () => {
    const snapJsonUrl = "js/snap.json";
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("modalImg");
    const body = document.body;
    let scrollPosition = 0;

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
                img.addEventListener("click", () => {
                    modal.style.display = "flex";
                    modalImg.src = card.art;
                    disableScroll();
                });
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
                costPara.textContent = "Cost: " + card.cost;
                infoDiv.appendChild(costPara);

                const powerPara = document.createElement("p");
                powerPara.textContent = "Power: " + card.power;
                infoDiv.appendChild(powerPara);

                cardDiv.appendChild(infoDiv);

                cardContainer.appendChild(cardDiv);
            });
        }
    }

    function disableScroll() {
        scrollPosition = window.pageYOffset;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollPosition}px`;
    }

    function enableScroll() {
        body.style.removeProperty('overflow');
        body.style.removeProperty('position');
        body.style.removeProperty('top');
        window.scrollTo(0, scrollPosition);
    }

    modal.addEventListener("click", function (event) {
        if (event.target === modal || event.target.classList.contains("close")) {
            modal.style.display = "none";
            enableScroll();
        }
    });

    const filterInput = document.getElementById('filterInput');
    filterInput.addEventListener('input', function () {
        filterCards();
    });

    const costFilter = document.getElementById('costFilter');
    const powerFilter = document.getElementById('powerFilter');

    costFilter.addEventListener('change', () => {
        filterCards();
    });

    powerFilter.addEventListener('change', () => {
        filterCards();
    });

    function filterCards() {
        const filterValue = filterInput.value.toLowerCase();
        const selectedCost = costFilter.value;
        const selectedPower = powerFilter.value;
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const cardCost = parseInt(card.querySelector('.info p:nth-of-type(1)').textContent.split(":")[1].trim());
            const cardPower = parseInt(card.querySelector('.info p:nth-of-type(2)').textContent.split(":")[1].trim());

            const showByName = name.includes(filterValue);
            let showByCost = true;
            let showByPower = true;

            if (selectedCost !== "all") {
                const selectedCostNum = parseInt(selectedCost);
                showByCost = (selectedCostNum === cardCost || (selectedCost === "+7" && cardCost >= 7));
            }

            if (selectedPower !== "all") {
                const selectedPowerNum = parseInt(selectedPower);
                if (selectedPower === "+7") {
                    showByPower = cardPower >= 7; // Muestra las cartas con 7 o más de poder
                } else if (selectedPower === "Negative") {
                    showByPower = cardPower < 0; // Muestra las cartas con poder negativo
                } else {
                    showByPower = selectedPowerNum === cardPower; // Muestra las cartas con poder igual al seleccionado
                }
            }


            if (showByName && showByCost && showByPower) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }


    const clearFilterBtn = document.getElementById('clearFilterBtn');

    clearFilterBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.display = 'flex';
        });

        filterInput.value = '';

        costFilter.value = 'all';
        powerFilter.value = 'all';
    });

    showCards();
});
