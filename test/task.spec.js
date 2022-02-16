/* Blackbox test to validate the obfuscator output */
const should = require('chai').should();

const { spawn } = require('child_process');
const { request } = require('http');

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        request({
            host: 'localhost',
            port: 5000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        }, function (response) {
            let str = '';
            response.on('data', function (chunk) {
                str += chunk;
            });
            response.on('end', function () {
                resolve({ statusCode: response.statusCode, data: JSON.parse(str) });
            });
            response.on('error', function (err) {
                reject(err);
            });
        }).end(JSON.stringify(data));
    });
}

describe('Task CRUD', function () {
    var serverCommand = undefined;
    this.timeout(5000);
    before(async function () {
        serverCommand = spawn('node', ['./dist_obfuscated/app.js']);
        serverCommand.stdout.on('data', (data) => console.log(`FROM SERVER stdout: ${data}`));
        serverCommand.stderr.on('data', (data) => console.log(`FROM SERVER stderr: ${data}`));
        serverCommand.on('close', (code) => console.log(`Server process exited with code ${code}`));
        console.log('FROM TESTBED: Server started');
        return new Promise((resolve) => setTimeout(resolve, 2000));
    });

    after(() => {
        if (serverCommand) {
            serverCommand.kill('SIGKILL');
            console.log('FROM TESTBED: Server stopped');
        }
    });

    describe('CREATE...', function () {
        it('should return 201 when successfully created', async function () {
            const title = 'Create a blog spot on Blogger';
            const body = 'Any topics';
            const res = await makeRequest('/api/task/create', 'POST', { title, body });
            res.statusCode.should.be.equal(201);
            should.exist(res.data);
            res.data.should.have.property('ok').and.equal(true);
            res.data.should.have.property('details').and.to.be.an('object');
            const task = res.data.details;
            should.exist(task);
            task.should.have.property('id').and.to.be.a('number');
            task.should.have.property('title').and.equal(title);
            task.should.have.property('body').and.equal(body);
            task.should.have.property('isDone').and.equal(false);
            task.should.have.property('completeDate').and.equal(null);
            task.should.have.property('updatedDate').and.to.be.a('string');
            task.should.have.property('createdDate').and.to.be.a('string');
        });

        it('should return 400 when title is missing', async function () {
            const title = '';
            const body = 'Any topics';
            const res = await makeRequest('/api/task/create', 'POST', { title, body });
            res.statusCode.should.be.equal(400);
            should.exist(res.data);
            res.data.should.have.property('ok').and.equal(false);
            res.data.should.have.property('errorCode').and.to.be.a('number');
            res.data.should.have.property('message').and.equal('Title is missing');
        });
    });

    describe('FETCH and REMOVE...', function () {
        it('should return 200 when successfully deleted', async function () {
            const res = await makeRequest('/api/task/all', 'GET');
            res.statusCode.should.be.equal(200);
            should.exist(res.data);
            res.data.should.have.property('ok').and.equal(true);
            for (const task of res.data.details) {
                const result = await makeRequest('/api/task/delete/' + task.id, 'DELETE');
                result.statusCode.should.be.equal(200);
                should.exist(result.data);
                result.data.should.have.property('ok').and.equal(true);
            }
        });
    });
});
