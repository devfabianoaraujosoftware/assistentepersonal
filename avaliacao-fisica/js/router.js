// js/router.js
class Router {
  constructor(routes, containerId) {
    this.routes = routes;
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  handleRoute() {
    let hash = window.location.hash || '#/dashboard';

    // Parse params (e.g., #/alunos/ALU-123/avaliacao)
    // Very simple matching for this demo
    const urlParts = hash.split('/').filter(Boolean);
    const baseRoute = '/' + (urlParts[1] || 'dashboard');
    let id = null;
    let subRoute = null;

    if (urlParts.length >= 3) {
        id = urlParts[2]; // e.g. ALU-123
    }
    if (urlParts.length >= 4) {
        subRoute = urlParts[3]; // e.g. avaliacao
    }

    // Check if there is an EXACT match first (like /alunos/novo)
    const exactPath = '/' + urlParts.slice(1).join('/');
    let route = this.routes.find(r => r.path === exactPath);

    if (!route) {
        // Fallback to dynamic matching if exact not found
        route = this.routes.find(r => r.path === baseRoute);

        if (id && subRoute) {
            route = this.routes.find(r => r.path === `${baseRoute}/:id/${subRoute}`);
        } else if (id) {
             route = this.routes.find(r => r.path === `${baseRoute}/:id`);
        }
    }

    if (route) {
      this.updateActiveNav(baseRoute);
      this.container.innerHTML = 'Carregando...'; // Show loading state

      // Execute the render/controller function
      Promise.resolve(route.action({ id, subRoute })).then(html => {
         if (html) {
           this.container.innerHTML = html;
           if (route.afterRender) {
             route.afterRender({ id, subRoute });
           }
         }
      }).catch(err => {
         console.error(err);
         this.container.innerHTML = `<div class="alert-item alert-red">Erro ao carregar a página: ${err.message}</div>`;
      });
    } else {
      this.container.innerHTML = '<h2>404 - Página não encontrada</h2>';
    }
  }

  updateActiveNav(path) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + path) {
        a.classList.add('active');
      }
    });
  }

  navigate(path) {
      window.location.hash = path;
  }
}

export default Router;
