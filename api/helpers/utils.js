exports.convertDate = (date) =>{
    try{
        const value = date.toJSON().slice(0,10).split('-').reverse().join('-');
        return value;
    }catch(e){
        return '';
    }
}