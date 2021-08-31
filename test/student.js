//During the test the env variable is set to test
process.env.NODE_ENV = 'test'

let mongoose = require('mongoose')
let Student = require('../controllers/models/student')

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let chaiThings = require('chai-things')
let server = require('../server')
let should = chai.should()
let expect = chai.expect

chai.use(chaiHttp)
// chai.use(chaiLike)
chai.use(chaiThings)
//Our parent block
describe('Students', () => {
	beforeEach((done) => {
		//Before each test we empty the database
		Student.deleteOne({}, (err) => {
			done()
		})
	})
	/*
	 * Test the /GET route
	 */
	describe('/GET student', () => {
		it('it should GET all the students', (done) => {
			chai
				.request(server)
				.get('/student')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('array')
					res.body.length.should.be.eql(0)
					done()
				})
		})
	})
	/*
	 * Test the /POST route
	 */
	describe('/POST student', () => {
		it('it should not POST a student without _id field', (done) => {
			let student = {
				firstName: 'Mike',
				lastName: 'Weber',
				class: '2 W',
				nationality: 'Sunny States',
			}
			chai
				.request(server)
				.post('/student')
				.send(student)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('errors')
					res.body.errors.should.have.property('_id')
					res.body.errors._id.should.have.property('kind').eql('required')
					done()
				})
		})
		it('it should POST a student ', (done) => {
			let student = {
				_id: '223400',
				firstName: 'Louis',
				lastName: 'Nate',
				class: '2 N',
				nationality: 'Past States',
			}
			chai
				.request(server)
				.post('/student')
				.send(student)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have
						.property('message')
						.eql('Student successfully added!')
					res.body.student.should.have.property('_id')
					res.body.student.should.have.property('firstName')
					res.body.student.should.have.property('lastName')
					res.body.student.should.have.property('class')
					res.body.student.should.have.property('nationality')
					done()
				})
		})
	})
	/*
	 * Test the /GET /student/:id route
	 */
	describe('/GET /student:id student', () => {
		it('it should GET a student by the given id', (done) => {
			let student = new Student({
				_id: '223401',
				firstName: 'Green',
				lastName: 'Bean',
				class: '1 B',
				nationality: 'Vegetable',
			})
			student.save((err, student) => {
				chai
					.request(server)
					.get('/student/' + student._id)
					.send(student)
					.end((err, res) => {
						res.should.have.status(200)
						res.body.should.be.a('object')
						res.body.should.have.property('firstName')
						res.body.should.have.property('lastName')
						res.body.should.have.property('class')
						res.body.should.have.property('nationality')
						res.body.should.have.property('_id').eql(student._id)
						done()
					})
			})
		})
	})
	/*
	 * Test the /GET /fetchStudents/?id= route
	 */
	describe('/GET /fetchStudents?id= student', () => {
		it('it should GET a student by the given the query string /?id=', (done) => {
			let student = new Student({
				_id: 223410,
				firstName: 'Green',
				lastName: 'Bean',
				class: '1 B',
				nationality: 'Vegetable',
			})
			student.save((err, student) => {
				chai
					.request(server)
					.get('/fetchStudents?id=' + student._id)
					.send(student)
					.end((err, res) => {
						res.should.have.status(200)
						res.body.should.be.a('Array')
						expect(res.body).to.eql([
							{
								_id: 223410,
								firstName: 'Green',
								lastName: 'Bean',
								class: '1 B',
								nationality: 'Vegetable',
							},
						])
						done()
					})
			})
		})
	})
	/*
	 * Test the /GET /fetchStudents/?class= route
	 */
	describe('/GET /fetchStudents?class= student', () => {
		it('it should GET a student by the given the query string /?class=', (done) => {
			let student = new Student({
				_id: '223411',
				firstName: 'Black',
				lastName: 'Bean',
				class: '2 B',
				nationality: 'Super Food',
			})
			student.save((err, student) => {
				chai
					.request(server)
					.get('/fetchStudents?class=' + student.class)
					.send(student)
					.end((err, res) => {
						res.should.have.status(200)
						res.body.should.be.a('Array')
						expect(res.body).to.eql([
							{
								_id: 223411,
								firstName: 'Black',
								lastName: 'Bean',
								class: '2 B',
								nationality: 'Super Food',
							},
						])
						done()
					})
			})
		})
	})
	/*
	 * Test the /PUT/:id route
	 */
	describe('/PUT/:id student', () => {
		it('it should UPDATE a student given the id', (done) => {
			let student = new Student({
				_id: 223430,
				firstName: 'Ryan',
				lastName: 'Reynolds',
				class: '2 R',
				nationality: 'Green Lantern',
			})
			student.save((err, student) => {
				chai
					.request(server)
					.put('/student/' + student.id)
					.send({
						_id: 223430,
						class: '2 G',
					})
					.end((err, res) => {
						res.should.have.status(200)
						res.body.should.be.a('object')
						res.body.should.have.property('message').eql('Student updated!')
						res.body.student.should.have.property('firstName').eql('Ryan')
						res.body.student.should.have.property('lastName').eql('Reynolds')
						res.body.student.should.have.property('class').eql('2 G')
						res.body.student.should.have
							.property('nationality')
							.eql('Green Lantern')
						done()
					})
			})
		})
	})
	/*
	 * Test the /DELETE /student:id route
	 */
	describe('/DELETE /student:id student', () => {
		it('it should DELETE a student given the id', (done) => {
			let student = new Student({
				_id: 223430,
				firstName: 'Capitain',
				lastName: 'America',
				class: '2 A',
				nationality: 'Marvel Universe',
			})
			student.save((err, student) => {
				chai
					.request(server)
					.delete('/student/' + student.id)
					.end((err, res) => {
						res.should.have.status(200)
						res.body.should.be.a('object')
						res.body.should.have
							.property('message')
							.eql('Student successfully deleted!')
						res.body.result.should.have.property('deletedCount').eql(1)
						done()
					})
			})
		})
	})
})w
