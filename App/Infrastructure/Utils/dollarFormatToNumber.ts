export function dollarToNumber(dollarString: string): number {
    return parseFloat(dollarString.replace(/[$,]/g, ''));
}
