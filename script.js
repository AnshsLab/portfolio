const ROWS = 6;
const COLS = 6;

let isFlipped = false;
let tiles = [];

function getBlockSize() {
  return window.innerWidth < 768 ? 30 : 50;
}

function createTile(row, col) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.innerHTML = `
    <div class="tile-face tile-front"></div>
    <div class="tile-face tile-back"></div>
  `;

  const bgPosition = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;

  tile.querySelector(".tile-front").style.backgroundPosition = bgPosition;
  tile.querySelector(".tile-back").style.backgroundPosition = bgPosition;

  return tile;
}

function createBoard() {
  const container = document.querySelector(".tiles-container");
  container.innerHTML = "";

  for (let i = 0; i < ROWS; i++) {
    const row = document.createElement("div");
    row.className = "row";

    for (let j = 0; j < COLS; j++) {
      const tile = createTile(i, j);
      row.appendChild(tile);
    }

    container.appendChild(row);
  }

  tiles = document.querySelectorAll(".tile");
}

function initializeTileAnimations() {
  tiles.forEach((tile, index) => {
    let flipTimeout = null;
    let isCurrentlyFlipped = false;

    const flipTile = () => {
      if (isCurrentlyFlipped) return;

      const col = index % COLS;
      let tiltY = (col - COLS / 2) * 10;

      if (flipTimeout) {
        clearTimeout(flipTimeout);
        flipTimeout = null;
      }

      isCurrentlyFlipped = true;

      gsap.timeline()
        .set(tile, { rotateX: 0, rotateY: 0 })
        .to(tile, {
          rotateX: 90,
          rotateY: tiltY,
          duration: 0.25,
          ease: "power2.out",
        })
        .to(tile, {
          rotateX: 180,
          rotateY: 0,
          duration: 0.25,
          ease: "power2.out",
        });
    };

    const flipBack = () => {
      if (!isCurrentlyFlipped) return;

      flipTimeout = setTimeout(() => {
        const col = index % COLS;
        let tiltY = (col - COLS / 2) * 10;

        isCurrentlyFlipped = false;

        gsap.timeline()
          .set(tile, { rotateX: 180, rotateY: 0 })
          .to(tile, {
            rotateX: 270,
            rotateY: tiltY,
            duration: 0.25,
            ease: "power2.out",
          })
          .to(tile, {
            rotateX: 360,
            rotateY: 0,
            duration: 0.25,
            ease: "power2.out",
          });
      }, 1000);
    };

    tile.addEventListener("mouseenter", flipTile);
    tile.addEventListener("mouseleave", flipBack);
    
    tile.addEventListener("touchstart", (e) => {
      e.preventDefault();
      flipTile();
      setTimeout(flipBack, 100);
    });
  });

  const flipButton = document.getElementById("flipButton");
  flipButton.addEventListener("click", () => flipAllTiles());
}

function flipAllTiles() {
  if (isFlipped) return;
  isFlipped = true;

  const container = document.querySelector(".tiles-container");
  const heroContent = document.querySelector(".hero-content");
  const timeline = gsap.timeline();

  timeline.to(tiles, {
    rotateX: 180,
    duration: 1,
    stagger: { amount: 0.5, from: "random" },
    ease: "power2.inOut",
  });

  timeline.to("#flipButton", {
    opacity: 0,
    duration: 0.3,
    ease: "power2.inOut",
  }, "-=0.6");

  timeline.to(".board::before", {
    opacity: 1,
    duration: 1.2,
    ease: "power2.inOut",
  }, "-=0.3");

  timeline.to(".tiles-container", {
    opacity: 0,
    duration: 1.2,
    ease: "power2.inOut",
    onComplete: () => {
      container.style.display = "none";
    }
  }, "-=1.2");

  timeline.to(".hero-content", {
    opacity: 1,
    duration: 0.8,
    ease: "power2.out",
    onStart: () => {
      heroContent.style.pointerEvents = "auto";
    }
  }, "-=0.4");
}

