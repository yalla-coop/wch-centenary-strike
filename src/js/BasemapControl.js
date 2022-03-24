import Vue from 'vue';
import { EventBus } from './DataManagement/EventBus';
export default class BasemapControl {
    constructor() {
        this._vue = new Vue();
    }
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl basemap-control-container';
        this._container.innerHTML = `
        <div class="large-control">
            <b>Choose a basemap:</b> 
            <ul class="list-unstyled">
                <li><span class="radio">
                    <label class="basemap"><input type="radio" id="street-style" checked name="basemap" value="StreetMap"> Street Map </label>
                    </span>
                </li>
                <li><span class="radio">
                    <label class="basemap"><input type="radio" id="satellite-style" name="basemap" value="SatelliteImagery"> Satellite </label>
                    </span>
                </li>
            </ul>
        </div>
        `;

        const inputs = this._container.getElementsByTagName('input');

        for (const input of inputs) {
            input.onclick = (layer) => {    
                const newStyle = this._vue.$mainConfig[layer.target.id];
                //console.log(newStyle)
                this._vue.$map.setStyle(newStyle);
                EventBus.$emit("switch-base");
            };
        }
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}