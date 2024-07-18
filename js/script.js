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
                magnifyIcon.innerHTML = `<svg viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="7" fill="white"/>
                <path d="M12.5 6V5.5H12H10H9.5V6V9.5H6H5.5V10V12V12.5H6H9.5V16V16.5H10H12H12.5V16V12.5H16H16.5V12V10V9.5H16H12.5V6ZM11 18.5C6.86614 18.5 3.5 15.1339 3.5 11C3.5 6.86614 6.86614 3.5 11 3.5C15.1339 3.5 18.5 6.86614 18.5 11C18.5 15.1339 15.1339 18.5 11 18.5ZM11 0.5C9.62112 0.5 8.25574 0.771591 6.98182 1.29926C5.7079 1.82694 4.55039 2.60036 3.57538 3.57538C1.60625 5.54451 0.5 8.21523 0.5 11C0.5 13.7848 1.60625 16.4555 3.57538 18.4246C4.55039 19.3996 5.7079 20.1731 6.98182 20.7007C8.25574 21.2284 9.62112 21.5 11 21.5H19C19.663 21.5 20.2989 21.2366 20.7678 20.7678C21.2366 20.2989 21.5 19.663 21.5 19V11C21.5 9.62112 21.2284 8.25574 20.7007 6.98182C20.1731 5.7079 19.3996 4.55039 18.4246 3.57538C17.4496 2.60036 16.2921 1.82694 15.0182 1.29926C13.7443 0.771591 12.3789 0.5 11 0.5Z" fill="#131313" stroke="white"/>
                </svg>`;
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
