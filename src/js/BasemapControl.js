import { EventBus } from './DataManagement/EventBus';
import mainConfig from '../config/mainConfig.json'
export default class BasemapControl {
    constructor(map) {
        this._vue = map;
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
                    <label class="basemap"><input type="radio" id="WCH_MAIN_BASE" checked name="basemap" value="StreetMap"> Street Map </label>
                    </span>
                </li>
                <li><span class="radio">
                    <label class="basemap"><input type="radio" id="WCH_Sat" name="basemap" value="SatelliteImagery"> Satellite </label>
                    </span>
                </li>
            </ul>
        </div>
        `;

        const inputs = this._container.getElementsByTagName('input');

        for (const input of inputs) {
            input.onclick = (layer) => {
                if(layer.target.id === this._vue.$map.getStyle().name) { return }
                const newStyle = mainConfig[layer.target.id];
                this._vue.$map.setStyle(newStyle);
            };
        }
        return this._container;
    }

    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
}
