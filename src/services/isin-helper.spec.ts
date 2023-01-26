import { describe, expect, it } from 'vitest';
import { ISIN, validateISIN, ValidationError } from './isin-helper'
describe('validateISIN', () => {
    it('lets a valid ISIN through', () => {
        const isin = validateISIN('DE000BASF111') as ISIN;
        expect(isin.value).toBe('DE000BASF111')
        expect(isin.countryCode).toBe('DE')
        expect(isin.nationalSecurityIdentifier).toBe('000BASF11')
        expect(isin.checkDigit).toBe('1')
    })

    it('validates length', () => {
        const errors = validateISIN('DE000BASF11') as ValidationError[];
        expect(errors.length).toBe(1)
        expect(errors[0]).toBe(ValidationError.WRONG_LENGTH)
    })

    it('validates country code', () => {
        const errors = validateISIN('D9000BASF111') as ValidationError[];
        expect(errors.length).toBe(1)
        expect(errors.includes(ValidationError.WRONG_COUNTRY_CODE)).toBe(true)
    })

    it('validates national security identifier', () => {
        const errors = validateISIN('D900+BASF111') as ValidationError[];
        expect(errors.length).toBe(2)
        expect(errors.includes(ValidationError.WRONG_COUNTRY_CODE)).toBe(true)
        expect(errors.includes(ValidationError.WRONG_NATIONAL_SECURITY_IDENTIFIER)).toBe(true)
    })

    it('validates last character to be a digit', () => {
        const errors = validateISIN('D900+BASF11A') as ValidationError[];
        expect(errors.length).toBe(3)
        expect(errors.includes(ValidationError.WRONG_COUNTRY_CODE)).toBe(true)
        expect(errors.includes(ValidationError.WRONG_NATIONAL_SECURITY_IDENTIFIER)).toBe(true)
        expect(errors.includes(ValidationError.WRONG_CHECK_DIGIT)).toBe(true)
    })

})