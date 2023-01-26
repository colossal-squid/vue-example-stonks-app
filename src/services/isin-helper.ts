export enum ValidationError {
    WRONG_LENGTH = "Code you've entered has to be 12 digits",
    WRONG_COUNTRY_CODE = "First two characters are not a valid country code",
    WRONG_NATIONAL_SECURITY_IDENTIFIER = 'National security identifier must only contain alphanumeric characters',
    WRONG_CHECK_DIGIT = 'Last character has to be a number',
}

export class ISIN {
    value: string = '';

    constructor(isin: string) {
        this.value = isin;
    }

    get checkDigit(): string {
        return this.value.substring(11)
    }

    get countryCode(): string {
        return this.value.substring(0, 2);
    }

    get nationalSecurityIdentifier(): string {
        return this.value.substring(2, 11);
    }
}
/**
 * 
 * Validation rules: An ISIN is a 12-character alphanumeric code.
 * It consists of three parts: 
 *  - A two letter country code,
 * - a nine character alpha-numeric national security identifier,
 * - a single check digit. 
 * Example:- US0378331005.
 * @returns 
 */
export function validateISIN(test: string): ValidationError[] | ISIN {
    if (!test) {
        return [ValidationError.WRONG_LENGTH];
    } else {
        if (test.length !== 12) {
            return [ValidationError.WRONG_LENGTH];
        } else {
            const errors: ValidationError[] = [];
            const isin = new ISIN(test)
            if (!/[A-Za-z]{2}/g.test(isin.countryCode)) {
                errors.push(ValidationError.WRONG_COUNTRY_CODE)
            }
            if (!/[A-Za-z0-9]{9}/g.test(isin.nationalSecurityIdentifier)) {
                errors.push(ValidationError.WRONG_NATIONAL_SECURITY_IDENTIFIER)
            }
            if (!/[0-9]{1}/g.test(isin.checkDigit)) {
                errors.push(ValidationError.WRONG_CHECK_DIGIT)
            }
            if (errors.length) {
                return errors;
            } else {
                return isin;
            }
        }
    }
}