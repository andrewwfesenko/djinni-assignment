/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
	'use strict'

	const storedTheme = localStorage.getItem('theme')

	const getPreferredTheme = () => {
		if (storedTheme) {
			return storedTheme
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}

	const setTheme = function (theme) {
		if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.setAttribute('data-bs-theme', 'dark')
		} else {
			document.documentElement.setAttribute('data-bs-theme', theme)
		}
	}

	setTheme(getPreferredTheme())

	const showActiveTheme = (theme, focus = false) => {
		const themeSwitcher = document.querySelector('#bd-theme')

		if (!themeSwitcher) {
			return
		}

		const themeSwitcherText = document.querySelector('#bd-theme-text')
		const activeThemeIcon = document.querySelector('.theme-icon-active use')
		const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
		const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

		document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
			element.classList.remove('active')
			element.setAttribute('aria-pressed', 'false')
		})

		btnToActive.classList.add('active')
		btnToActive.setAttribute('aria-pressed', 'true')
		activeThemeIcon.setAttribute('href', svgOfActiveBtn)
		const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
		themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

		if (focus) {
			themeSwitcher.focus()
		}
	}

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (storedTheme !== 'light' || storedTheme !== 'dark') {
			setTheme(getPreferredTheme())
		}
	})

	window.addEventListener('DOMContentLoaded', () => {
		showActiveTheme(getPreferredTheme())

		document.querySelectorAll('[data-bs-theme-value]')
			.forEach(toggle => {
				toggle.addEventListener('click', () => {
					const theme = toggle.getAttribute('data-bs-theme-value')
					localStorage.setItem('theme', theme)
					setTheme(theme)
					showActiveTheme(theme, true)
				})
			})
	})
})()

function fetchNewPhotos() {
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', 'https://picsum.photos/v2/list?page=1&limit=9' );

	xhr.onload = function() {
		// Check the HTTP status code
		if ( xhr.status === 200 ) {
			var data = JSON.parse(xhr.responseText);

			const photoContainer = document.getElementById('photo_container');
			if ( photoContainer ) {
				data.forEach( photo => {
					let photoDiv = document.createElement( 'div' );
					photoDiv.classList.add( 'col-12', 'col-md-6' );
					photoDiv.innerHTML = `
					    <div class="card">
					      <img src="${photo.download_url}" class="card-img-top" alt="Photo">
					      <div class="card-body p-3">
					        <h2 class="card-title fw-bold">${photo.author}</h2>
					        <p class="card-text">
					          Here goes some sample, example text that is relatively short.
					          Here goes some sample, example text that is relatively short.
					          Here goes some sample, example text that is relatively short.
					        </p>
					        <button type="button" class="btn text-dark-emphasis p-0 show-more d-none">
								Show more...
							</button>
					      </div>
					      <div class="card-footer bg-transparent py-3 px-2">
					        <a href="#" class="btn btn-primary mx-2 fw-bold">
					          Save to collection
					        </a>
					        <a href="#" class="btn text-dark-subtle border-light-subtle mx-2 fw-bold">
					          Share
					        </a>
					      </div>
					    </div>
				    `;
					photoContainer.appendChild(photoDiv);
					photoShowMoreText( photoDiv );
				});
			}

		} else {
			console.log('Error: ' + xhr.status);
		}
	};

	xhr.send();
}

window.addEventListener('scroll', function() {
	if ( ( window.innerHeight + window.scrollY ) >= document.body.offsetHeight ) {
		fetchNewPhotos();
	}
});

function photoShowMoreText( photo ) {
	const textElement = photo.querySelector('.card-text');
	const showMoreButton = photo.querySelector('.show-more');
	const containerHeight = textElement.clientHeight;
	const lineHeight = parseInt(getComputedStyle(textElement).lineHeight);
	const numLines = Math.floor(containerHeight / lineHeight);

	if (numLines > 2) {
		showMoreButton.classList.remove( 'd-none' );
		textElement.classList.add( 'truncate-text-2' );

		showMoreButton.addEventListener('click', () => {
			textElement.classList.toggle('truncate-text-2');
			showMoreButton.textContent = textElement.classList.contains('truncate-text-2') ? 'Show more...' : 'Show less...';
		});
	}
}

window.addEventListener('load', () => {
	if ( ( window.innerHeight + window.scrollY ) >= document.body.offsetHeight ) {
		fetchNewPhotos();
	}

	const photos = document.querySelectorAll('#photo_container .card');
	if ( photos ) {
		photos.forEach( photo => {
			photoShowMoreText( photo );
		});
	}
})