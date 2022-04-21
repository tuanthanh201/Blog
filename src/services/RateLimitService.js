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
    // interval is in microseconds
    let now = new Date()
    now = now.getTime()
    const ipAddr =
      this.context.req.headers['x-forwarded-for'] ||
      this.context.req.connection.remoteAddress
    const key = `${ipAddr}:${type}`
    await this.context.redis
      .zRemRangeByScore(key, 0, now - interval)
      .catch((e) => console.log(e))
    // redis.expire takes time in seconds, so divide by 1000
    await this.context.redis.expire(key, interval / 1000)
    const calls = (await this.context.redis.zCard(key)) + 1
    if (calls > callsPerInterval) {
      throw new Error('Maximum number of calls reached')
    }
    await this.context.redis.zAdd(key, { value: now, score: now })
  }
}

module.exports = RateLimitService
