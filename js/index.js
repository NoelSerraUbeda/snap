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
                let currentVariantIndex = -1; // Track current image index (-1 means the original art)

                // Dynamically create an array of variants
                const variants = [];
                if (card.variant1) variants.push(card.variant1);
                if (card.variant2) variants.push(card.variant2);
                if (card.variant3) variants.push(card.variant3);
                if (card.variant4) variants.push(card.variant4);
                // Add more if needed

                img.addEventListener("click", () => {
                    currentVariantIndex++;
                    if (currentVariantIndex >= variants.length) {
                        img.src = card.art;
                        currentVariantIndex = -1;
                    } else {
                        img.src = variants[currentVariantIndex];
                    }
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

                // Create the magnifying glass icon
                const magnifyIcon = document.createElement("div");
                magnifyIcon.innerHTML = `<svg width="50" height="50" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.4336 17.7336L18.7871 17.38L18.4336 17.0264L13.1017 11.6946C13.9812 10.5298 14.5 9.07527 14.5 7.5C14.5 3.63386 11.3661 0.5 7.5 0.5C3.63386 0.5 0.5 3.63386 0.5 7.5C0.5 11.3661 3.63386 14.5 7.5 14.5C9.06648 14.5 10.5194 13.9811 11.6831 13.1102L17.0164 18.4436L17.37 18.7971L17.7236 18.4436L18.4336 17.7336ZM2.5 7.5C2.5 4.73614 4.73614 2.5 7.5 2.5C10.2639 2.5 12.5 4.73614 12.5 7.5C12.5 10.2639 10.2639 12.5 7.5 12.5C4.73614 12.5 2.5 10.2639 2.5 7.5Z" fill="white" stroke="white"/></svg>`;
                magnifyIcon.classList.add("magnify-container");

                magnifyIcon.addEventListener("click", () => {
                    const currentImageUrl = img.src;
                    showModal(currentImageUrl);
                });

                cardDiv.appendChild(magnifyIcon);

                cardContainer.appendChild(cardDiv);
            });
        }
    }

    function showModal(imageUrl) {
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("modalImg");
        modal.style.display = "block";
        modalImg.src = imageUrl;
        document.body.classList.add("no-scroll");
    }

    function closeModal() {
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
        document.body.classList.remove("no-scroll");
    }

    // Get the modal element
    const modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        closeModal();
    }

    // When the user clicks anywhere outside of the modal content, close the modal
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    }

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
