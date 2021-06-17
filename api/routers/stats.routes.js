const Stats = require('../controllers/stats.cotroller');

module.exports = (app) => {
    app.route('/stats/waivers/:filter')
    .get(Stats.getWaiverStats);

    app.route('/stats/data/waivers')
    .get(Stats.getData);

    app.route('/stats/data/remarks')
    .get(Stats.getData);

    app.route('/stats/data/actions')
    .get(Stats.getData);

    app.route('/stats/data/authorizations')
    .get(Stats.getData);

}