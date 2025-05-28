// Initialize Swiper
const swiper = new Swiper('.swiper', {
    slidesPerView: 2, // По умолчанию 2 слайда
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        375: { // Применяется для ширины 768px и больше
            slidesPerView: 1,
            spaceBetween: 20,
        },
        1024: { // Применяется для ширины 1024px и больше
            slidesPerView: 2,
            spaceBetween: 30,
        },
    },
});

function sendToGoogleSheet(data) {
  fetch("https://script.google.com/macros/s/AKfycbz375sfkFIwW4Xzosr4OUmRItPiroOpg6FL6Kq1W62ozBUrfRH5zINhLBQfG4gyrAdCgA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

/// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    // Проверка капчи
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        alert("Пожалуйста, подтвердите, что вы не робот.");
        return;
    }

    // Валидация имени (только буквы и пробелы)
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]+$/;
    if (!nameRegex.test(name)) {
        alert('Пожалуйста, введите имя, используя только буквы и пробелы.');
        return;
    }

    // Валидация телефона (только цифры, пробелы, +, -, и скобки)
    const phoneRegex = /^[\d\s+()-]+$/;
    if (!phoneRegex.test(phone)) {
        alert('Пожалуйста, введите телефон, используя только цифры, пробелы, +, -, и скобки.');
        return;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Пожалуйста, введите корректный email.');
        return;
    }

    // Если валидация прошла, формируем сообщение
    const message = `Новая заявка:\nИмя: ${name}\nТелефон: ${phone}\nEmail: ${email}`;

    // Placeholder for Telegram bot integration
    sendToTelegramBot(message);

    // Отправка в Google Таблиц
    sendToGoogleSheet({ name, email, phone });

    // Показываем красивое сообщение
    const successAlert = document.getElementById('formSuccess');
    successAlert.classList.remove('d-none');

    // Скрываем через 5 секунд
    setTimeout(() => {
        successAlert.classList.add('d-none');
    }, 5000);

    this.reset();
});


function sendToTelegramBot(message) {
    // Replace with your Telegram bot token and chat ID
    const botToken = '7753537530:AAFfQoLPqVkqV22s0RrhFbLGDy-cRN5kPxw';
    const chatId = '623693240';
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Example fetch request (uncomment and configure to use)
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
    .then(response => response.json())
    .then(data => console.log('Message sent:', data))
    .catch(error => console.error('Error:', error));
   
    console.log('Message to send to Telegram:', message);
}