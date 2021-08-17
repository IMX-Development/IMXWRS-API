const events = require('../helpers/tasks');


module.exports = (cron) => {
    let everyMondayMorning = '0 0 8 * * 1';
    let everyDay = '0 0 2 * * *';
    let tasks = [];
    
    var task = cron.schedule('0 0 8 * * 1', ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pendingTasks();
    });

    tasks.push(task);

    task = cron.schedule('0 0 7 * * 1', ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.unfinishedWaivers();
    });

    tasks.push(task);

    task = cron.schedule(everyDay, ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.expireActions();
    });

    tasks.push(task);

    console.log('tasks => ' + tasks.length);

    tasks.forEach(t=>{
        t.start();
    });
}