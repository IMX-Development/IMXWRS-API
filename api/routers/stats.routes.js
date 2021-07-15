const Stats = require('../controllers/stats.cotroller');

module.exports = (app) => {
    app.route('/stats/waivers/:filter')
    .get(Stats.getWaiverStats);

    app.route('/stats/data/waivers/:user/:type')
    .get(Stats.getWaiverData);

    app.route('/stats/data/remarks/:user/:type')
    .get(Stats.getData);

    app.route('/stats/data/actions/:user/:type')
    .get(Stats.getData);

    app.route('/stats/data/authorizations/:user/:type')
    .get(Stats.getData);

}