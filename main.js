document.addEventListener('DOMContentLoaded', function () {
    const productsContainer = document.querySelector('.all-collection');
    const collectionBtns = document.querySelectorAll('.collection-btn');
    let products = [];

    // Fetch and render products
    function fetchProducts(collectionId = 0) {
        let url = 'products.php';
        if (collectionId) url += '?collection_id=' + collectionId;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                products = data;
                renderProducts();
            });
    }

    // Render product cards
    function renderProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        if (products.length === 0) {
            productsContainer.innerHTML = '<p>No products found.</p>';
            return;
        }
        products.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'Products';
            card.innerHTML = `
                <img src="${prod.image}" alt="${prod.name}">
                <div class="text">
                    <h3>${prod.name}</h3>
                    <span>${prod.collection_name || ''}</span>
                    <p>${prod.description}</p>
                    <b>₦${Number(prod.price).toLocaleString()}</b>
                    <button class="add-to-cart-btn" data-name="${encodeURIComponent(prod.name)}">Add to Cart</button>
                </div>
            `;
            productsContainer.appendChild(card);
        });
    }

    // Collection filter
    collectionBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            collectionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (btn.textContent === 'All') {
                fetchProducts();
            } else {
                // Find collection id by name
                fetch('products.php')
                    .then(res => res.json())
                    .then(data => {
                        let btnName = btn.textContent;
                        const nameMap = {
                            'Body Spray': 'Body Spray',
                            'Perfume': 'Perfume',
                            'Roll On': 'Roll On',
                            'Perfume Oil': 'Perfume Oil',
                            'Combo': 'Combo'
                        };
                        const mappedName = nameMap[btnName] || btnName;
                        const prod = data.find(p => p.collection_name && p.collection_name.toLowerCase() === mappedName.toLowerCase());
                        if (prod) fetchProducts(prod.collection_id);
                        else productsContainer.innerHTML = '<p>No products found.</p>';
                    });
            }
        });
    });

    // WhatsApp Add to Cart
    productsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const prodName = decodeURIComponent(e.target.getAttribute('data-name'));
            const phone = '2349066733487'; // Nigeria country code + number
            const msg = encodeURIComponent(`Hello, I’m interested in buying ${prodName}. Is it available?`);
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
        }
    });

    // Smooth scroll on navbar click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Section animation on scroll
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show'); 
            }
        });
    }, { threshold: 0.2 }); 
    sections.forEach(section => {
        observer.observe(section);
    });

    fetchProducts();
});