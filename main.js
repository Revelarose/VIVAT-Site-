let jsonData;

// Обработчик загрузки файла
document.getElementById('readFile').addEventListener("click", function() {
    const fileInput = document.getElementById('file');
    if (!fileInput || !fileInput.files[0]) {
        console.error('Файл не выбран');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const fileContent = e.target.result;
        if (file.type === "application/json") {
            try {
                jsonData = JSON.parse(fileContent);
                console.log('JSON data:', jsonData);
                processData(jsonData);
            } catch (err) {
                console.error('Ошибка при чтении JSON файла:', err);
            }
        } else if (file.type === "text/xml" || file.type === "application/xml") {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(fileContent, "text/xml");
                jsonData = parseXMLToJSON(xmlDoc);
                console.log('XML data (converted to JSON):', jsonData);
                processData(jsonData);
            } catch (err) {
                console.error('Ошибка при чтении XML файла:', err);
            }
        } else {
            console.error('Неподдерживаемый формат файла');
        }
    };

    reader.readAsText(file);
});

// Парсинг XML в JSON
function parseXMLToJSON(xmlDoc) {
    const rows = [];
    const items = xmlDoc.getElementsByTagName("item"); // Предположим, что элементы данных имеют тег <item>
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const row = {
            name: item.getElementsByTagName("name")[0]?.textContent || null,
            sku: item.getElementsByTagName("sku")[0]?.textContent || null,
            price: item.getElementsByTagName("price")[0]?.textContent || null,
            discount: item.getElementsByTagName("discount")[0]?.textContent || null,
        };
        rows.push(row);
    }
    return rows;
}

// Обработка данных
function processData(data) {
    if (!Array.isArray(data)) {
        console.error('Ожидался массив данных');
        return;
    }

    const errors = [];
    const corrections = [];

    data.forEach((row, index) => {
        if (!row.name) {
            errors.push(`Ошибка на строке ${index + 1}: отсутствует обязательное поле "Название".`);
        }
        if (!row.sku) {
            errors.push(`Ошибка на строке ${index + 1}: отсутствует обязательное поле "id".`);
        }
        if (!row.price) {
            errors.push(`Ошибка на строке ${index + 1}: отсутствует обязательное поле "Цена".`);
        }
        if (parseFloat(row.price) < 0) {
            errors.push(`Ошибка на строке ${index + 1}: цена не может быть ниже нуля.`);
            corrections.push(`Предложение для строки ${index + 1}: Установить цену на 10.`);
        }
        if (parseFloat(row.discount) < 0) {
            errors.push(`Ошибка на строке ${index + 1}: скидка не может быть ниже нуля.`);
            corrections.push(`Предложение для строки ${index + 1}: Установить скидку на 0.`);
        }
        if (parseFloat(row.discount) > 100) {
            errors.push(`Ошибка на строке ${index + 1}: скидка не может быть выше 100%.`);
            corrections.push(`Предложение для строки ${index + 1}: Установить скидку на 100%.`);
        }
    });

    displayErrors(errors);
    displayCorrections(corrections);
}

// Отображение ошибок
function displayErrors(errors) {
    const errorsDiv = document.getElementById('errors');
    if (!errorsDiv) {
        console.error('Элемент с ID "errors" не найден');
        return;
    }

    errorsDiv.innerHTML = '';
    errors.forEach(error => {
        const div = document.createElement('div');
        div.classList.add('error');
        div.textContent = error;
        errorsDiv.appendChild(div);
    });
}

// Отображение исправлений
function displayCorrections(corrections) {
    const correctionsDiv = document.getElementById('corrections');
    if (!correctionsDiv) {console.error('Элемент с ID "corrections" не найден');
        return;
    }

    correctionsDiv.innerHTML = '';
    corrections.forEach(correction => {
        const div = document.createElement('div');
        div.classList.add('correction');
        div.textContent = correction;
        correctionsDiv.appendChild(div);
    });
}