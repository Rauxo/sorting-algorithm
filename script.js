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

//Start Logics

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

function visualizeArray(array, highlights = [], pivotIndex = -1) {
  const container = document.getElementById("visualization");
  container.innerHTML = "";

  array.forEach((value, index) => {
    const box = document.createElement("div");
    box.className = "array-box box-normal";
    box.textContent = value;

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

// Sorting Algorithms

// Bubble Sort
async function bubbleSort(a) {
  let step = 1;
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      visualizeArray(a, [j, j + 1]);
      await sleep(animationSpeed);

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        showStep(
          `Swapped ${a[j + 1]} and ${a[j]} → ${formatArray(a, [j, j + 1])}`
        );
        visualizeArray(a, [j, j + 1]);
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
    visualizeArray(a, [i, min]);
    await sleep(animationSpeed);

    for (let j = i + 1; j < a.length; j++) {
      visualizeArray(a, [min, j]);
      await sleep(animationSpeed);

      if (a[j] < a[min]) {
        min = j;
        visualizeArray(a, [i, min]);
        await sleep(animationSpeed);
      }
    }

    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      showStep(`Swapped ${a[min]} and ${a[i]} → ${formatArray(a, [i, min])}`);
      visualizeArray(a, [i, min]);
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

    visualizeArray(a, [i, j]);
    await sleep(animationSpeed);

    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
      visualizeArray(a, [i, j + 1]);
      await sleep(animationSpeed);
    }

    a[j + 1] = key;
    showStep(
      `Inserted ${key} at position ${j + 1} → ${formatArray(a, [j + 1, i])}`
    );
    visualizeArray(a, [j + 1]);
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

  visualizeArray(a, [], high);
  await sleep(animationSpeed);

  for (let j = low; j < high; j++) {
    visualizeArray(a, [j, high]);
    await sleep(animationSpeed);

    if (a[j] < pivot) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      showStep(`Swapped ${a[j]} and ${a[i]} → ${formatArray(a, [i, j])}`);
      visualizeArray(a, [i, j]);
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
  visualizeArray(a, [i + 1, high]);
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
    visualizeArray(a, [k]);
    await sleep(animationSpeed);
    k++;
  }

  while (i < n1) {
    a[k] = L[i++];
    showStep(`Merging: ${formatArray(a, [k])}`);
    visualizeArray(a, [k]);
    await sleep(animationSpeed);
    k++;
  }

  while (j < n2) {
    a[k] = R[j++];
    showStep(`Merging: ${formatArray(a, [k])}`);
    visualizeArray(a, [k]);
    await sleep(animationSpeed);
    k++;
  }
}
