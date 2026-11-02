/* =========================================
   SWEET CRUMBS BAKERY
   PART 3 JAVASCRIPT ENHANCEMENTS
========================================= */

'use strict';


/* =========================================
   1. DYNAMIC PRODUCT CATEGORIES
========================================= */

const productList = document.querySelector('#product-list');

if (productList) {

    const products = [
        {
            name: 'Cakes',
            image: 'images/Birthday Cakes.jpeg',
            alt: 'Birthday and customised cakes',
            description: 'Birthday, celebration, wedding and custom cakes.',
            search: 'cakes birthday celebration wedding custom',
            link: 'gallery.html#cakes'
        },
        {
            name: 'Bread & Pastries',
            image: 'images/Fresh bread and pastries.jpeg',
            alt: 'Freshly baked bread and pastries',
            description: 'Fresh bread, croissants, pastries and other baked goods.',
            search: 'bread pastries croissants white brown garlic challah',
            link: 'gallery.html#bread'
        },
        {
            name: 'Cupcakes & Treats',
            image: 'images/Cupcakes.jpeg',
            alt: 'Cupcakes and sweet bakery treats',
            description: 'Cupcakes, cookies, brownies and delicious bakery treats.',
            search: 'cupcakes treats cookies brownies doughnuts',
            link: 'gallery.html#cupcakes'
        }
    ];

    productList.innerHTML = products.map(product => `
        <div class="product-category searchable-product"
             data-search="${product.search}">

            <img src="${product.image}" alt="${product.alt}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <a href="${product.link}" class="button">View</a>

        </div>
    `).join('');

}


/* =========================================
   2. PRODUCT SEARCH
========================================= */

const productSearch = document.querySelector('#product-search-input');

if (productSearch) {

    const cards = [...document.querySelectorAll('.searchable-product')];
    const status = document.querySelector('#product-search-status');
    const emptyMessage = document.querySelector('#no-products-message');

    productSearch.addEventListener('input', () => {

        const term = productSearch.value.trim().toLowerCase();
        let visible = 0;

        cards.forEach(card => {

            const matches =
                `${card.textContent} ${card.dataset.search || ''}`
                .toLowerCase()
                .includes(term);

            card.hidden = !matches;

            if (matches) visible++;

        });

        if (emptyMessage) {
            emptyMessage.hidden = visible !== 0;
        }

        if (status) {
            status.textContent =
                `${visible} product categor${visible === 1 ? 'y' : 'ies'} found.`;
        }

    });

}


/* =========================================
   3. GALLERY SEARCH
========================================= */

const gallerySearch = document.querySelector('#gallery-search-input');

if (gallerySearch) {

    const categories =
        [...document.querySelectorAll('.gallery-category')];

    const status =
        document.querySelector('#gallery-search-status');

    gallerySearch.addEventListener('input', () => {

        const term = gallerySearch.value.trim().toLowerCase();
        let visible = 0;

        categories.forEach(category => {

            const items =
                [...category.querySelectorAll('.gallery-item')];

            let categoryVisible = 0;

            items.forEach(item => {

                const image = item.querySelector('img');

                const searchableText =
                    `${item.textContent} ${image?.alt || ''}`
                    .toLowerCase();

                const matches = searchableText.includes(term);

                item.hidden = !matches;

                if (matches) {
                    visible++;
                    categoryVisible++;
                }

            });

            category.hidden = categoryVisible === 0;

        });

        if (status) {
            status.textContent =
                `${visible} gallery image${visible === 1 ? '' : 's'} found.`;
        }

    });

}


/* =========================================
   4. ACCESSIBLE GALLERY LIGHTBOX
========================================= */

const lightbox = document.querySelector('#image-lightbox');

if (lightbox) {

    const largeImage = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');

    let previousFocus = null;

    const closeLightbox = () => {

        lightbox.hidden = true;
        largeImage.src = '';

        if (previousFocus) {
            previousFocus.focus();
        }

    };

    document.querySelectorAll('.lightbox-image').forEach(image => {

        image.tabIndex = 0;

        image.setAttribute('role', 'button');

        image.setAttribute(
            'aria-label',
            `Enlarge ${image.alt || 'gallery image'}`
        );

        const openLightbox = () => {

            previousFocus = image;

            largeImage.src = image.src;
            largeImage.alt = image.alt;

            caption.textContent = image.alt;

            lightbox.hidden = false;

            closeButton.focus();

        };

        image.addEventListener('click', openLightbox);

        image.addEventListener('keydown', event => {

            if (event.key === 'Enter' || event.key === ' ') {

                event.preventDefault();

                openLightbox();

            }

        });

    });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', event => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    document.addEventListener('keydown', event => {

        if (event.key === 'Escape' && !lightbox.hidden) {
            closeLightbox();
        }

    });

}


