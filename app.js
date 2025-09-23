const routes = {
  home: 'pages/home.html',
  plumbing: 'pages/plumbing.html',
  lighting: 'pages/lighting.html',
  'motor-drive': 'pages/motor-drive.html',
  mechanical: 'pages/mechanical.html',
  about: 'pages/about.html',
  STANDARD: 'pages/STANDARD.html',
  Share: 'pages/Share.html',
  login: 'pages/login.html',
  unit_conv: 'pages/unit_conv.html',
  chem_mix: 'pages/chem_mix.html',
  alum_calc: 'pages/alum_calc.html',
  velocity_gradient: 'pages/velocity_gradient.html',
  npsha_calc: 'pages/npsha_calc.html',
  chemical_dosing: 'pages/chemical_dosing.html',
  filter_volume: 'pages/filter_volume.html',
  sedimentation_tube: 'pages/sedimentation_tube.html'
};

function loadPage(page) {
  const content = document.getElementById('app-content');
  const file = routes[page] || routes['home'];

  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error('Page not found');
      return response.text();
    })
    .then(html => {
      content.innerHTML = html;

      // โหลด JS module ของ page แบบ dynamic
      const jsPath = `./cal_path/${page}.js`;
      import(jsPath)
        .then(module => {
          // สร้างชื่อฟังก์ชัน init ตาม convention: initPageName
          const fnName = `init${page
            .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
            .replace(/^\w/, c => c.toUpperCase())}`;

          if (typeof module[fnName] === 'function') {
            module[fnName]();
          } else {
            console.warn(`⚠️ Function ${fnName}() not found in ${jsPath}`);
          }
        })
        .catch(() => {
          console.log(`ℹ️ No JS for page: ${page}`);
        });
    })
    .catch(() => {
      content.innerHTML = `<h2>404 - Page Not Found</h2>`;
    });
}

function handleHashChange() {
  const hash = window.location.hash.slice(1);
  loadPage(hash);
}

window.addEventListener('load', handleHashChange);
window.addEventListener('hashchange', handleHashChange);