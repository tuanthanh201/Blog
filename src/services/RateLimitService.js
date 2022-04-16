const { DataSource } = require('apollo-datasource')

class RateLimitService extends DataSource {
  constructor({ store }) {
    super()
    this.store = store
  }

  initialize(config) {
    this.context = config.context
  }

  async rateLimit({ type, interval, callsPerInterval }) {
    let now = new Date()
    now = now.getTime()
    const ipAddr = this.context.req.ip
    const key = `${ipAddr}:${type}`
    await this.context.redis
      .zRemRangeByScore(key, 0, now - interval)
      .catch((e) => console.log(e))
    await this.context.redis.expire(key, interval)
    const calls = (await this.context.redis.zCard(key)) + 1
    if (calls > callsPerInterval) {
      throw new Error('Maximum number of calls reached')
    }
    await this.context.redis.zAdd(key, { value: now, score: now })
  }
}

module.exports = RateLimitService
