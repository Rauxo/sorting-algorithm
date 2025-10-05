// Tailwind CSS Configuration
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#1e293b",
        accent: "#f59e0b",
        dark: "#0f172a",
        light: "#f8fafc",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};

// Global variables
let arr = [];
let animationSpeed = 300;
let isSorting = false;
let currentStep = 0;

function setArray() {
  if (isSorting) return;

  let input = document.getElementById("arrayInput").value;
  if (!input.trim()) {
    alert("Please enter some numbers separated by commas");
    return;
  }

  arr = input.split(",").map((num) => {
    const trimmed = num.trim();
    const parsed = Number(trimmed);
    return isNaN(parsed) ? 0 : parsed;
  });

  // Validate array
  if (arr.length < 2) {
    alert("Please enter at least 2 numbers");
    return;
  }

  if (arr.length > 12) {
    alert("For better visualization, please enter at most 12 numbers");
    arr = arr.slice(0, 12);
  }

  document.getElementById("algoSection").classList.remove("hidden");
  document.getElementById("steps").innerHTML = "";
  currentStep = 0;

  showStep("Initial Array: " + formatArray(arr));
  visualizeArray(arr);
}

function generateRandomArray() {
  if (isSorting) return;

  const size = Math.floor(Math.random() * 8) + 5; // 5 to 12 numbers
  arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * 50) + 1); // 1 to 50
  }

  document.getElementById("arrayInput").value = arr.join(", ");
  document.getElementById("algoSection").classList.remove("hidden");
  document.getElementById("steps").innerHTML = "";
  currentStep = 0;

  showStep("Initial Array: " + formatArray(arr));
  visualizeArray(arr);
}

function visualizeArray(array, highlights = [], pivotIndex = -1, arrow = null) {
  const container = document.getElementById("visualization");
  container.innerHTML = "";

  // Clear any existing arrows
  const existingArrows = document.querySelectorAll('.arrow, .arrow-label');
  existingArrows.forEach(el => el.remove());

  array.forEach((value, index) => {
    const box = document.createElement("div");
    box.className = "array-box box-normal";
    box.textContent = value;
    box.id = `box-${index}`;

    // Apply highlight classes if needed
    if (highlights.includes(index)) {
      if (pivotIndex === index) {
        box.classList.remove("box-normal");
        box.classList.add("box-pivot");
      } else if (highlights.length === 2 && highlights[0] === index) {
        box.classList.remove("box-normal");
        box.classList.add("box-compare");
      } else {
        box.classList.remove("box-normal");
        box.classList.add("box-swap");
      }
    }

    container.appendChild(box);
  });

  // Draw arrow if specified
  if (arrow) {
    drawArrow(arrow.from, arrow.to, arrow.label);
  }
}

function drawArrow(fromIndex, toIndex, label) {
  const fromBox = document.getElementById(`box-${fromIndex}`);
  const toBox = document.getElementById(`box-${toIndex}`);
  const container = document.getElementById("visualization");
  
  if (!fromBox || !toBox) return;

  const fromRect = fromBox.getBoundingClientRect();
  const toRect = toBox.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const fromCenterX = fromRect.left + fromRect.width / 2 - containerRect.left;
  const fromCenterY = fromRect.top + fromRect.height / 2 - containerRect.top;
  const toCenterX = toRect.left + toRect.width / 2 - containerRect.left;
  const toCenterY = toRect.top + toRect.height / 2 - containerRect.top;

  // Calculate distance and angle
  const distance = Math.sqrt(Math.pow(toCenterX - fromCenterX, 2) + Math.pow(toCenterY - fromCenterY, 2));
  const angle = Math.atan2(toCenterY - fromCenterY, toCenterX - fromCenterX) * 180 / Math.PI;

  // Create arrow
  const arrow = document.createElement("div");
  arrow.className = "arrow arrow-animate";
  arrow.style.width = `${distance}px`;
  arrow.style.left = `${fromCenterX}px`;
  arrow.style.top = `${fromCenterY}px`;
  arrow.style.transform = `rotate(${angle}deg)`;
  arrow.style.transformOrigin = "left center";
  arrow.style.setProperty('--arrow-width', `${distance}px`);
  
  container.appendChild(arrow);

  // Create label
  const labelEl = document.createElement("div");
  labelEl.className = "arrow-label";
  labelEl.textContent = label;
  labelEl.style.left = `${(fromCenterX + toCenterX) / 2 - 20}px`;
  labelEl.style.top = `${(fromCenterY + toCenterY) / 2 - 20}px`;
  
  container.appendChild(labelEl);
}

