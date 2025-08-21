import { describe, it, expect, vi } from 'vitest'
import { pingMiddleware } from '../src/middlewares/ping.middleware'
import { Request, Response, NextFunction } from 'express'

const urlProps: ISchemeProps = { scheme: urlScheme, hostType: "URL" }
import { ipv4Props } from '../src/schemes/ip.scheme'
import { ISchemeProps } from '../src/types/api.interfaces'
import { urlScheme } from '../src/schemes/url.scheme'

describe('pingMiddleware', () => {
  it('Should call next if address is valid URL', () => {
    const req = { params: { address: 'example.com' } } as unknown as Request
    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status } as unknown as Response
    const next = vi.fn() as NextFunction
    const middleware = pingMiddleware(urlProps)
    middleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(status).not.toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })

  it('Should not call next and return status code 400 if address is missing', () => {
    const req = { params: {} } as unknown as Request
    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status } as unknown as Response
    const next = vi.fn() as NextFunction

    const middleware = pingMiddleware(urlProps)
    middleware(req, res, next)

    expect(json).toHaveBeenCalled()
    const responseArg = json.mock.calls[0][0]
    expect(responseArg.data.code).toBe(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('Should not call next and return status code 400 if URL address is invalid', () => {
    const req = { params: { address: 'invalid-url' } } as unknown as Request
    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status } as unknown as Response
    const next = vi.fn() as NextFunction

    const middleware = pingMiddleware(urlProps)
    middleware(req, res, next)

    expect(json).toHaveBeenCalled()
    const responseArg = json.mock.calls[0][0]
    expect(responseArg.data.code).toBe(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('Should not call next and return status code 400 if IP address is invalid', () => {
    const req = { params: {address: 'zxcqwe.com'}} as unknown as Request
    const json = vi.fn()
    const status = vi.fn(() => ({json}))
    const res = { status } as unknown as Response
    const next = vi.fn() as NextFunction

    const middleware = pingMiddleware(ipv4Props)
    middleware(req, res, next)

    expect(json).toHaveBeenCalled()
    const responseArg = json.mock.calls[0][0]
    expect(responseArg.data.code).toBe(400)
    expect(next).not.toHaveBeenCalled()
  })

  it('Should call next if IP address is valid', () => {
    const req = { params: {address: '192.168.0.1'}} as unknown as Request
    const json = vi.fn()
    const status = vi.fn(() => ({json}))
    const res = { status } as unknown as Response
    const next = vi.fn() as NextFunction

    const middleware = pingMiddleware(ipv4Props)
    middleware(req, res, next)

    
    expect(status).not.toHaveBeenNthCalledWith
    expect(next).toHaveBeenCalled()
    expect(json).not.toHaveBeenCalled()
  })
})