function createBlocks() {
  const blockContainer = document.getElementById("blocks");
  blockContainer.innerHTML = "";

  const rect = blockContainer.getBoundingClientRect();
  const BLOCK_SIZE = getBlockSize();

  const numCols = Math.floor(rect.width / BLOCK_SIZE);
  const numRows = Math.floor(rect.height / BLOCK_SIZE);

  for (let i = 0; i < numCols * numRows; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    blockContainer.appendChild(block);
  }

  return { numCols, blockSize: BLOCK_SIZE };
}

function highlightBlock(e) {
  const blockContainer = document.getElementById("blocks");
  const { numCols, blockSize } = window.blockInfo;

  const rect = blockContainer.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

  const col = Math.floor(x / blockSize);
  const row = Math.floor(y / blockSize);

  const index = row * numCols + col;

  const block = blockContainer.children[index];
  if (!block) return;

  block.classList.add("highlight");

  setTimeout(() => {
    block.classList.remove("highlight");
  }, 220);
}

function debounce(func, delay = 120) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

function positionButton() {
  const board = document.querySelector(".board");
  const button = document.getElementById("flipButton");
  const tiles = document.querySelectorAll(".tile");

  if (!tiles.length) return;

  const targetIndex = (4 * COLS) + 2;

  const targetTile = tiles[targetIndex];
  const rect = targetTile.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const centerX = rect.left - boardRect.left + rect.width;
  const centerY = rect.top - boardRect.top + rect.height / 2;

  button.style.left = `${centerX}px`;
  button.style.top = `${centerY}px`;
}

function initFooter() {
  const mailIcon = document.getElementById('mailIcon');
  const footer = document.getElementById('footer');
  const closeFooter = document.getElementById('closeFooter');

  mailIcon.addEventListener('click', (e) => {
    e.preventDefault();
    footer.classList.add('active');
  });

  closeFooter.addEventListener('click', () => {
    footer.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && footer.classList.contains('active')) {
      footer.classList.remove('active');
    }
  });

  footer.addEventListener('click', (e) => {
    if (e.target === footer) {
      footer.classList.remove('active');
    }
  });
}

// Page transition overlay
function createPageTransition() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
  return overlay;
}

// Smooth page transition function
function transitionToPage(url) {
  const overlay = createPageTransition();
  
  gsap.to(overlay, {
    opacity: 1,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      window.location.href = url;
    }
  });
}

// Page load transition (fade in)
function pageLoadTransition() {
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        overlay.remove();
      }
    });
  }
}

// Section to page mapping
const sectionPages = {
  'projects': 'projects.html',
  'opensource': 'opensource.html',
  'about': 'about.html',
  'skills': 'skills.html',
  'experience': 'experience.html',
  'blog': 'blog.html',
  'contact': 'contact.html',
  'resume': 'resume.html',
  'talk': 'talk.html'
};

function expandItem(section) {
  // Special case: if section is "contact", open footer instead
  if (section === 'contact') {
    const footer = document.getElementById('footer');
    footer.classList.add('active');
    return;
  }

  // Navigate to the corresponding page with transition
  if (sectionPages[section]) {
    transitionToPage(sectionPages[section]);
  }
}

window.closeExpanded = function() {
  const expandedItems = document.querySelectorAll('.item-expanded.active');
  expandedItems.forEach(item => {
    item.classList.remove('active');
  });
  document.body.style.overflow = '';
}

function initNavigationItems() {
  const items = document.querySelectorAll('.container .item[data-section]');
  
  items.forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      expandItem(section);
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExpanded();
    }
  });
}

function init() {
  // Create initial transition overlay
  const overlay = createPageTransition();
  overlay.style.opacity = '1';
  
  const img = new Image();
  img.src = './assets/back.jpg';
  
  createBoard();
  gsap.set(".tile", { rotateX: 0 });
  isFlipped = false;
  initializeTileAnimations();
  window.blockInfo = createBlocks();
  document.addEventListener("mousemove", highlightBlock);
  setTimeout(positionButton, 50);
  window.addEventListener("resize", debounce(() => {
    window.blockInfo = createBlocks();
    setTimeout(positionButton, 50);
  }));
  
  initFooter();
  initNavigationItems();
  
  // Fade in page after everything loads
  setTimeout(() => {
    pageLoadTransition();
  }, 100);
}

document.addEventListener("DOMContentLoaded", init);