document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spin-button');
    const resetButton = document.getElementById('reset-button');
    const wheel = document.getElementById('wheel');
    const popup = document.getElementById('popup');
    const popupImage = document.getElementById('popup-image');
    const popupText = document.getElementById('popup-text');
    const closeButton = document.getElementById('close-button');
    const historyContainer = document.getElementById('history');
    const wheelIndicator = document.getElementById('wheel-indicator');

    let isSpinning = false;
    const segments = 20;  // Fixed number of segments
    const segmentDegrees = 360 / segments;
    let availableNumbers = JSON.parse(localStorage.getItem('availableNumbers')) || Array.from({ length: segments }, (_, i) => i + 1);
    let history = JSON.parse(localStorage.getItem('history')) || [];

    // Generate wheel segments
    function generateWheelSegments() {
        wheel.innerHTML = '';  // Clear existing segments
        for (let i = 0; i < segments; i++) {
            let segment = document.createElement('div');
            segment.className = 'segment';
            segment.style.transform = `rotate(${i * segmentDegrees}deg)`;
            segment.style.background = `conic-gradient(from ${i * segmentDegrees}deg, rgba(0, 255, 255, 0.1) 0deg, rgba(0, 255, 255, 0.1) ${segmentDegrees}deg)`;
            segment.innerText = i + 1;
            wheel.appendChild(segment);
        }
    }
    
    generateWheelSegments();

    function updateLocalStorage() {
        localStorage.setItem('availableNumbers', JSON.stringify(availableNumbers));
        localStorage.setItem('history', JSON.stringify(history));
    }

    spinButton.addEventListener('click', () => {
        if (isSpinning || availableNumbers.length === 0) return;
        isSpinning = true;

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const selectedNumber = availableNumbers[randomIndex];
        availableNumbers.splice(randomIndex, 1); // Remove selected number
        const rotation = selectedNumber * segmentDegrees + 3600; // 3600 degrees ensures multiple full spins
        wheel.style.transition = 'transform 3s ease-out';
        wheel.style.transform = `rotate(${rotation}deg)`;

        setTimeout(() => {
            isSpinning = false;
            popup.style.display = 'block';
            popupImage.src = `static/images/${selectedNumber}.png`;
            popupText.textContent = `Number: ${selectedNumber}`;

            // Add to history
            history.push(selectedNumber);
            updateHistory();
            updateLocalStorage();
        }, 3000); // Match with the spinning duration
    });

    resetButton.addEventListener('click', () => {
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';
        popup.style.display = 'none';
        availableNumbers = Array.from({ length: segments }, (_, i) => i + 1); // Reset available numbers
        history = [];  // Clear history
        updateHistory(); // Update history display
        updateLocalStorage();
    });

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    function updateHistory() {
        historyContainer.innerHTML = '';
        history.forEach(num => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.textContent = `Number: ${num}`;
            historyContainer.appendChild(item);
        });
    }

    // Initial call to populate the history
    updateHistory();
});
