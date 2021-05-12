const Stats = require('../controllers/stats.cotroller');

module.exports = (app) => {
    app.route('/stats/waivers/:filter')
    .get(Stats.getWaiverStats);
}