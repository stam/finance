import { observable, computed } from 'mobx';
import { Model, Store } from './Base';

export class Trail extends Model {
    target = 'trail';

    @observable id = null;
    @observable sourceWaypoint = null;
    @observable targetWaypoint = '';
    @observable polyline = [];

    @computed
    get positions() {
        // Observable array toJS not recursive?
        return JSON.parse(JSON.stringify(this.polyline));
    }
}

export class TrailStore extends Store {
    Model = Trail;
    target = 'trail';

    addBetweenMarkers(source, target) {
        const t = new this.Model();
        t.sourceWaypoint = source.id;
        t.targetWaypoint = target.id;
        t.polyline = [source.position, target.position];
        t.save();
    }
}
