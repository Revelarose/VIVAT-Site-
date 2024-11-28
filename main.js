let jsonData;
document.getElementById('readFile').addEventListener("click",function(){
    let file = document.getElementById('file').files[0];
    let reader = new FileReader();
    reader.onload = function(e) {
        jsonData = JSON.parse(e.target.result);
        console.log(jsonData);
        processData(jsonData);
    }
    reader.readAsText(file);
    

});

// Обработка данных (поиск ошибок)
function processData(data) {
    const errors = [];
    const corrections = [];

    // Пример проверки на отсутствие обязательных полей
    data.forEach((row, index) => {
        if (!row.name) {
            errors.push(`Ошибка на строке ${index + 1}: отсутствует обязательное поле "Название".`);
        }
        if (!row.sku) {
            errors.push(`Ошибка на строке ${index + 1}: отсутствует обязательное поле "id`);
        }
        if (!row.price) {
            errors.push(`Ошибка на строке ${index + 1}: отсутствует обязательное поле "Цена`);
        }

        // Пример логической ошибки
        if (parseFloat(row.price) < 0) {
            errors.push(`Ошибка на строке ${index + 1}: цена не может быть ниже нуля`);
            corrections.push(`Предложение для строки ${index + 1}: Установить цену на 10.`);
        }
        if (parseFloat(row.discount) < 0) {
            errors.push(`Ошибка на строке ${index + 1}: скидка не может быть ниже нуля`);
            corrections.push(`Предложение для строки ${index + 1}: Установить скидку на 0.`);
        }
        if (parseFloat(row.discount) > 100) {
            errors.push(`Ошибка на строке ${index + 1}: скидка не может быть выше 100%`);
            corrections.push(`Предложение для строки ${index + 1}: Установить скидку на 100%.`);
        }
        
        
    });
    displayErrors(errors);
    displayCorrections(corrections);
    document.getElementById('download-corrections').style.display = 'inline-block';
    document.getElementById('download-report').style.display = 'inline-block';
}
function displayErrors(errors) {
    const errorsDiv = document.getElementById('errors');
    errorsDiv.innerHTML = '';
    errors.forEach(error => {
        const div = document.createElement('div');
        div.classList.add('error');
        div.textContent = error;
        errorsDiv.appendChild(div);
    });
}

function displayCorrections(corrections) {
    const correctionsDiv = document.getElementById('corrections');
    correctionsDiv.innerHTML = '';
    corrections.forEach(correction => {
        const div = document.createElement('div');
        div.classList.add('correction');
        div.textContent = correction;
        correctionsDiv.appendChild(div);
    });
}

document.getElementById("correctFile").addEventListener('click',function()
{
    fixData(jsonData);
});
