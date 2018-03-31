/**
 * 将多维数组扁平化为一维数组
 * @param arr 任意嵌套的数组
 * @returns 扁平化后的一维数组
 */
export function flattenArray(arr: any[]): any[] {
    let result: any[] = [];
    (function readIn(a: any[]): void {
        a.forEach(element => {
            if (element instanceof Array) {
                readIn(element);
            } else {
                result.push(element);
            }
        });
    })(arr);
    return result;
}

export function structuredClone(obj: any) {
    return new Promise(resolve => {
        const { port1, port2 } = new MessageChannel();
        port2.onmessage = event => resolve(event.data);
        port1.postMessage(obj);
    });
}
