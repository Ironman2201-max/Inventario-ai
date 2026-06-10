import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './components/menu/menu';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Menu],
  template: `
    <div class="app-layout">
      <app-menu></app-menu> 
      
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; }
    /* Deja espacio a la izquierda para que el menú fijo no tape tus paneles */
    .main-content { flex-grow: 1; margin-left: 260px; padding: 2rem; min-height: 100vh; background-color: #f1f5f9; box-sizing: border-box; }
    
    /* Si estás en la pantalla de login o registro (donde no hay menú), quitamos el margen */
    :has(app-login), :has(app-registro) {
      .main-content { margin-left: 0; padding: 0; }
    }
  `]
})
export class App {
  protected readonly title = signal('Inventario-ai');
}
