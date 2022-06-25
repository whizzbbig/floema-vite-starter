import '../styles/index.scss';

import AboutScene from './scenes/About';
import HomeScene from './scenes/Home';

import AboutPage from './pages/About';
import HomePage from './pages/Home';

import Application from './classes/App';

const App = new Application();

const components = [];

App.initComponents(components);

const routes = [
  {
    component: HomePage,
    scene: HomeScene,
    template: 'home',
  },
  {
    component: AboutPage,
    scene: AboutScene,
    template: 'about',
  },
];

App.initRoutes(routes);
App.init();

window.App = App;
