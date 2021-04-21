
module.exports = (cron) => {
    let everyMondayMorning = '0 0 8 * * 1';
    let tasks = [];
    
    var task = cron.schedule('*/20 * * * * *', ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        // events.pendingTasks();
    });

    tasks.push(task);

    task = cron.schedule('*/5 * * * * *', ()=>{
        let date = new Date().toString();
        console.log('Running task at ' + date);
        // events.pendingTasks();
    });

    tasks.push(task);

    console.log('tasks => ' + tasks.length);

    tasks.forEach(t=>{
        t.start();
    })
}