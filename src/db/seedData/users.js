const ObjectId = require('mongodb').ObjectID

const userData = [
  {
    _id: ObjectId('6248d60757c84470d3107aa1'),
    username: 'James',
    email: 'james@example.com',
    bio: '',
    password: '$2a$10$CxAtHi08jbEjZetJq2u4e.8XMxpdftZKLOcV/fY1QGBiCko6cX1H6',
    createdAt: new Date(1648940551453),
    posts: [
      {
        _id: ObjectId('6248db1d57c84470d3107aac'),
      },
      {
        _id: ObjectId('6248ddaf57c84470d3107acd'),
      },
      {
        _id: ObjectId('62512f51d3e66386ecc4c500'),
      },
    ],
    __v: 164,
  },
  {
    _id: ObjectId('6248df9557c84470d3107b45'),
    username: 'Mary',
    email: 'mary@example.com',
    bio: '',
    password: '$2a$10$H2/GSHMf2JgBx0TDHI8fduUrM45WgZbbWnPvHgvlhZ3cecqCexvXa',
    createdAt: new Date(1648942997389),
    posts: [
      {
        _id: ObjectId('6248e28157c84470d3107b4f'),
      },
    ],
    __v: 2,
  },
  {
    _id: ObjectId('6248e4cf57c84470d3107c07'),
    username: 'Alina',
    email: 'alina@example.com',
    bio: "Hello, it's nice to meet you! My name is Alina, and I love learning about marine life!",
    password: '$2a$10$MMV5z9DSyosxKAJ6tE7GMeBmmieQAOj4t1.sZ.w8kxWqnwk6dR/Ju',
    createdAt: new Date(1648944335238),
    posts: [
      {
        _id: ObjectId('624905b157c84470d3107c0f'),
      },
      {
        _id: ObjectId('62491e182af5961bf4617a77'),
      },
    ],
    __v: 0,
  },
  {
    _id: ObjectId('6249105bb58655fb26a6c3fc'),
    username: 'Peter',
    email: 'Peter@example.com',
    bio: '',
    password: '$2a$10$l8bfI1V0ZGwrU3n/5.63/u3iXrs3vAz3/yqjZ5wHNR/Vl0KqEBnrW',
    createdAt: new Date(1648955483241),
    posts: [
      {
        _id: ObjectId('6249321e2af5961bf4617c1a'),
      },
    ],
    __v: 0,
  },
  {
    _id: ObjectId('624932f72af5961bf4617c6f'),
    username: 'Jeremy',
    email: 'jeremy@example.com',
    bio: 'Hi, my name is Jeremy. I love too cook!',
    password: '$2a$10$vvAuWJcY8WtJ0/TPDdOQ/OswHtzZXNjLM2RXruGxt3nnUEg9JjaVO',
    createdAt: new Date(1648964343247),
    posts: [
      {
        _id: ObjectId('6249348a2af5961bf4617c79'),
      },
    ],
    __v: 0,
  },
  {
    _id: ObjectId('624935d42af5961bf4617d2a'),
    username: 'Richard',
    email: 'richard@example.com',
    bio: '',
    password: '$2a$10$Q.K6Xts3TArL6iJKEqfgS.sPSUiIvKndTtDGWY3WAkfIyxL/3kd8.',
    createdAt: new Date(1648965076983),
    posts: [
      {
        _id: ObjectId('6249383d2af5961bf4617d31'),
      },
    ],
    __v: 0,
  },
  {
    _id: ObjectId('62539f5cd2acc41438c15c4d'),
    username: 'Arthur',
    email: 'arthur@example.com',
    bio: "Hi there, my name is Arthur. It's nice to meet you!",
    password: '$2a$10$0lcRvch7z9G89L1OTRS7Tu3XOxit1Z0/gwZY9N0s1QOWVEtA.PzDK',
    createdAt: new Date(1649647452629),
    posts: [
      {
        _id: ObjectId('6253a06ed2acc41438c15c59'),
      },
      {
        _id: ObjectId('6253a6fdd893457dac887356'),
      },
      {
        _id: ObjectId('6253a8fed893457dac8878e8'),
      },
    ],
    __v: 46,
  },
  {
    _id: ObjectId('625fbda44aa3cc38026b7569'),
    username: 'Thomas',
    email: 'thomas@example.com',
    bio: '',
    password: '$2a$10$bZcOyijOlaDfK4iPMlUktOXUgni9yQ317BSxjJOvPUla1g0IZCkta',
    createdAt: new Date(1650441636681),
    posts: [],
    __v: 4,
  },
  {
    _id: ObjectId('6260b23d4aa3cc38026b76d3'),
    username: 'minhtran',
    email: 'lkjfsdlkfdsj@gmail.com',
    bio: 'My name is Minh',
    password: '$2a$10$/N99qA1jv5XnclxKJoiNq.9aGJIwPJgBpOoIlt.M2ELYixP1tr5D2',
    createdAt: new Date(1650504253816),
    posts: [
      {
        _id: ObjectId('6260b313b46ec4f38ee724c1'),
      },
    ],
    __v: 1,
  },
]

module.exports = userData
