let arr = [];

function setArray() {
  let input = document.getElementById("arrayInput").value;
  arr = input.split(",").map(Number);
  document.getElementById("algoSection").style.display = "block";
  document.getElementById("steps").innerHTML = "";
  showStep("Initial Array: " + formatArray(arr));
}

function showStep(text) {
  let stepsDiv = document.getElementById("steps");
  let div = document.createElement("div");
  div.className = "step";
  div.innerHTML = text;
  stepsDiv.appendChild(div);
}

function formatArray(array, highlight=[]) {
  return array.map((val, i) => 
    highlight.includes(i) ? `<span class="changed">${val}</span>` : val
  ).join(", ");
}

async function startSort() {
  document.getElementById("steps").innerHTML = "";
  showStep("Initial Array: " + formatArray(arr));
  
  let algo = document.getElementById("algoSelect").value;
  let copy = [...arr];

  if (algo === "bubble") await bubbleSort(copy);
  if (algo === "selection") await selectionSort(copy);
  if (algo === "insertion") await insertionSort(copy);
  if (algo === "quick") await quickSort(copy, 0, copy.length-1);
  if (algo === "merge") await mergeSort(copy, 0, copy.length-1);

  showStep("Sorted Array: " + formatArray(copy));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort(a) {
  let step = 1;
  for (let i=0; i<a.length-1; i++) {
    for (let j=0; j<a.length-i-1; j++) {
      if (a[j] > a[j+1]) {
        [a[j], a[j+1]] = [a[j+1], a[j]];
        showStep(`Step ${step++}: ${formatArray(a,[j,j+1])}`);
        await sleep(300);
      }
    }
  }
}

// Selection Sort
async function selectionSort(a) {
  let step = 1;
  for (let i=0; i<a.length; i++) {
    let min=i;
    for (let j=i+1; j<a.length; j++) {
      if (a[j] < a[min]) min=j;
    }
    if (min!==i) {
      [a[i], a[min]] = [a[min], a[i]];
      showStep(`Step ${step++}: ${formatArray(a,[i,min])}`);
      await sleep(300);
    }
  }
}

// Insertion Sort
async function insertionSort(a) {
  let step = 1;
  for (let i=1; i<a.length; i++) {
    let key=a[i], j=i-1;
    while (j>=0 && a[j]>key) {
      a[j+1]=a[j];
      j--;
    }
    a[j+1]=key;
    showStep(`Step ${step++}: ${formatArray(a,[j+1,i])}`);
    await sleep(300);
  }
}

// Quick Sort
async function quickSort(a, low, high) {
  if (low<high) {
    let pi = await partition(a,low,high);
    await quickSort(a,low,pi-1);
    await quickSort(a,pi+1,high);
  }
}
async function partition(a,low,high) {
  let pivot=a[high], i=low-1;
  for (let j=low; j<high; j++) {
    if (a[j]<pivot) {
      i++;
      [a[i],a[j]]=[a[j],a[i]];
      showStep(`Partition: ${formatArray(a,[i,j])}`);
      await sleep(300);
    }
  }
  [a[i+1],a[high]]=[a[high],a[i+1]];
  showStep(`Pivot Swap: ${formatArray(a,[i+1,high])}`);
  await sleep(300);
  return i+1;
}

// Merge Sort
async function mergeSort(a,l,r){
  if (l>=r) return;
  let m=Math.floor((l+r)/2);
  await mergeSort(a,l,m);
  await mergeSort(a,m+1,r);
  await merge(a,l,m,r);
}
async function merge(a,l,m,r){
  let n1=m-l+1, n2=r-m;
  let L=a.slice(l,m+1), R=a.slice(m+1,r+1);
  let i=0,j=0,k=l;
  while(i<n1 && j<n2){
    if(L[i]<=R[j]) a[k]=L[i++];
    else a[k]=R[j++];
    showStep(`Merge: ${formatArray(a,[k])}`);
    await sleep(300);
    k++;
  }
  while(i<n1){ a[k]=L[i++]; showStep(`Merge: ${formatArray(a,[k-1])}`); await sleep(300);}
  while(j<n2){ a[k]=R[j++]; showStep(`Merge: ${formatArray(a,[k-1])}`); await sleep(300);}
}
