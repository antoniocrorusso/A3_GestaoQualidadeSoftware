import { format } from 'date-fns';

export const formatDateToInput = (date: string): string => {
    return format(new Date(date), 'yyyy-MM-dd');
};
