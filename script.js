
const produkNames = [
    "Apple iPhone 14 Clear Case", "Apple iPhone 14 Yellow", "Apple iPhone 13 Blue", 
    "Apple iPhone 13 Starlight", "Apple iPhone 13 Pink", "Apple iPhone 12 White", 
    "Apple iPhone 12 Black", "Apple iPhone 12 Purple", "Apple iPhone 15 Blue", 
    "Apple iPhone 15 Pink", "Apple iPhone 15 Black", "Apple iPhone 15 Green", 
    "Apple iPhone 15 Midnight", "Apple iPhone 15 White", "Apple AirPods", 
    "Apple Pencil 1st", "Apple iPad 9th", "Apple iPad 10th", "Apple Macbook Air", 
    "Apple iPad Air 11", "Apple iPad Pro m4", "Apple AirPods 3rd gen", 
    "Apple AirPods Pro 2nd gen"
];

let produkList = [];
let insertionSortData = [];
let quickSortData = [];

function tampilkanProduk(data) {
    const tableBody = document.getElementById("produkBody");
    tableBody.innerHTML = "";

    data.forEach(produk => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${produk.nama}</td><td>${produk.penjualan}</td>`;
        tableBody.appendChild(row);
    });
}

function generateAndCompare() {
    const jumlahProduk = parseInt(document.getElementById("jumlahProduk").value);
    if (isNaN(jumlahProduk) || jumlahProduk <= 0) {
        alert("Masukkan jumlah produk yang valid.");
        return;
    }

    produkList = [];
    for (let i = 0; i < jumlahProduk; i++) {
        const namaProduk = produkNames[Math.floor(Math.random() * produkNames.length)];
        const penjualan = Math.floor(Math.random() * 1000) + 1;
        produkList.push({ nama: namaProduk, penjualan: penjualan });
    }

    tampilkanProduk(produkList); 
}

function sortProduk(algorithm) {
    if (produkList.length === 0) {
        alert("Generate produk terlebih dahulu.");
        return;
    }

    let startTime, endTime, sortingTime;
    if (algorithm === 'insertion') {
        startTime = performance.now();
        insertionSort(produkList);
        endTime = performance.now();
        sortingTime = parseFloat((endTime - startTime).toFixed(2));

        insertionSortData.push({ x: produkList.length, y: sortingTime });
        HasilEksekusiTime(sortingTime, null);
    } else if (algorithm === 'quick') {
        startTime = performance.now();
        quickSort(produkList);
        endTime = performance.now();
        sortingTime = parseFloat((endTime - startTime).toFixed(2));

        quickSortData.push({ x: produkList.length, y: sortingTime });
        HasilEksekusiTime(null, sortingTime);
    }

    tampilkanProduk(produkList);
    updateChart();
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j].penjualan < key.penjualan) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j].penjualan > pivot.penjualan) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function updateChart() {
    if (chartData.labels.length === 0) {
        chartData.labels.push(0);
        insertionSortData.unshift({ x: 0, y: 0 });
        quickSortData.unshift({ x: 0, y: 0 });
    }

    chartData.labels.push(produkList.length);
    chartData.datasets[0].data = insertionSortData;
    chartData.datasets[1].data = quickSortData;

    efficiencyChart.update();
}

function HasilEksekusiTime(insertionSortTime, quickSortTime) {
    const executionTimesDiv = document.getElementById("executionTimes");
    const insertionSortTimeElem = document.getElementById("insertionSortTime");
    const quickSortTimeElem = document.getElementById("quickSortTime");

    if (insertionSortTime !== null) {
        insertionSortTimeElem.textContent = `Insertion Sort: ${insertionSortTime.toFixed(2)} ms`;
    }

    if (quickSortTime !== null) {
        quickSortTimeElem.textContent = `Quick Sort: ${quickSortTime.toFixed(2)} ms`;
    }

    executionTimesDiv.style.display = "block";
}

const chartData = {
    labels: [],
    datasets: [
        {
            label: 'Insertion Sort',
            data: [],
            borderColor: '#2980b9',
            backgroundColor: 'rgba(41, 128, 185, 0.2)',
            fill: false,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        },
        {
            label: 'Quick Sort',
            data: [],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231, 76, 60, 0.2)',
            fill: false,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }
    ]
};

const chartConfig = {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Ukuran Input (N)'
                },
                ticks: {
                    stepSize: 1
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Waktu Eksekusi (ms)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 3
            },
            point: {
                radius: 6,
                hoverRadius: 8,
                borderWidth: 2,
                borderColor: '#fff',
                backgroundColor: '#2980b9'
            }
        },
        responsive: true,
        layout: {
            padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            }
        }
    }
};

const ctx = document.getElementById('efficiencyChart').getContext('2d');
const efficiencyChart = new Chart(ctx, chartConfig);

function updateChart() {
    if (chartData.labels.length === 0) {
        chartData.labels.push(0);
        insertionSortData.unshift({ x: 0, y: 0 });
        quickSortData.unshift({ x: 0, y: 0 });
    }

    chartData.labels.push(produkList.length);
    chartData.datasets[0].data = insertionSortData;
    chartData.datasets[1].data = quickSortData;

    efficiencyChart.update();
}

function HasilEksekusiTime(insertionSortTime, quickSortTime) {
    const executionTimesDiv = document.getElementById("executionTimes");
    const insertionSortTimeElem = document.getElementById("insertionSortTime");
    const quickSortTimeElem = document.getElementById("quickSortTime");

    if (insertionSortTime !== null) {
        insertionSortTimeElem.textContent = `Insertion Sort: ${insertionSortTime.toFixed(2)} ms`;
    }

    if (quickSortTime !== null) {
        quickSortTimeElem.textContent = `Quick Sort: ${quickSortTime.toFixed(2)} ms`;
    }

    executionTimesDiv.style.display = "block";
}
