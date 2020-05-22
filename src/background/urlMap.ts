// @ts-ignore
import axios from "axios";
import { noRedirectFamilyPortalUrl } from "./index";

export interface UrlMap {
  saml: string;
  canvas: string;
}

export interface FullUrlMap extends UrlMap {
  fetchedAt: number;
}

let map: FullUrlMap = {
  saml: "",
  canvas: "",
  fetchedAt: 0,
};

export async function getUrlMap() {
  if (map.fetchedAt < Date.now() - 3600000) {
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
      fetchedAt: Date.now(),
    } as FullUrlMap;
  } catch (e) {
    return {
      saml: noRedirectFamilyPortalUrl,
      canvas: noRedirectFamilyPortalUrl,
      fetchedAt: 0,
    };
  }
}
