// โหลด navbar.html
fetch('navbar.html')
  .then(response => {
    if (!response.ok) throw new Error('Cannot load navbar');
    return response.text();
  })
  .then(html => {
    document.getElementById('nav-placeholder').innerHTML = html;

    // ป้องกัน link # กระโดด
    document.querySelectorAll('a[href="#"]').forEach(link => {
      link.addEventListener('click', e => e.preventDefault());
    });

    const toggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector("nav > ul");

    // Toggle menu mobile
    if (toggle && navMenu) {
      toggle.addEventListener("click", () => navMenu.classList.toggle("active"));
    }

    // Mobile: toggle submenu และปิด navbar เมื่อเลือก
    const mediaQuery = window.matchMedia("(max-width: 930px)");
    document.querySelectorAll("nav li > a").forEach(link => {
      const submenu = link.nextElementSibling;
      if (submenu && submenu.tagName === "UL") {
        // parent link มี submenu
        link.addEventListener("click", e => {
          e.preventDefault();
          submenu.classList.toggle("active");
          link.classList.toggle("active");
        });
      } else {
        // link ไม่มี submenu → ปิด navbar เมื่อคลิก
        link.addEventListener("click", () => {
          if (mediaQuery.matches) {
            navMenu.classList.remove("active");
          }
        });
      }
    });

  })
  .catch(error => console.error('Error loading navbar:', error));
