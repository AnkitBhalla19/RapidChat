import dayjs from "dayjs";

export const dateFormat = (date: string) => {
    const now=dayjs();
    const newMessageDate=dayjs(date);

    if(now.diff(newMessageDate,'minute')<1){
        return 'Just Now';
    }
    if(now.diff(newMessageDate,'hour')<1){
        return newMessageDate.format('hh:mm A');
    }
    if(now.diff(newMessageDate,'day')<1){
        return newMessageDate.format('hh:mm A');
    }
    if(now.diff(newMessageDate,'year')<1){
        return newMessageDate.format('MMM DD hh:mm A');
    }
    return newMessageDate.format('DDD MM YYYY hh:mm A');

};