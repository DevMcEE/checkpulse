import axios from "axios";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { PORT } from "../src/config";
import { startServer } from "../src/app";
import { Server } from "http";


vi.mock("axios")
let server: Server
const BASE_URL = `http://localhost:${PORT}`;

describe("Ping Service", () => {
    beforeAll(() => {
        server = startServer(PORT)
    })
    afterAll(() => {
        server.close()
    })

    it("Should return code 200 and type 'text/plain'", async () => {
        const url = `${BASE_URL}/ping/url/example.com?timeout=4000`;
        const mockGet = vi.spyOn(axios, "get").mockResolvedValue({
            status:200,
            data:"uhm, okay",
            headers: {"content-type": "text/plain"},
            statusText: "OK",
            config: {}
        })
        const res = await fetch(url)
        const json = await res.json();
        expect(json.data).toHaveProperty("code", 200)
        expect(json.data).toHaveProperty("type", "text/plain")

        mockGet.mockRestore();
        
    })
    it("Server should return code 400 and error message cause of invalid address", async () => {
        const url = `${BASE_URL}/ping/url/example?timeout=4000`;
        const mockGet = vi.spyOn(axios, "get").mockResolvedValue({
            status:200,
            data:"uhm, okay",
            headers: {"content-type": "text/plain"},
            statusText: "OK",
            config: {}
        })
        const res = await fetch(url)
        const json = await res.json();

        expect(res).toHaveProperty("status", 400)
        expect(json).toHaveProperty("error")

        mockGet.mockRestore();
    })
    it("Server should return code 400 and error message cause of invalid ip", async () => {
        const url = `${BASE_URL}/ping/ip/945.123.112`;
        const mockGet = vi.spyOn(axios, "get").mockResolvedValue({
            status:200,
            data:"uhm, okay",
            headers: {"content-type": "text/plain"},
            statusText: "OK",
            config: {}
        })
        const res = await fetch(url)
        const json = await res.json();

        expect(res).toHaveProperty("status", 400)
        expect(json).toHaveProperty("error")

        mockGet.mockRestore();
    })
    it("Should return timeouted = true", async () => {
        const url = `${BASE_URL}/ping/url/example.com?timeout=50000`;
        const error: any = new Error("timeout");
        error.code = "ECONNABORTED";

        const mockGet = vi.spyOn(axios, "get").mockRejectedValue(error);

        const res = await fetch(url)
        
        const json = await res.json();
        console.log(json)
        expect(json.data).toHaveProperty("timeouted", true)
        mockGet.mockRestore();
    })
})