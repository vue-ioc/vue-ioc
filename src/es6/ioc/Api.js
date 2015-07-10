import BeansContext from "./BeansContext";

export default class Api {

    bakeBeans() {
        return new BeansContext();
    }
}