/* =========================================
   5. SHARED FORM VALIDATION
========================================= */

function showFormError(form, message) {

    const status = form.querySelector('.form-status');

    if (status) {

        status.textContent = message;
        status.classList.add('error-message');

    }

}


function clearFormError(form) {

    const status = form.querySelector('.form-status');

    if (status) {

        status.textContent = '';
        status.classList.remove('error-message');

    }

}


function validForm(form) {

    clearFormError(form);

    const invalid = [
        ...form.querySelectorAll('input, select, textarea')
    ].find(field => !field.checkValidity());

    if (invalid) {

        invalid.focus();
        invalid.reportValidity();

        showFormError(
            form,
            'Please complete the highlighted field correctly.'
        );

        return false;

    }

    return true;

}


/* =========================================
   6. BAKERY EMAIL ADDRESS
========================================= */

const bakeryEmail = 'sweetcrumbsbakery@gmail.com';


/* =========================================
   7. ORDER FORM - AJAX SUBMISSION
========================================= */

const orderForm = document.querySelector('#order-form');

if (orderForm) {
    orderForm.addEventListener('submit', async event => {
        event.preventDefault();

        if (!validForm(orderForm)) return;

        const status = orderForm.querySelector('.form-status');
        const submitButton = orderForm.querySelector('[type="submit"]');

        const data = new FormData(orderForm);
        const formData = Object.fromEntries(data.entries());

        formData._subject = 'Sweet Crumbs Bakery - Order Enquiry';

        if (status) {
            status.textContent = 'Sending your order enquiry...';
        }

        if (submitButton) submitButton.disabled = true;

        try {
            const response = await fetch(
                'https://formsubmit.co/ajax/mohlalakgopotso442@gmail.com',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.json();

            if (!response.ok || result.success !== 'true') {
                throw new Error('Order submission failed.');
            }

            if (status) {
                status.textContent =
                    'Thank you! Your order enquiry has been submitted successfully.';
            }

            orderForm.reset();

        } catch (error) {
            if (status) {
                status.textContent =
                    'Sorry, your order could not be sent. Please try again.';
            }

            console.error('Order form error:', error);

        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}


/* =========================================
   8. CONTACT FORM - AJAX SUBMISSION
========================================= */

const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        if (!validForm(contactForm)) return;

        const status = contactForm.querySelector('.form-status');
        const submitButton = contactForm.querySelector('[type="submit"]');

        const data = new FormData(contactForm);
        const formData = Object.fromEntries(data.entries());

        formData._subject =
            `Sweet Crumbs Bakery - ${formData.subject}`;

        if (status) {
            status.textContent = 'Sending your message...';
        }

        if (submitButton) submitButton.disabled = true;

        try {
            const response = await fetch(
                'https://formsubmit.co/ajax/mohlalakgopotso442@gmail.com',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            );

            const result = await response.json();

            if (!response.ok || result.success !== 'true') {
                throw new Error('Message submission failed.');
            }

            if (status) {
                status.textContent =
                    'Thank you! Your message has been sent successfully.';
            }

            contactForm.reset();

        } catch (error) {
            if (status) {
                status.textContent =
                    'Sorry, your message could not be sent. Please try again.';
            }

            console.error('Contact form error:', error);

        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}
/* =========================================
   9. ACCORDION FUNCTIONALITY
========================================= */

document.querySelectorAll('[data-accordion]').forEach(button => {

    button.addEventListener('click', () => {

        const panel = document.getElementById(
            button.getAttribute('aria-controls')
        );

        const expanded =
            button.getAttribute('aria-expanded') === 'true';

        button.setAttribute(
            'aria-expanded',
            String(!expanded)
        );

        if (panel) {
            panel.hidden = expanded;
        }

    });

});


/* =========================================
   10. GALLERY CATEGORY FILTERING
========================================= */

const selectedCategory = window.location.hash.substring(1);

if (selectedCategory) {

    const galleryCategories =
        document.querySelectorAll('.gallery-category');

    galleryCategories.forEach(category => {

        category.hidden = category.id !== selectedCategory;

    });

}