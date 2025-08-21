import axios from "axios";
import { pingController } from "../src/controllers/ping.controller";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("axios")

const mockRes = () => {
    const res: any = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    res.sendStatus = vi.fn().mockReturnValue(res)
    return res
}

describe("pingController", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("Should return code 200 and data", async () => {
        const req: any = {
            params: {address: "example.com%2Ftest%3Fmonkey%3Dcool"},
            query: {}
        }
        const res = mockRes();
        (axios.get as any).mockResolvedValue({
            status: 200,
            headers: {"content-type": "application/json"},
            data: { hello: "world" }
        })

        await pingController(req, res)
        
        expect(axios.get).toHaveBeenCalledWith("https://example.com/test?monkey=cool", {timeout: 30000});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    code: 200,
                    type: "application/json",
                    message: {hello: "world"}
                })
            })
        )
    })
    it("Should return timeouted=true if ECONNABORTED", async () => {
    const req: any = {
      params: { address: "example.com" },
      query: {}
    };
    const res = mockRes();

    (axios.get as any).mockRejectedValue({ code: "ECONNABORTED" });

    await pingController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ timeouted: true })
      })
    );
  });

  it("Should return code 404", async () => {
    const req: any = {
      params: { address: "example.com" },
      query: {}
    };
    const res = mockRes();

    (axios.get as any).mockRejectedValue({
      response: {
        status: 404,
        headers: { "content-type": "text/html" },
        message: "Not found"
      }
    });

    await pingController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          code: 404,
          type: "text/html",
          message: "Not found"
        })
      })
    );
  });

  it("Should return code 500", async () => {
    const req: any = {
      params: { address: "example.com" },
      query: {}
    };
    const res = mockRes();

    (axios.get as any).mockRejectedValue(new Error("boom"));

    await pingController(req, res );

    expect(res.status).toHaveBeenCalledWith(500);
  });
})