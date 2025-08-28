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
            <b style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; color: #FCFAFA;">Choose a basemap:</b> 
            <ul class="list-unstyled" style="font-family: 'Source Sans 3', 'Gill Sans', Calibri, sans-serif;">
                <li><span class="radio">
                    <label class="basemap" style="font-family: 'Source Sans 3', 'Gill Sans', Calibri, sans-serif; color: #FCFAFA;"><input type="radio" id="WCH_MAIN_BASE" checked name="basemap" value="StreetMap"> Street Map </label>
                    </span>
                </li>
                <li><span class="radio">
                    <label class="basemap" style="font-family: 'Source Sans 3', 'Gill Sans', Calibri, sans-serif; color: #FCFAFA;"><input type="radio" id="WCH_Sat" name="basemap" value="SatelliteImagery"> Satellite </label>
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