const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics

let Promise = require('bluebird')
let ip = require('ip')

const registry = new client.Registry()

module.exports = function relation(options) {
  
  let Seneca = this
  let senact = Promise.promisify(Seneca.act, {context: Seneca})

  client.collectDefaultMetrics({registry})

  let gauges = {}

  function pack (begin_ts, end_ts) {
    // pack begin_ts with 1/ e_tm
    let pe_tm = 1 / (end_ts - begin_ts)
    return begin_ts + pe_tm
  }

  Seneca.add('role:relation,cmd:metrics.collect', async (msg, reply) => {
    try {
      let Seneca = this
      // Enable the collection of default metrics

      let r = (await registry.metrics())

      return reply(null,{result:r})
    } catch(e) {
      console.log(e)
    }
  })

  Seneca.add({role:'relation', cmd:'add'}, async (msg,reply) => {

    let begin_ts = Date.now()

    if (!gauges['relation.add.ts'])
      gauges['relation.add.ts'] = new client.Gauge({
        name: 'perf_relation_add_ts',
        help: 'ts when adding a relation',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let r = (await senact('role:store,cmd:addRelation',
                            {aid:msg.aid,sid:msg.sid,type:msg.type,cid:msg.cid,auth:msg.auth}).then ((o) => {
                              return o
                            }))

      gauges['relation.add.ts'].set({event:'relation.add', return_code:'200', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      return reply(null,r)
    } catch(e) {
      console.log(e)
      gauges['relation.add.ts'].set({event:'relation.add', return_code:'500', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add({role:'relation', cmd:'get'}, async (msg,reply) => {

    let begin_ts = Date.now()

    if (!gauges['relation.get.ts'])
      gauges['relation.get.ts'] = new client.Gauge({
        name: 'perf_relation_get_ts',
        help: 'ts when getting a relation',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let r = (await senact('role:store,cmd:getRelation',
                            {id:msg.id,cid:msg.cid}).then ((o) => {
                              return o
                            }))
      gauges['relation.get.ts'].set({event:'relation.get', return_code:'200', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      return reply(null,r)
    } catch(e) {
      console.log(e)
      gauges['relation.get.ts'].set({event:'relation.get', return_code:'500', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add({role:'relation', cmd:'upd'}, async (msg,reply) => {

    let begin_ts = Date.now()

    if (!gauges['relation.upd.ts'])
      gauges['relation.upd.ts'] = new client.Gauge({
        name: 'perf_relation_upd_ts',
        help: 'ts when updating a relation',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      let r = (await senact('role:store,cmd:updRelation',
                            {id:msg.id,type:msg.type,cid:msg.cid,auth:msg.auth}).then ((o) => {
                              return o
                            }))
      gauges['relation.upd.ts'].set({event:'relation.upd', return_code:'200', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))

      return reply(null,r)
    } catch(e) {
      console.log(e)
      gauges['relation.upd.ts'].set({event:'relation.upd', return_code:'500', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })

  Seneca.add({role:'relation', cmd:'drp'}, async (msg,done) => {

    let begin_ts = Date.now()

    if (!gauges['relation.drp.ts'])
      gauges['relation.drp.ts'] = new client.Gauge({
        name: 'perf_relation_drp_ts',
        help: 'ts when dropping a relation',
        labelNames: ['event','return_code','service','cluster','app','user','ip','cid'],
        registers: [registry]
      })

    try {
      (await senact('role:store,cmd:drpRelation',
                    {id:msg.id,cid:msg.cid}).then ((o) => {
                      return o
                    }))
      gauges['relation.drp.ts'].set({event:'relation.drp', return_code:'200', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:msg.cid}, pack(begin_ts, Date.now()))
      done(null,{})
    } catch(e) {
      console.log(e)
      gauges['relation.drp.ts'].set({event:'relation.drp', return_code:'500', service:'relation', cluster:process.env.cluster, app:process.env.app, user:process.env.user, ip:ip.address(), cid:{}}, pack(begin_ts, Date.now()))
    }
  })
}
