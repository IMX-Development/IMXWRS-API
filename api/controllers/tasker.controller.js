const events = require('../helpers/tasks');

// console.log('hola');
// events.pswActionExpired();
// events.pswActionReminders();
// events.pswFirstEscalation();
// events.pswWeeklyScalation();

module.exports = (cron) => {
    let everyMondayMorning = '0 0 8 * * 1';
    let pswActionReminder = '0 15 2 * * *';
    let pswActionExpired = '0 20 2 * * *';
    let pswDailyEscalation = '0 25 2 * * *';
    let pswWeeklyEscalation = '0 30 2 * * *';
    let waiverActionReminder = '0 15 3 * * *';
    let waiverActionExpired = '0 20 3 * * *';
    let waiverDailyEscalation = '0 25 3 * * *';
    let waiverWeeklyEscalation = '0 30 3 * * *';

    let everyDay = '0 0 2 * * *';
    let tasks = [];
    
    var task = cron.schedule('0 0 8 * * 1', ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pendingTasks();
    });

    tasks.push(task);

    task = cron.schedule(pswActionReminder, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pswActionReminders();
    });

    tasks.push(task);

    task = cron.schedule(pswActionExpired, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pswActionExpired();
    });

    tasks.push(task);

    task = cron.schedule(pswDailyEscalation, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pswDailyEscalation();
    });

    tasks.push(task);

    task = cron.schedule(pswWeeklyEscalation, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.pswWeeklyScalation();
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

    task = cron.schedule(waiverActionReminder, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.waiverActionReminders();
    });

    tasks.push(task);

    task = cron.schedule(waiverActionExpired, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.waiverActionExpired();
    });

    tasks.push(task);

    task = cron.schedule(waiverDailyEscalation, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.waiverDailyEscalation();
    });

    tasks.push(task);

    task = cron.schedule(waiverWeeklyEscalation, () => {
        let date = new Date().toString();
        console.log('Running task at ' + date);
        events.waiverWeeklyScalation();
    });

    tasks.push(task);

    tasks.forEach(t=>{
        t.start();
    });

    console.log(tasks.length + ' scheduled tasks waiting');
}