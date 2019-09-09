process.env.NODE_ENV = 'test';

const test_helper = require('./test_helper')

let mongoose = require("mongoose");

let chai = require("chai");
let chaiHttp = require("chai-http");

let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

before((done) => {
    test_helper.drop_users(done);
});

let toto = {
    username: "toto",
    password: "motdepasse",
    firstName: "Patrick",
    lastName: "Chirac"
};

let totoToken;


describe('Users', () => {
    describe('/POST users/register', () => {
        it('it shall register user "toto"', (done) => {
            chai.request(server)
                .post('/users/register')
                .send(toto)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('/POST users/authenticate', () => {
        it('it shall authenticate user "toto"', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({
                    username: toto.username,
                    password: toto.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql(toto.username);
                    res.body.should.have.property('firstName').eql(toto.firstName);
                    res.body.should.have.property('lastName').eql(toto.lastName);
                    res.body.should.have.property('token');
                    totoToken = res.body.token;
                    done();
                });
        });
    });
    describe('/GET users', () => {
        it('it shall list all users', (done) => {
            chai.request(server)
                .get('/users')
                .set('Authorization', `Bearer ${totoToken}`)
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    console.log(res.body);
                    done();
                });
        })
    })
});
