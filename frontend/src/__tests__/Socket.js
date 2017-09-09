import { Server } from 'mock-socket';
import Socket from '../Socket';

let mockServer = null;

beforeEach(() => {
    mockServer = new Server(process.env.CY_FRONTEND_WEBSOCKET_URL);
});

afterEach(done => {
    mockServer.stop(done);
});

test('Should open a WebSocket successfully', done => {
    mockServer.on('connection', () => {
        done();
    });
    new Socket({});
});

test('Should receive a message as object', done => {
    mockServer.on('connection', ws => {
        ws.send(JSON.stringify({ foo: 'bar' }));
    });
    const socket = new Socket();
    socket.on('message', msg => {
        expect(msg).toEqual({ foo: 'bar' });
        done();
    });
});

test('Should send a message correctly', done => {
    mockServer.on('message', msg => {
        expect(msg).toEqual(
            JSON.stringify({
                type: 'foo',
                authorization: null,
            })
        );
        done();
    });
    const socket = new Socket({});
    socket.send({ type: 'foo' });
});

test('Should send a message with authToken', done => {
    mockServer.on('message', msg => {
        expect(JSON.parse(msg).authorization).toBe('fooobar');
        done();
    });
    const socket = new Socket({});
    socket.authToken = 'fooobar';
    socket.send({ type: 'myman' });
});

test('Should use messageHandlers instead of fallback', done => {
    mockServer.on('connection', ws => {
        ws.send(JSON.stringify({ foo: 'bar' }));
    });
    const socket = new Socket({
        onMessage: () => {
            done.fail(new Error('It should not come here.'));
        },
    });
    let visitedHandler = false;
    socket.addMessageHandler(msg => {
        visitedHandler = true;
        return true;
    });

    setTimeout(() => {
        expect(visitedHandler).toBe(true);
        done();
    }, 100);
});

test('Should use fallback if messageHandler does not return true', done => {
    mockServer.on('connection', ws => {
        ws.send(JSON.stringify({ foo: 'bar' }));
    });
    let visitedHandler = false;
    const socket = new Socket();

    socket.on('message', () => {
        expect(visitedHandler).toBe(true);
        done();
    });
    socket.addMessageHandler(msg => {
        visitedHandler = true;
    });
});
