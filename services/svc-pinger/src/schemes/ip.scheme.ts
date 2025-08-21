import { z } from "zod";
import { ISchemeProps } from "../types/api.interfaces";

const IPV4_WITH_PORT_PATH_REGEX =
  /^(?![a-zA-Z][a-zA-Z0-9+.-]*:\/\/)(?<ip>(?:\d{1,3}\.){3}\d{1,3})(?::(?<port>\d{1,5}))?(?<rest>(?:[/?#][^\s]*)?)$/;

export const ipv4Scheme = z.string()
  .regex(IPV4_WITH_PORT_PATH_REGEX, "Invalid IPv4, port, or path")
  .refine((val) => {
    const match = val.match(IPV4_WITH_PORT_PATH_REGEX);
    if (!match) return false;

    const ip = match.groups?.ip;
    if (!ip) return false;

    const parts = ip.split(".").map(Number);
    if (parts.some(x => x < 0 || x > 255)) return false;
    
    const port = match.groups?.port ? Number(match.groups.port) : undefined;
    if (port !== undefined && (port < 1 || port > 65535)) return false;

    return true;
  }, "Invalid IPv4, port, or path");
  
export const ipv4Props: ISchemeProps = { scheme: ipv4Scheme, hostType: 'IPv4'}