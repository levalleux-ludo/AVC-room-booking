process.env.NODE_ENV = 'test';

const Roles = require('../src/users/user.model').roles;

const test_helper = require('./test_helper')

const userService = require('../src/users/user.service')

let mongoose = require("mongoose");

let chai = require("chai");
let chaiHttp = require("chai-http");

let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let admin = {
    username: "admin",
    password: "admin",
    firstName: "Administrator",
    lastName: "A"
};

let avcAdmin = {
    username: "avcAdmin",
    password: "avcAdmin",
    firstName: "avcAdmin",
    lastName: "avcAdmin"
};

let avcStaff = {
    username: "avcStaff",
    password: "avcStaff",
    firstName: "avcStaff",
    lastName: "avcStaff"
};

async function createAdmin(done) {
    console.log("Create admin user")
    await userService.createWithRole(admin, Roles.SysAdmin)
    done();
}

before((done) => {
    test_helper.drop_users(() => {
        createAdmin(done)
    });
});

let toto = {
    username: "toto",
    password: "motdepasse",
    firstName: "Patrick",
    lastName: "Chirac",
    role: "SysAdmin" // test that the role is always set to guest, even if specified to another value in request
};

let totoToken;
let totoId;
let adminToken;
let adminId;
let avcAdminToken;
let avcAdminId;
let avcStaffToken;
let avcStaffId;

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
    describe('/POST users/register', () => {
        it('it shall register user "avcAdmin"', (done) => {
            chai.request(server)
                .post('/users/register')
                .send(avcAdmin)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    describe('/POST users/register', () => {
        it('it shall register user "avcStaff"', (done) => {
            chai.request(server)
                .post('/users/register')
                .send(avcStaff)
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
                    res.body.should.have.property('role').eql(Roles.Guest);
                    res.body.should.have.property('token');
                    totoToken = res.body.token;
                    totoId = res.body._id;
                    console.log("toto Id:", totoId);
                    done();
                });
        });
        it('it shall authenticate user "admin"', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({
                    username: admin.username,
                    password: admin.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql(admin.username);
                    res.body.should.have.property('firstName').eql(admin.firstName);
                    res.body.should.have.property('lastName').eql(admin.lastName);
                    res.body.should.have.property('role').eql(Roles.SysAdmin);
                    res.body.should.have.property('token');
                    adminToken = res.body.token;
                    adminId = res.body._id;
                    done();
                });
        });
        it('it shall authenticate user "avcAdmin"', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({
                    username: avcAdmin.username,
                    password: avcAdmin.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql(avcAdmin.username);
                    res.body.should.have.property('role').eql(Roles.Guest);
                    res.body.should.have.property('token');
                    avcAdminToken = res.body.token;
                    avcAdminId = res.body._id;
                    done();
                });
        });
        it('it shall authenticate user "avcStaff"', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({
                    username: avcStaff.username,
                    password: avcStaff.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql(avcStaff.username);
                    res.body.should.have.property('role').eql(Roles.Guest);
                    res.body.should.have.property('token');
                    avcStaffToken = res.body.token;
                    avcStaffId = res.body._id;
                    done();
                });
        });


    });
    describe('/POST users/role', () => {
        it('a not identified user can not change the role of any users', (done) => {
            chai.request(server)
                .post('/users/customer')
                .set('Authorization', ``)
                .send({
                    userId: totoId,
                    role: Roles.Customer
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql('Invalid Token');
                    console.log(res.body);
                    done();
                });
        });
        it('a guest user can not change the role of any users', (done) => {
            chai.request(server)
                .post('/users/customer')
                .set('Authorization', `Bearer ${totoToken}`)
                .send({
                    userId: totoId,
                    role: Roles.Customer
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql('Unauthorized');
                    console.log(res.body);
                    done();
                });
        });
        it('a sys admin user can attribute the role Customer to any users but himself', (done) => {
            chai.request(server)
                .post('/users/customer')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: totoId,
                    role: Roles.Customer
                })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('role').eql(Roles.Customer);
                    done();
                });
        });
        it('a sys admin user can attribute the role AvcStaff of any users but himself', (done) => {
            chai.request(server)
                .post('/users/staff')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: avcStaffId,
                    role: Roles.AvcStaff
                })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('role').eql(Roles.AvcStaff);
                    done();
                });
        });
        it('a sys admin user can attribute the role AvcAdmin of any users but himself', (done) => {
            chai.request(server)
                .post('/users/admin')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: avcAdminId,
                    role: Roles.AvcAdmin
                })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.have.property('role').eql(Roles.AvcAdmin);
                    done();
                });
        });
        it('a sys admin user can not attribute another role to himself', (done) => {
            chai.request(server)
                .post('/users/admin')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    userId: adminId,
                    role: Roles.AvcAdmin
                })
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Changing its own role is not allowed');
                    done();
                });
        });
    });
    describe('/GET users', () => {
        it('reauthenticate user "avcStaff" to renew token with the new role', (done) => {
            chai.request(server)
                .post('/users/authenticate')
                .send({
                    username: avcStaff.username,
                    password: avcStaff.password
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql(avcStaff.username);
                    res.body.should.have.property('role').eql(Roles.AvcStaff);
                    res.body.should.have.property('token');
                    avcStaffToken = res.body.token;
                    avcStaffId = res.body._id;
                    done();
                });
        });
        it('it shall list all users', (done) => {
            chai.request(server)
                .get('/users')
                .set('Authorization', `Bearer ${avcStaffToken}`)
                .send()
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    console.log(res.body);
                    done();
                });
        });
    });
});