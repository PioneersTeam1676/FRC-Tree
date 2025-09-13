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

// Password validation shared logic (client-only helper)
// Policy: minimum 8 chars AND at least two of these categories:
//  - Uppercase letter A-Z
//  - Digit 0-9
//  - Special (non-alphanumeric)
export function validatePasswordComplexity(pw: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    if (typeof pw !== 'string' || pw.length < 8) {
        issues.push('at least 8 characters');
    }
    const hasUpper = /[A-Z]/.test(pw);
    const hasDigit = /\d/.test(pw);
    const hasSpecial = /[^A-Za-z0-9]/.test(pw);
    const categories = [hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
    if (categories < 2) {
        issues.push('at least two of: uppercase, number, special');
    }
    return { valid: issues.length === 0, issues };
}