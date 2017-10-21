import { observable } from 'mobx';
import { Model, Store, Casts } from './Base';
import { Category } from './Category';
import { uniqueId, fromPairs, map } from 'lodash';

export class Rule {
    @observable column = null;
    @observable operator = null;
    @observable value = null;

    constructor() {
        this.cid = uniqueId();
    }

    toParam() {
        let value = this.value;
        if (this.column === 'amount') {
            value = parseInt(value * 100);
        }

        let operator = `:${this.operator}`;
        if (this.operator === 'is') {
            operator = '';
        }

        return [`.${this.column}${operator}`, value];
    }

    toLabel() {
        return `${this.column} ${this.operator} ${this.value}`;
    }

    // This could probably be done better
    toJS() {
        return {
            column: this.column,
            operator: this.operator,
            value: this.value,
        };
    }
}

class Matcher {
    @observable rules = [];

    constructor(rules) {
        if (!rules) {
            this.rules.push(new Rule());
            return;
        }
        this.rules = rules.map(this.parseRule);
    }

    toStoreParams() {
        // Each rule.toParam contains an array: [key, value]
        // fromPairs converts the keyVal pairs to a map
        return fromPairs(map(this.rules, r => r.toParam()));
    }

    toJS() {
        return this.rules.map(r => r.toJS());
    }

    toLabel() {
        return this.rules.map(r => r.toLabel()).join(' & ');
    }

    parseRule(rule) {
        const r = new Rule();
        r.column = rule.column;
        r.operator = rule.operator;
        r.value = rule.value;
        return r;
    }
}

const castMatcher = {
    parse(attr, value) {
        return new Matcher(value);
    },
    toJS(attr, value) {
        return value.toJS();
    },
};

// user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='queries')

//     matcher = JSONField(default={})
//     disabled = models.BooleanField(default=False)

//     created_at = models.DateTimeField(auto_now_add=True)
//     updated_at = models.DateTimeField(auto_now=True)

export class Query extends Model {
    static backendResourceName = 'query';

    @observable id = null;
    @observable name = '';
    @observable matcher = new Matcher();
    @observable createdAt = null;
    @observable updatedAt = null;

    relations() {
        return {
            category: Category,
        };
    }

    casts() {
        return {
            matcher: castMatcher,
            createdAt: Casts.datetime,
            updatedAt: Casts.datetime,
        };
    }
}

export class QueryStore extends Store {
    static backendResourceName = 'query';

    Model = Query;
}
