import { Server } from 'mock-socket';
import { EntryStore } from '../Entry';
import { api } from '../Base';
import Socket from '../../Socket';

let mockServer = null;
let socket = null;

beforeEach(() => {
    mockServer = new Server(process.env.CY_FRONTEND_WEBSOCKET_URL);
    socket = new Socket({
        onMessage: () => {},
    });
    api.socket = socket;
});

afterEach(done => {
    mockServer.stop(done);
});

test('subscribe() should send subscribe message', done => {
    const entryStore = new EntryStore();
    entryStore.subscribe({ user: 1 });

    mockServer.on('message', msg => {
        msg = JSON.parse(msg);
        expect(msg.type).toBe('subscribe');
        expect(msg.data).toEqual({ user: 1 });
        expect(msg.target).toBe('entry');
        expect(msg.requestId).toBe(entryStore.subscriptionId);
        done();
    });
});

test('unsubscribe() should send unsubscribe message', done => {
    const entryStore = new EntryStore();
    entryStore.subscribe();
    const requestId = entryStore.subscriptionId;
    entryStore.unsubscribe();
    mockServer.on('message', msg => {
        msg = JSON.parse(msg);
        if (msg.type === 'unsubscribe') {
            expect(msg.requestId).toBe(requestId);
            done();
        }
    });
});

describe('Handling published messages', () => {
    test('should handle adding model', () => {
        const entryStore = new EntryStore();
        entryStore.subscribe();
        const requestId = entryStore.subscriptionId;
        mockServer.send(
            JSON.stringify({
                type: 'publish',
                requestId,
                data: {
                    add: [{ id: 4 }],
                    update: [],
                    remove: [],
                },
            })
        );
        expect(entryStore.map('id')).toEqual([4]);
    });

    test('should handle updating model', () => {
        const entryStore = new EntryStore().parse([
            { id: 3, description: 'Foo' },
        ]);
        entryStore.subscribe();
        const requestId = entryStore.subscriptionId;
        mockServer.send(
            JSON.stringify({
                type: 'publish',
                requestId,
                data: {
                    add: [],
                    update: [{ id: 3, description: 'Boo' }],
                    remove: [],
                },
            })
        );
        expect(entryStore.at(0).description).toBe('Boo');
    });

    test('should handle deleting model', () => {
        const entryStore = new EntryStore().parse([{ id: 3 }]);
        expect(entryStore.length).toBe(1);
        entryStore.subscribe();
        const requestId = entryStore.subscriptionId;
        mockServer.send(
            JSON.stringify({
                type: 'publish',
                requestId,
                data: {
                    add: [],
                    update: [],
                    remove: [{ id: 3 }],
                },
            })
        );
        expect(entryStore.length).toBe(0);
    });
});
