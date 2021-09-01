const events = require('../helpers/tasks');

console.log('hola');
// events.pswActionExpired();
events.pswActionReminders();

module.exports = (cron) => {
    let everyMondayMorning = '0 0 8 * * 1';
    let pswActionReminder = '0 15 2 * * *';
    let pswActionExpired = '0 20 2 * * *';
    let pswDailyEscalation = '0 25 2 * * *';
    let pswWeeklyEscalation = '0 30 2 * * *';

    let everyDay = '0 0 2 * * *';
    let tasks = [];
    
    var task = cron.schedule('0 0 8 * * 1', ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pendingTasks();
    });

    tasks.push(task);

    task = cron.schedule(pswActionReminder, () => {

    });

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