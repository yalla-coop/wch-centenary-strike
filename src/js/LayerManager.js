import Vue from 'vue'
import {
    EventBus
} from './DataManagement/EventBus';

export default class LayerManager {
    constructor() {
        this._vue = new Vue();
        this.layers = [];
        this.sources = [];
    }

}