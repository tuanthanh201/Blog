const ObjectId = require('mongodb').ObjectID

const userData = [
  {
    _id: ObjectId('6248d60757c84470d3107aa1'),
    username: 'James',
    email: 'james@example.com',
    bio: '',
    password: '$2a$10$CxAtHi08jbEjZetJq2u4e.8XMxpdftZKLOcV/fY1QGBiCko6cX1H6',
    createdAt: new Date('2022-04-02T23:02:31.453Z'),
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
    __v: 11,
  },
  {
    _id: ObjectId('6248df9557c84470d3107b45'),
    username: 'Mary',
    email: 'mary@example.com',
    bio: '',
    password: '$2a$10$H2/GSHMf2JgBx0TDHI8fduUrM45WgZbbWnPvHgvlhZ3cecqCexvXa',
    createdAt: new Date('2022-04-02T23:43:17.389Z'),
    posts: [
      {
        _id: ObjectId('6248e28157c84470d3107b4f'),
      },
    ],
    __v: 1,
  },
  {
    _id: ObjectId('6248e4cf57c84470d3107c07'),
    username: 'Alina',
    email: 'alina@example.com',
    bio: "Hello, it's nice to meet you! My name is Alina, and I love learning about marine life!",
    password: '$2a$10$MMV5z9DSyosxKAJ6tE7GMeBmmieQAOj4t1.sZ.w8kxWqnwk6dR/Ju',
    createdAt: new Date('2022-04-03T00:05:35.238Z'),
    posts: [
      {
        _id: ObjectId('624905b157c84470d3107c0f'),
      },
      {
        _id: ObjectId('62491e182af5961bf4617a77'),
      },
    ],
    __v: 2,
  },
  {
    _id: ObjectId('6249105bb58655fb26a6c3fc'),
    username: 'Peter',
    email: 'Peter@example.com',
    bio: '',
    password: '$2a$10$l8bfI1V0ZGwrU3n/5.63/u3iXrs3vAz3/yqjZ5wHNR/Vl0KqEBnrW',
    createdAt: new Date('2022-04-03T03:11:23.241Z'),
    posts: [
      {
        _id: ObjectId('6249321e2af5961bf4617c1a'),
      },
    ],
    __v: 21,
  },
  {
    _id: ObjectId('624932f72af5961bf4617c6f'),
    username: 'Jeremy',
    email: 'jeremy@example.com',
    bio: '',
    password: '$2a$10$vvAuWJcY8WtJ0/TPDdOQ/OswHtzZXNjLM2RXruGxt3nnUEg9JjaVO',
    createdAt: new Date('2022-04-03T05:39:03.247Z'),
    posts: [
      {
        _id: ObjectId('6249348a2af5961bf4617c79'),
      },
    ],
    __v: 1,
  },
  {
    _id: ObjectId('624935d42af5961bf4617d2a'),
    username: 'Richard',
    email: 'richard@example.com',
    bio: '',
    password: '$2a$10$Q.K6Xts3TArL6iJKEqfgS.sPSUiIvKndTtDGWY3WAkfIyxL/3kd8.',
    createdAt: new Date('2022-04-03T05:51:16.983Z'),
    posts: [
      {
        _id: ObjectId('6249383d2af5961bf4617d31'),
      },
    ],
    __v: 1,
  },
  {
    _id: ObjectId('62539f5cd2acc41438c15c4d'),
    username: 'Arthur',
    email: 'arthur@example.com',
    bio: '',
    password: '$2a$10$0lcRvch7z9G89L1OTRS7Tu3XOxit1Z0/gwZY9N0s1QOWVEtA.PzDK',
    createdAt: new Date('2022-04-11T03:24:12.629Z'),
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
    __v: 27,
  },
]

module.exports = userData
