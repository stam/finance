import { observable, computed } from 'mobx';
import { Model, Store } from './Base';
import mitt from 'mitt';

export class Waypoint extends Model {
    target = 'waypoint';

    @observable id = null;
    @observable address = '';
    @observable latitude = '';
    @observable longitude = '';

    @computed
    get position() {
        return [parseFloat(this.latitude), parseFloat(this.longitude)];
    }
}

export class WaypointStore extends Store {
    Model = Waypoint;
    target = 'waypoint';
    emitter = mitt();
}
