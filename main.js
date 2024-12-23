const productContainer = document.getElementById('product-container');

const TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const CHAT_ID = 'YOUR_CHAT_ID';

async function fetchProducts() {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    const products = response.data.products;

    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'bg-white p-4 rounded-lg shadow-md';
      productCard.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-48 object-cover mb-4 rounded-lg">
        <h2 class="text-lg font-bold">${product.title}</h2>
        <p class="text-gray-500 text-sm mb-2">${product.description.substring(0, 100)}...</p>
        <p class="text-green-600 font-bold text-xl mb-4">$${product.price}</p>
        <button class="sell-button bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600" data-id="${product.id}">Sell</button>
      `;
      productContainer.appendChild(productCard);
    });

    document.querySelectorAll('.sell-button').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.dataset.id;
        const product = products.find(p => p.id == productId);

        await sendToTelegram(product);
      });
    });

  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

async function sendToTelegram(product) {
  const message = `Product Sold!\n\nName: ${product.title}\nPrice: $${product.price}\nDescription: ${product.description}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message
    });
    alert('Product sent to Telegram!');
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    alert('Failed to send product to Telegram.');
  }
}

fetchProducts();
