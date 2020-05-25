// @ts-ignore
import axios from "axios";
import { noRedirectFamilyPortalUrl } from "./index";

export interface UrlMap {
  saml: string;
  canvas: string;
}

export interface FullUrlMap extends UrlMap {
  // epoch seconds when fetched
  fetchedAt: number;
}

let map: FullUrlMap = {
  saml: "",
  canvas: "",
  fetchedAt: 0,
};

function getEpochSeconds(): FullUrlMap["fetchedAt"] {
  return Math.floor(Date.now() / 1000);
}

function shouldRefetch(fetchedAt: FullUrlMap["fetchedAt"]): boolean {
  return fetchedAt < getEpochSeconds() - 86400;
}

export async function getUrlMap(forceRefetch: boolean = false) {
  if (forceRefetch || shouldRefetch(map.fetchedAt)) {
    map = await fetchUrlMap();
  }

  return map as UrlMap;
}

async function fetchUrlMap(): Promise<FullUrlMap> {
  try {
    const mapReq = await axios({
      method: "get",
      url: "https://go.canvascbl.com/canvas-fixer/url-map",
    });

    return {
      saml: mapReq.data.saml,
      canvas: mapReq.data.canvas,
      fetchedAt: getEpochSeconds(),
    } as FullUrlMap;
  } catch (e) {
    return {
      saml: noRedirectFamilyPortalUrl,
      canvas: noRedirectFamilyPortalUrl,
      fetchedAt: 0,
    };
  }
}
