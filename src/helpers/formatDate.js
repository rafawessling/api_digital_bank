import { format } from 'date-fns';

const formatDate = date => {
    const formattedDate = format(new Date(date), 'yyyy-MM-dd kk:mm:ss');
    return formattedDate;
};

export { formatDate };
