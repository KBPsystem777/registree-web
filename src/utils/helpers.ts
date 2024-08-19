export const truncate = (str: string) => {
    return str?.length > 10 ? `${str.substring(0, 8)}...${str.slice(-4)}` : str;
};

export const truncateText = (str:string, len:number) => {
    return str?.length > len ? `${str.substring(0, len)}...` : str;
}
// export const truncateText = (str: string) => {
//     return str?.length > 17 ? `${str.substring(0, 15)}...` : str;
// };

export const isValidUrlx = (urlString:string) => {
    try {
        return Boolean(new URL(urlString));
    }
    catch(e){
        return false;
    }
}


export const isValidUrl = (urlString:string) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

export function format (num:any) {
    const n = String(num),
        p = n.indexOf('.')
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m, i) =>
        p < 0 || i < p ? `${m},` : m
    )
}

export function dateDiff(date1:Date, date2:Date) {
    date1.setHours(0);
    date1.setMinutes(0, 0, 0);
    date2.setHours(0);
    date2.setMinutes(0, 0, 0);
    const datedifference = Math.abs(date1.getTime() - date2.getTime()); // difference
    return parseInt(String(datedifference / (24 * 60 * 60 * 1000)), 10); //Convert values days and return value
}

export const pxToVh = (value:any) => {
    const w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight

    const result = (100 * value) / y
    return result
}

export const errorCatcher = (e:any) => {
    const err = JSON.parse(JSON.stringify(e));
    if (err && err?.code && err.code === "UNPREDICTABLE_GAS_LIMIT") {
        if (err?.error?.message) {
            // return 'Error: You must be the owner of this NFT';
            return err.error.message;
        }
    } else {
        if (err.reason) {
            return err.reason;
        } else if (err && err?.error && err?.error?.message) {
            return err.error.message;
        } else if (err && err?.message) {
            return err.message;
        } else {
            return "Contract transaction failed";
        }
    }
}