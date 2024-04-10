import 'bootstrap/dist/css/bootstrap.min.css';

import {Router} from "./router";
import "./styles/styles.scss";

export class App {
    private router: Router;

    constructor() {
        this.router = new Router();
    }
}

(new App());
