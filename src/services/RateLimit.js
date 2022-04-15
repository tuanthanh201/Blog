const { DataSource } = require('apollo-datasource')

class RateLimit extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
    this.interval = 24 * 60 * 60 * 1000
    this.callsPerDay = 150
  }

  initialize(config) {
    this.context = config.context
  }

  async rateLimit() {
    let now = new Date()
    now = now.getTime()
    const ipAddr = this.context.req.ip
    const key = ipAddr + ':daily'
    await this.context.redis
      .zRemRangeByScore(key, 0, now - this.interval)
      .catch((e) => console.log(e))
    await this.context.redis.expire(key, this.interval)
    const calls = (await this.context.redis.zCard(key)) + 1
    if (calls > this.callsPerDay) {
      throw new Error('Maximum number of calls reached')
    }
    await this.context.redis.zAdd(key, { value: now, score: now })
  }
}

module.exports = RateLimit