function showStep(text) {
  let stepsDiv = document.getElementById("steps");
  let div = document.createElement("div");
  div.className = "step-card p-3 rounded step-enter";
  div.innerHTML = `<span class="font-medium text-primary">Step ${++currentStep}:</span> ${text}`;
  stepsDiv.appendChild(div);
  setTimeout(() => div.classList.add("step-enter-active"), 10);
  stepsDiv.scrollTop = stepsDiv.scrollHeight;
}

function formatArray(array, highlight = []) {
  return array
    .map((val, i) =>
      highlight.includes(i)
        ? `<span class="text-red-600 font-bold">${val}</span>`
        : val
    )
    .join(", ");
}

async function startSort() {
  if (isSorting) return;

  isSorting = true;
  animationSpeed = parseInt(document.getElementById("speedSlider").value);
  document.getElementById("steps").innerHTML = "";
  currentStep = 0;
  showStep("Initial Array: " + formatArray(arr));

  let algo = document.getElementById("algoSelect").value;
  let copy = [...arr];

  // Disable controls during sorting
  document.querySelectorAll("button, input, select").forEach((el) => {
    if (!el.id.includes("speedSlider")) {
      el.disabled = true;
    }
  });

  if (algo === "bubble") await bubbleSort(copy);
  if (algo === "selection") await selectionSort(copy);
  if (algo === "insertion") await insertionSort(copy);
  if (algo === "quick") await quickSort(copy, 0, copy.length - 1);
  if (algo === "merge") await mergeSort(copy, 0, copy.length - 1);

  showStep("✅ Sorting completed! Final sorted array: " + formatArray(copy));

  // Mark all as sorted
  const sortedBoxes = document.querySelectorAll(".array-box");
  sortedBoxes.forEach((box) => {
    box.classList.remove("box-normal", "box-compare", "box-swap", "box-pivot");
    box.classList.add("box-sorted");
  });

  // Re-enable controls
  document.querySelectorAll("button, input, select").forEach((el) => {
    el.disabled = false;
  });

  isSorting = false;
}

function resetVisualization() {
  if (isSorting) return;

  document.getElementById("steps").innerHTML = "";
  document.getElementById("arrayInput").value = "";
  document.getElementById("algoSection").classList.add("hidden");
  document.getElementById("visualization").innerHTML =
    '<p class="text-gray-500 text-lg">Enter numbers and click "Set Array" to start visualization</p>';
  arr = [];
  currentStep = 0;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Update speed display
document.getElementById("speedSlider").addEventListener("input", function () {
  animationSpeed = this.value;
  document.getElementById("speedValue").textContent = `${animationSpeed} ms`;
});

// Modal functionality
document.getElementById("infoBtn").addEventListener("click", function () {
  document.getElementById("infoModal").classList.remove("hidden");
  // Scroll to top when modal opens
  document.querySelector('.rectangle-modal').scrollTop = 0;
});

document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("infoModal").classList.add("hidden");
});

// Close modal when clicking outside
document.getElementById("infoModal").addEventListener("click", function (e) {
  if (e.target === this) {
    this.classList.add("hidden");
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.getElementById("infoModal").classList.add("hidden");
  }
});
// Sorting Algorithms

// Bubble Sort
async function bubbleSort(a) {
  let step = 1;
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      visualizeArray(a, [j, j + 1], -1, { from: j, to: j + 1, label: "Compare" });
      await sleep(animationSpeed);

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        showStep(
          `Swapped ${a[j + 1]} and ${a[j]} → ${formatArray(a, [j, j + 1])}`
        );
        visualizeArray(a, [j, j + 1], -1, { from: j, to: j + 1, label: "Swap" });
        await sleep(animationSpeed);
      } else {
        showStep(`Compared ${a[j]} and ${a[j + 1]} - no swap needed`);
      }
    }
  }
}

