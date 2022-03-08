import axios from 'axios';
import Vue from 'vue';
import {
    EventBus
} from './EventBus';
//import StateList from './StateList';
export default class DataManager {
    constructor() {
        this._vue = new Vue();
    }
}
