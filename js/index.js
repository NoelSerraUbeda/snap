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
                magnifyIcon.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 7V6.75H13H11H10.75V7V10.75H7H6.75V11V13V13.25H7H10.75V17V17.25H11H13H13.25V17V13.25H17H17.25V13V11V10.75H17H13.25V7ZM12 19.75C7.72807 19.75 4.25 16.2719 4.25 12C4.25 7.72807 7.72807 4.25 12 4.25C16.2719 4.25 19.75 7.72807 19.75 12C19.75 16.2719 16.2719 19.75 12 19.75ZM12 1.75C10.654 1.75 9.32108 2.01512 8.07749 2.53023C6.83391 3.04535 5.70396 3.80036 4.75216 4.75216C2.82991 6.6744 1.75 9.28153 1.75 12C1.75 14.7185 2.82991 17.3256 4.75216 19.2478C5.70396 20.1996 6.83391 20.9547 8.07749 21.4698C9.32108 21.9849 10.654 22.25 12 22.25H20C20.5967 22.25 21.169 22.0129 21.591 21.591C22.0129 21.169 22.25 20.5967 22.25 20V12C22.25 10.654 21.9849 9.32108 21.4698 8.07749C20.9547 6.83391 20.1996 5.70396 19.2478 4.75216C18.296 3.80036 17.1661 3.04535 15.9225 2.53023C14.6789 2.01512 13.346 1.75 12 1.75Z" fill="#29033a" stroke="#29033a" stroke-width="0.5"/></svg>`;
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