// Selection Sort
async function selectionSort(a) {
  let step = 1;
  for (let i = 0; i < a.length; i++) {
    let min = i;
    visualizeArray(a, [i, min], -1, { from: i, to: min, label: "Current min" });
    await sleep(animationSpeed);

    for (let j = i + 1; j < a.length; j++) {
      visualizeArray(a, [min, j], -1, { from: min, to: j, label: "Compare" });
      await sleep(animationSpeed);

      if (a[j] < a[min]) {
        min = j;
        visualizeArray(a, [i, min], -1, { from: i, to: min, label: "New min" });
        await sleep(animationSpeed);
      }
    }

    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      showStep(`Swapped ${a[min]} and ${a[i]} → ${formatArray(a, [i, min])}`);
      visualizeArray(a, [i, min], -1, { from: i, to: min, label: "Swap" });
      await sleep(animationSpeed);
    } else {
      showStep(`Element ${a[i]} is already in correct position`);
    }
  }
}

// Insertion Sort
async function insertionSort(a) {
  let step = 1;
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;

    visualizeArray(a, [i, j], -1, { from: i, to: j, label: "Compare" });
    await sleep(animationSpeed);

    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
      visualizeArray(a, [i, j + 1], -1, { from: i, to: j + 1, label: "Shift" });
      await sleep(animationSpeed);
    }

    a[j + 1] = key;
    showStep(
      `Inserted ${key} at position ${j + 1} → ${formatArray(a, [j + 1, i])}`
    );
    visualizeArray(a, [j + 1], -1, { from: i, to: j + 1, label: "Insert" });
    await sleep(animationSpeed);
  }
}

// Quick Sort
async function quickSort(a, low, high) {
  if (low < high) {
    let pi = await partition(a, low, high);
    await quickSort(a, low, pi - 1);
    await quickSort(a, pi + 1, high);
  }
}

async function partition(a, low, high) {
  let pivot = a[high];
  let i = low - 1;

  visualizeArray(a, [], high, { from: high, to: high, label: "Pivot" });
  await sleep(animationSpeed);

  for (let j = low; j < high; j++) {
    visualizeArray(a, [j, high], high, { from: j, to: high, label: "Compare" });
    await sleep(animationSpeed);

    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      showStep(`Swapped ${a[j]} and ${a[i]} → ${formatArray(a, [i, j])}`);
      visualizeArray(a, [i, j], high, { from: i, to: j, label: "Swap" });
      await sleep(animationSpeed);
    }
  }

  [a[i + 1], a[high]] = [a[high], a[i + 1]];
  showStep(
    `Placed pivot ${pivot} at position ${i + 1} → ${formatArray(a, [
      i + 1,
      high,
    ])}`
  );
  visualizeArray(a, [i + 1, high], -1, { from: high, to: i + 1, label: "Place pivot" });
  await sleep(animationSpeed);

  return i + 1;
}

// Merge Sort
async function mergeSort(a, l, r) {
  if (l >= r) return;
  let m = Math.floor((l + r) / 2);
  await mergeSort(a, l, m);
  await mergeSort(a, m + 1, r);
  await merge(a, l, m, r);
}

async function merge(a, l, m, r) {
  let n1 = m - l + 1,
    n2 = r - m;
  let L = a.slice(l, m + 1),
    R = a.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      a[k] = L[i++];
    } else {
      a[k] = R[j++];
    }

    showStep(`Merging: ${formatArray(a, [k])}`);
    visualizeArray(a, [k], -1, { from: k, to: k, label: "Merge" });
    await sleep(animationSpeed);
    k++;
  }

  while (i < n1) {
    a[k] = L[i++];
    showStep(`Merging: ${formatArray(a, [k])}`);
    visualizeArray(a, [k], -1, { from: k, to: k, label: "Merge" });
    await sleep(animationSpeed);
    k++;
  }

  while (j < n2) {
    a[k] = R[j++];
    showStep(`Merging: ${formatArray(a, [k])}`);
    visualizeArray(a, [k], -1, { from: k, to: k, label: "Merge" });
    await sleep(animationSpeed);
    k++;
  }
}