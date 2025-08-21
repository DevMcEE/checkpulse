import { describe, it, expect } from 'vitest'
import { urlScheme } from '../src/schemes/url.scheme'

const invalidAddresses = ["1:2", "zxc", "123"]
const validAddresses = ["example.com", "localhost:3000", "sub.domain.org", "www.google.com/search?q=test", "example.org"]

describe("URL scheme", () => {
    it.each(invalidAddresses)("Should throw the validation error", async (address) => {
        expect(() => urlScheme.parse(address)).toThrow()
    }) 
    it.each(validAddresses)("Should not throw the validation error", async (address) => {
        expect(() => urlScheme.parse(address)).not.toThrow()
    })
})