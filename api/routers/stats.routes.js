const Stats = require('../controllers/stats.cotroller');

module.exports = (app) => {
    app.route('/stats/waivers/:filter')
    .get(Stats.getWaiverStats);

    app.route('/stats/data/waivers/:user/:type')
    .get(Stats.getWaiverData);

    app.route('/stats/data/remarks/:user/:type')
    .get(Stats.getRemarksData);

    app.route('/stats/data/actions/:user/:type')
    .get(Stats.getActionData);

    app.route('/stats/data/authorizations/:user/:type')
    .get(Stats.getAuthorizationsData);

    app.route('/stats/data/acknowledgements/:user/:type')
    .get(Stats.getAuthorizationsData);

}