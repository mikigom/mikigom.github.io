(() => {
  const list = document.getElementById('publications-list');
  const openButton = document.getElementById('publications-open');
  const modal = document.getElementById('publications-modal');
  const modalBody = document.getElementById('publications-modal-body');
  const closeButton = document.getElementById('publications-close');
  if (!list || !openButton || !modal || !modalBody || !closeButton) return;

  const total = list.querySelectorAll('.pub-entry').length;
  document.querySelectorAll('[data-pubs-count]').forEach((element) => {
    element.textContent = String(total);
  });

  // With JavaScript disabled the complete publication list remains readable.
  list.classList.add('pubs--collapsed');
  openButton.hidden = false;

  if (typeof modal.showModal !== 'function') {
    modal.remove();
    openButton.removeAttribute('aria-haspopup');
    openButton.setAttribute('aria-controls', 'publications-list');
    openButton.setAttribute('aria-expanded', 'false');
    openButton.addEventListener('click', () => {
      const expanded = openButton.getAttribute('aria-expanded') !== 'true';
      openButton.setAttribute('aria-expanded', String(expanded));
      openButton.textContent = expanded ? 'Show selected publications' : `View all ${total} publications`;
      list.classList.toggle('pubs--collapsed', !expanded);
    });
    return;
  }

  let scrollPosition = 0;
  openButton.addEventListener('click', () => {
    if (!modalBody.firstElementChild) {
      const all = list.cloneNode(true);
      all.removeAttribute('id');
      all.classList.remove('pubs--collapsed');
      modalBody.appendChild(all);
    }

    scrollPosition = window.scrollY;
    document.documentElement.style.setProperty('--scroll-position', `-${scrollPosition}px`);
    document.documentElement.classList.add('is-modal-open');
    modal.showModal();
    modalBody.scrollTop = 0;
    modalBody.focus({ preventScroll: true });
  });

  closeButton.addEventListener('click', () => modal.close());

  // Only a complete pointer click outside the dialog dismisses the backdrop.
  const outside = (event) => {
    const bounds = modal.getBoundingClientRect();
    return event.target === modal && (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    );
  };
  let startedOutside = false;
  modal.addEventListener('pointerdown', (event) => { startedOutside = outside(event); });
  modal.addEventListener('click', (event) => {
    if (startedOutside && outside(event)) modal.close();
    startedOutside = false;
  });

  modal.addEventListener('close', () => {
    document.documentElement.classList.remove('is-modal-open');
    document.documentElement.style.removeProperty('--scroll-position');
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    openButton.focus({ preventScroll: true });
  });
})();
