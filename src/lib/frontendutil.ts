import { onMount } from "svelte";

/**
 * Returns whether or not the given hex color is very white or not.
 * @param str The HEX string
 * @returns Whether or not it is white
 */
export function isWhite(str: string): boolean {
    if (!str) return false;
    const whiteLimit = 255/2; // this changes what counts as "white"
    const r = parseInt("0x"+str.substring(1,3));
    const g = parseInt("0x"+str.substring(3,5));
    const b = parseInt("0x"+str.substring(5,7));
    if(r < whiteLimit || b < whiteLimit || g < whiteLimit) {
        return false;
    } 
    return true;    
}

export function docTitle(title: string, override: boolean = false): void {
    onMount(() => {
        if (override) {
            document.title = title;
        } else {
            document.title = "FRC Tree - " + title;
        }
    });
}